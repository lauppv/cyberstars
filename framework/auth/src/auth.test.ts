import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { z } from 'zod';
import { makeLimiter } from '@cyberstars-framework/server-kit/rate-limit';
import {
  createAuth,
  sessionCookieName,
  type AuthOptions,
  type AuthUser,
  type StoredSession,
} from './auth.js';
import { emailField, passwordField } from './schemas.js';

// The sessions and the checks; the routes are in routes.test.ts

type Role = 'USER' | 'MODERATOR' | 'ADMIN';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const START = new Date('2026-11-13T10:00:00Z').getTime();

const store = {
  create: vi.fn(),
  findLogin: vi.fn(),
  findById: vi.fn(),
  role: vi.fn(),
  passwordHash: vi.fn(),
  setPassword: vi.fn(),
  setResetCode: vi.fn(),
  takeResetAttempt: vi.fn(),
  findResetCode: vi.fn(),
};

// The sessions in memory, each with its account's role
const rows = new Map<string, Omit<StoredSession<Role>, 'role'>>();
const roles = new Map<number, Role>();
const sessions = {
  create: vi.fn(async (s: { id: string; userId: number; secretHash: string; createdAt: Date }) => {
    rows.set(s.id, { ...s, lastSeenAt: s.createdAt });
  }),
  find: vi.fn(async (id: string) => {
    const row = rows.get(id);
    return row ? { ...row, role: roles.get(row.userId) ?? 'USER' } : null;
  }),
  touch: vi.fn(async (id: string, lastSeenAt: Date) => {
    const row = rows.get(id);
    if (row) row.lastSeenAt = lastSeenAt;
  }),
  delete: vi.fn(async (id: string) => {
    rows.delete(id);
  }),
  deleteForUser: vi.fn(async (userId: number) => {
    for (const [id, row] of rows) if (row.userId === userId) rows.delete(id);
  }),
  deleteExpired: vi.fn(async (lastSeenBefore: Date, createdBefore: Date) => {
    let count = 0;
    for (const [id, row] of rows) {
      if (row.lastSeenAt < lastSeenBefore || row.createdAt < createdBefore) {
        rows.delete(id);
        count++;
      }
    }
    return count;
  }),
};

const onSessionsEnded = vi.fn();

const signupSchema = z.object({ name: z.string(), email: emailField, password: passwordField });

const LIFETIMES = {
  user: { idleMs: 30 * DAY, absoluteMs: 90 * DAY },
  admin: { idleMs: 12 * HOUR, absoluteMs: 7 * DAY },
};

const OPTIONS: AuthOptions<Role, AuthUser<Role>, z.infer<typeof signupSchema>, 'en'> = {
  store,
  sessions,
  isAdmin: (role) => role === 'ADMIN',
  lifetimes: LIFETIMES,
  secureCookie: false,
  onSessionsEnded,
  signupSchema,
  emailLanguages: ['en'],
  sendResetCode: vi.fn(),
  limiter: makeLimiter(() => true),
};

const auth = createAuth(OPTIONS);

function fakeRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
  } as unknown as Response & {
    cookie: ReturnType<typeof vi.fn>;
    clearCookie: ReturnType<typeof vi.fn>;
  };
}

function makeReqRes(token?: string) {
  const req = { cookies: token ? { session: token } : {} } as unknown as Request;
  const res = fakeRes();
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

// Signs user 42 in now, as a login would, and gives back the cookie's token
async function signIn(userId = 42): Promise<string> {
  const res = fakeRes();
  await auth.startSession(res, userId);
  return res.cookie.mock.calls.at(-1)![1] as string;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ toFake: ['Date'], now: START });
  rows.clear();
  roles.clear();
  store.role.mockImplementation(async (id: number) => roles.get(id) ?? 'USER');
});

afterEach(() => vi.useRealTimers());

describe('sessionCookieName', () => {
  it('takes the __Host- prefix over HTTPS only', () => {
    expect(sessionCookieName(true)).toBe('__Host-session');
    expect(sessionCookieName(false)).toBe('session');
    expect(createAuth({ ...OPTIONS, secureCookie: true }).cookieName).toBe('__Host-session');
  });
});

