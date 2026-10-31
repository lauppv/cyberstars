import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { createAuth, SESSION_COOKIE, type AuthOptions } from './auth.js';

type Role = 'USER' | 'MODERATOR' | 'ADMIN';

const store = {
  role: vi.fn(),
  sessionVersion: vi.fn(),
  passwordHash: vi.fn(),
  setPassword: vi.fn(),
};

const onSessionsEnded = vi.fn();

const OPTIONS: AuthOptions<Role> = {
  store,
  isAdmin: (role) => role === 'ADMIN',
  secret: 'test-secret',
  maxAgeMs: 24 * 60 * 60 * 1000,
  secureCookie: false,
  onSessionsEnded,
};

const auth = createAuth(OPTIONS);

function makeReqRes(token?: string) {
  const req = { cookies: token ? { [SESSION_COOKIE]: token } : {} } as unknown as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

const validToken = jwt.sign({ id: 42 }, 'test-secret');

beforeEach(() => {
  vi.clearAllMocks();
  store.sessionVersion.mockResolvedValue(0);
});

describe('sessionUserId', () => {
  it("signs in a token at the account's session version", async () => {
    store.sessionVersion.mockResolvedValue(2);
    const token = jwt.sign({ id: 7, v: 2 }, 'test-secret');
    expect(await auth.sessionUserId(token)).toBe(7);
    expect(store.sessionVersion).toHaveBeenCalledWith(7);
  });

  it('ends a token made before a password change', async () => {
    store.sessionVersion.mockResolvedValue(3);
    expect(await auth.sessionUserId(jwt.sign({ id: 7, v: 2 }, 'test-secret'))).toBeNull();
  });

  it('counts a token from before versions were kept as version 0', async () => {
    store.sessionVersion.mockResolvedValue(0);
    expect(await auth.sessionUserId(jwt.sign({ id: 7 }, 'test-secret'))).toBe(7);
    store.sessionVersion.mockResolvedValue(1);
    expect(await auth.sessionUserId(jwt.sign({ id: 7 }, 'test-secret'))).toBeNull();
  });

  it('refuses a token whose account is gone', async () => {
    store.sessionVersion.mockResolvedValue(null);
    expect(await auth.sessionUserId(jwt.sign({ id: 7, v: 0 }, 'test-secret'))).toBeNull();
  });

  it('refuses no token, an invalid one or one signed with another secret, without asking the store', async () => {
    expect(await auth.sessionUserId(undefined)).toBeNull();
    expect(await auth.sessionUserId('garbage')).toBeNull();
    expect(await auth.sessionUserId(jwt.sign({ id: 7 }, 'other-secret'))).toBeNull();
    expect(store.sessionVersion).not.toHaveBeenCalled();
  });
});

describe('setPassword', () => {
  it('hashes the password, tells the app the sessions ended and makes a token at the new version', async () => {
    store.setPassword.mockResolvedValue(4);
    const token = await auth.setPassword(5, 'freshpass');
    const [id, hash] = store.setPassword.mock.calls[0] as [number, string];
    expect(id).toBe(5);
    expect(bcrypt.compareSync('freshpass', hash)).toBe(true);
    expect(onSessionsEnded).toHaveBeenCalledWith(5);
    expect(jwt.verify(token, 'test-secret')).toEqual(expect.objectContaining({ id: 5, v: 4 }));
  });

  it('works for an app that keeps nothing open per account', async () => {
    store.setPassword.mockResolvedValue(1);
    const quiet = createAuth({ ...OPTIONS, onSessionsEnded: undefined });
    await expect(quiet.setPassword(5, 'freshpass')).resolves.toEqual(expect.any(String));
  });

  it('makes a token that lasts as long as a session', async () => {
    store.setPassword.mockResolvedValue(1);
    const payload = jwt.decode(await auth.setPassword(5, 'freshpass')) as {
      iat: number;
      exp: number;
    };
    expect(payload.exp - payload.iat).toBe(24 * 60 * 60);
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

describe('setSessionCookie', () => {
  it('sets the token as an httpOnly, lax cookie for as long as a session', () => {
    const res = { cookie: vi.fn() } as unknown as Response;
    auth.setSessionCookie(res, 'the-token');
    expect(res.cookie).toHaveBeenCalledWith(SESSION_COOKIE, 'the-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
  });

  it('sends it over HTTPS only when asked', () => {
    const res = { cookie: vi.fn() } as unknown as Response;
    createAuth({ ...OPTIONS, secureCookie: true }).setSessionCookie(res, 'the-token');
    expect(res.cookie).toHaveBeenCalledWith(
      SESSION_COOKIE,
      'the-token',
      expect.objectContaining({ secure: true }),
    );
  });
});

describe('authenticateToken', () => {
  it('sets req.user and calls next for valid token', async () => {
    const { req, res, next } = makeReqRes(validToken);
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

  it('answers a session ended by a password change like an expired one', async () => {
    store.sessionVersion.mockResolvedValue(1);
    const { req, res, next } = makeReqRes(validToken);
    await auth.authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards a failed session check to next', async () => {
    const boom = new Error('db down');
    store.sessionVersion.mockRejectedValue(boom);
    const { req, res, next } = makeReqRes(validToken);
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
  it('sets req.user for valid token', async () => {
    const { req, res, next } = makeReqRes(validToken);
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

  it('calls next without user for invalid token', async () => {
    const { req, res, next } = makeReqRes('garbage');
    await auth.optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('treats a session ended by a password change as a guest', async () => {
    store.sessionVersion.mockResolvedValue(1);
    const { req, res, next } = makeReqRes(validToken);
    await auth.optionalAuth(req, res, next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it('forwards a failed session check to next', async () => {
    const boom = new Error('db down');
    store.sessionVersion.mockRejectedValue(boom);
    const { req, res, next } = makeReqRes(validToken);
    await auth.optionalAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(boom);
  });
});