describe('startSession', () => {
  it('keeps the session with only the hash of its secret', async () => {
    const token = await signIn();
    const [id, secret] = token.split('.') as [string, string];
    expect(token).toMatch(/^[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}$/);
    expect(sessions.create).toHaveBeenCalledWith({
      id,
      userId: 42,
      secretHash: crypto.createHash('sha256').update(secret).digest('hex'),
      createdAt: new Date(START),
    });
    expect(JSON.stringify([...rows.values()])).not.toContain(secret);
  });

  it('makes a new token every time', async () => {
    expect(await signIn()).not.toBe(await signIn());
  });

  it('sets an httpOnly, lax cookie for the whole site, as long as the idle time', async () => {
    const res = fakeRes();
    await auth.startSession(res, 42);
    expect(res.cookie).toHaveBeenCalledWith('session', expect.any(String), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * DAY,
    });
  });

  it("gives an admin's cookie the admin idle time", async () => {
    roles.set(42, 'ADMIN');
    const res = fakeRes();
    await auth.startSession(res, 42);
    expect(res.cookie).toHaveBeenCalledWith(
      'session',
      expect.any(String),
      expect.objectContaining({ maxAge: 12 * HOUR }),
    );
  });

  it('sends a __Host- cookie over HTTPS only when asked', async () => {
    const res = fakeRes();
    await createAuth({ ...OPTIONS, secureCookie: true }).startSession(res, 42);
    expect(res.cookie).toHaveBeenCalledWith(
      '__Host-session',
      expect.any(String),
      expect.objectContaining({ secure: true, path: '/' }),
    );
  });

  it('drops the session when the password changed after the login checked it', async () => {
    store.passwordHash.mockResolvedValueOnce('hash-after-reset');
    const res = fakeRes();
    await expect(auth.startSession(res, 42, 'hash-the-login-checked')).rejects.toMatchObject({
      statusCode: 401,
    });
    expect(rows.size).toBe(0);
    expect(res.cookie).not.toHaveBeenCalled();
  });

  it('keeps the session when the password is the one the login checked', async () => {
    store.passwordHash.mockResolvedValueOnce('hash-the-login-checked');
    const res = fakeRes();
    await auth.startSession(res, 42, 'hash-the-login-checked');
    expect(rows.size).toBe(1);
    expect(res.cookie).toHaveBeenCalled();
  });

  it('answers 404 when the account is gone', async () => {
    store.role.mockResolvedValueOnce(null);
    const err = await auth.startSession(fakeRes(), 42).catch((e) => e);
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(404);
    expect(sessions.create).not.toHaveBeenCalled();
  });
});

describe('sessionUserId', () => {
  it('signs in a live session', async () => {
    expect(await auth.sessionUserId(await signIn())).toBe(42);
  });

  it('refuses the right id with a wrong secret, and leaves the session be', async () => {
    const [id] = (await signIn()).split('.') as [string];
    const forged = `${id}.${'A'.repeat(43)}`;
    expect(await auth.sessionUserId(forged)).toBeNull();
    expect(rows.has(id)).toBe(true);
  });

  it('refuses no token or a malformed one without asking the store', async () => {
    expect(await auth.sessionUserId(undefined)).toBeNull();
    expect(await auth.sessionUserId('garbage')).toBeNull();
    expect(await auth.sessionUserId('invalid.jwt.token')).toBeNull();
    expect(sessions.find).not.toHaveBeenCalled();
  });

  it('refuses a token whose session is gone', async () => {
    const token = await signIn();
    rows.clear();
    expect(await auth.sessionUserId(token)).toBeNull();
  });

  it('ends a session left unused for its idle time, and deletes it', async () => {
    const token = await signIn();
    vi.setSystemTime(START + 30 * DAY - 1);
    expect(await auth.sessionUserId(token)).toBe(42);
    vi.setSystemTime(START + 30 * DAY);
    expect(await auth.sessionUserId(token)).toBeNull();
    expect(rows.size).toBe(0);
  });

  it('ends a session at its absolute end however much it is used', async () => {
    const token = await signIn();
    const [id] = token.split('.') as [string];
    rows.get(id)!.lastSeenAt = new Date(START + 90 * DAY - HOUR);
    vi.setSystemTime(START + 90 * DAY - 1);
    expect(await auth.sessionUserId(token)).toBe(42);
    vi.setSystemTime(START + 90 * DAY);
    expect(await auth.sessionUserId(token)).toBeNull();
  });

  it("goes by the account's role now: an admin's session lasts the admin's times", async () => {
    const token = await signIn();
    roles.set(42, 'ADMIN');
    vi.setSystemTime(START + 12 * HOUR);
    expect(await auth.sessionUserId(token)).toBeNull();
  });

  it("doesn't count as use", async () => {
    const token = await signIn();
    vi.setSystemTime(START + 2 * HOUR);
    await auth.sessionUserId(token);
    expect(sessions.touch).not.toHaveBeenCalled();
  });
});

describe('a session in use', () => {
  it('is seen again once an hour has gone by, its cookie set again for the idle time', async () => {
    const token = await signIn();
    vi.setSystemTime(START + HOUR - 1);
    const early = makeReqRes(token);
    await auth.authenticateToken(early.req, early.res, early.next);
    expect(sessions.touch).not.toHaveBeenCalled();
    expect(early.res.cookie).not.toHaveBeenCalled();

    vi.setSystemTime(START + HOUR);
    const later = makeReqRes(token);
    await auth.authenticateToken(later.req, later.res, later.next);
    const [id] = token.split('.') as [string];
    expect(sessions.touch).toHaveBeenCalledWith(id, new Date(START + HOUR));
    expect(later.res.cookie).toHaveBeenCalledWith(
      'session',
      token,
      expect.objectContaining({ maxAge: 30 * DAY, httpOnly: true, path: '/' }),
    );
  });

  it('stays signed in past the idle time while it is used', async () => {
    const token = await signIn();
    for (let day = 20; day <= 80; day += 20) {
      vi.setSystemTime(START + day * DAY);
      const { req, res, next } = makeReqRes(token);
      await auth.optionalAuth(req, res, next);
      expect(req.user).toEqual({ id: 42 });
    }
  });

  it('gets a cookie that ends with the session near its absolute end', async () => {
    const token = await signIn();
    const [id] = token.split('.') as [string];
    rows.get(id)!.lastSeenAt = new Date(START + 80 * DAY);
    vi.setSystemTime(START + 85 * DAY);
    const { req, res, next } = makeReqRes(token);
    await auth.authenticateToken(req, res, next);
    expect(res.cookie).toHaveBeenCalledWith(
      'session',
      token,
      expect.objectContaining({ maxAge: 5 * DAY }),
    );
  });
});

describe('setPassword', () => {
  it('hashes the password, ends every session of the account and tells the app', async () => {
    const mine = await signIn(5);
    const theirs = await signIn(5);
    const other = await signIn(6);
    await auth.setPassword(5, 'freshpass');
    const [id, hash] = store.setPassword.mock.calls[0] as [number, string];
    expect(id).toBe(5);
    expect(bcrypt.compareSync('freshpass', hash)).toBe(true);
    expect(await auth.sessionUserId(mine)).toBeNull();
    expect(await auth.sessionUserId(theirs)).toBeNull();
    expect(await auth.sessionUserId(other)).toBe(6);
    expect(onSessionsEnded).toHaveBeenCalledWith(5);
  });

  it('works for an app that keeps nothing open per account', async () => {
    const quiet = createAuth({ ...OPTIONS, onSessionsEnded: undefined });
    await expect(quiet.setPassword(5, 'freshpass')).resolves.toBeUndefined();
  });
});

describe('deleteExpiredSessions', () => {
  it('deletes the sessions past the longest idle time or absolute end', async () => {
    const idle = await signIn(1);
    vi.setSystemTime(START + 40 * DAY);
    const fresh = await signIn(2);
    const old = await signIn(3);
    const [oldId] = old.split('.') as [string];
    rows.get(oldId)!.createdAt = new Date(START - 60 * DAY);
    expect(await auth.deleteExpiredSessions()).toBe(2);
    expect(sessions.deleteExpired).toHaveBeenCalledWith(
      new Date(START + 10 * DAY),
      new Date(START - 50 * DAY),
    );
    expect(await auth.sessionUserId(idle)).toBeNull();
    expect(await auth.sessionUserId(fresh)).toBe(2);
  });
});

describe('checkCurrentPassword', () => {
  it("passes the account's own password", async () => {
    store.passwordHash.mockResolvedValue(bcrypt.hashSync('right', 4));
    await expect(auth.checkCurrentPassword(7, 'right')).resolves.toBeUndefined();
    expect(store.passwordHash).toHaveBeenCalledWith(7);
  });

  it('refuses another password with a 401', async () => {
    store.passwordHash.mockResolvedValue(bcrypt.hashSync('right', 4));
    const err = await auth.checkCurrentPassword(7, 'wrong').catch((e) => e);
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe('Current password is incorrect');
  });

  it('answers 404 when the account is gone', async () => {
    store.passwordHash.mockResolvedValue(null);
    const err = await auth.checkCurrentPassword(7, 'right').catch((e) => e);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('User not found');
  });
});

describe('authenticateToken', () => {
  it('sets req.user and calls next for a live session', async () => {
    const { req, res, next } = makeReqRes(await signIn());
    await auth.authenticateToken(req, res, next);
    expect(req.user).toEqual({ id: 42 });
    expect(next).toHaveBeenCalledWith();
  });

  it('returns 401 when no token', async () => {
    const { req, res, next } = makeReqRes();
    await auth.authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 for invalid token', async () => {
    const { req, res, next } = makeReqRes('garbage');
    await auth.authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('clears the cookie of a dead session, so the browser stops sending it', async () => {
    const token = await signIn();
    await auth.setPassword(42, 'freshpass');
    const { req, res, next } = makeReqRes(token);
    await auth.authenticateToken(req, res, next);
    expect(res.clearCookie).toHaveBeenCalledWith(
      'session',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
  });

  it('leaves the cookie of a live session be', async () => {
    const { req, res, next } = makeReqRes(await signIn());
    await auth.authenticateToken(req, res, next);
    expect(res.clearCookie).not.toHaveBeenCalled();
  });

  it('answers a session ended by a password change like an expired one', async () => {
    const token = await signIn();
    await auth.setPassword(42, 'freshpass');
    const { req, res, next } = makeReqRes(token);
    await auth.authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards a failed session check to next', async () => {
    const token = await signIn();
    const boom = new Error('db down');
    sessions.find.mockRejectedValueOnce(boom);
    const { req, res, next } = makeReqRes(token);
    await auth.authenticateToken(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('requireAdmin', () => {
  function makeAdminReq(id: number) {
    const req = { user: { id } } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;
    return { req, res, next };
  }

  it("calls next for a role the app's rule names admin (read from the store, not the token)", async () => {
    store.role.mockResolvedValueOnce('ADMIN');
    const { req, res, next } = makeAdminReq(42);
    await auth.requireAdmin(req, res, next);
    expect(store.role).toHaveBeenCalledWith(42);
    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
  });

  it.each(['USER', 'MODERATOR'])('returns 403 for a %s', async (role) => {
    store.role.mockResolvedValueOnce(role);
    const { req, res, next } = makeAdminReq(7);
    await auth.requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when the account is gone', async () => {
    store.role.mockResolvedValueOnce(null);
    const { req, res, next } = makeAdminReq(7);
    await auth.requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards errors to next', async () => {
    const boom = new Error('db down');
    store.role.mockRejectedValueOnce(boom);
    const { req, res, next } = makeAdminReq(7);
    await auth.requireAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});

describe('optionalAuth', () => {
  it('sets req.user for a live session', async () => {
    const { req, res, next } = makeReqRes(await signIn());
    await auth.optionalAuth(req, res, next);
    expect(req.user).toEqual({ id: 42 });
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next without user when no token', async () => {
    const { req, res, next } = makeReqRes();
    await auth.optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('calls next without user for invalid token, and clears its cookie', async () => {
    const { req, res, next } = makeReqRes('garbage');
    await auth.optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(res.clearCookie).toHaveBeenCalledWith('session', expect.anything());
    expect(next).toHaveBeenCalledWith();
  });

  it('clears nothing for a guest without a cookie', async () => {
    const { req, res, next } = makeReqRes();
    await auth.optionalAuth(req, res, next);
    expect(res.clearCookie).not.toHaveBeenCalled();
  });

  it('treats a session ended by a password change as a guest', async () => {
    const token = await signIn();
    await auth.setPassword(42, 'freshpass');
    const { req, res, next } = makeReqRes(token);
    await auth.optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('forwards a failed session check to next', async () => {
    const token = await signIn();
    const boom = new Error('db down');
    sessions.find.mockRejectedValueOnce(boom);
    const { req, res, next } = makeReqRes(token);
    await auth.optionalAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});
