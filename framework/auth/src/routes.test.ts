import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { errorHandler } from '@cyberstars-framework/server-kit/errors';
import { makeLimiter } from '@cyberstars-framework/server-kit/rate-limit';
import { createAuth, SESSION_COOKIE, type AuthUser } from './auth.js';
import { emailField, passwordField } from './schemas.js';

// The routes, end to end through an app that keeps its accounts in memory

type Role = 'USER' | 'ADMIN';

interface Row extends AuthUser<Role> {
  passwordHash: string;
  sessionVersion: number;
  school?: string;
  resetCode: string | null;
  resetCodeExpiresAt: Date | null;
  resetCodeAttempts: number;
}

// An app's form: its own rule for names and a field of its own
const signupSchema = z.object({
  name: z.string().min(4, 'Name is too short'),
  email: emailField,
  password: passwordField,
  school: z.string().optional(),
});

function memoryStore() {
  const rows: Row[] = [];
  const byId = (id: number) => rows.find((r) => r.id === id);
  const byEmail = (email: string) => rows.find((r) => r.email === email);
  const live = (r: Row | undefined) =>
    r?.resetCode && r.resetCodeExpiresAt && r.resetCodeExpiresAt >= new Date() ? r : undefined;
  return {
    rows,
    async create({
      passwordHash,
      ...fields
    }: z.infer<typeof signupSchema> & { passwordHash: string }) {
      if (byEmail(fields.email)) return null;
      const row: Row = {
        ...fields,
        id: rows.length + 1,
        role: 'USER',
        passwordHash,
        sessionVersion: 0,
        resetCode: null,
        resetCodeExpiresAt: null,
        resetCodeAttempts: 0,
      };
      rows.push(row);
      return row.id;
    },
    async findLogin(email: string) {
      const r = byEmail(email);
      return r
        ? { id: r.id, passwordHash: r.passwordHash, sessionVersion: r.sessionVersion }
        : null;
    },
    async findById(id: number): Promise<Row | null> {
      return byId(id) ?? null;
    },
    async role(id: number) {
      return byId(id)?.role ?? null;
    },
    async sessionVersion(id: number) {
      return byId(id)?.sessionVersion ?? null;
    },
    async passwordHash(id: number) {
      return byId(id)?.passwordHash ?? null;
    },
    async setPassword(id: number, passwordHash: string) {
      const r = byId(id)!;
      Object.assign(r, { passwordHash, resetCode: null, resetCodeExpiresAt: null });
      return ++r.sessionVersion;
    },
    async setResetCode(email: string, code: string, expiresAt: Date) {
      const r = byEmail(email);
      if (!r) return false;
      Object.assign(r, { resetCode: code, resetCodeExpiresAt: expiresAt, resetCodeAttempts: 0 });
      return true;
    },
    async takeResetAttempt(email: string, maxAttempts: number) {
      const r = live(byEmail(email));
      if (!r || r.resetCodeAttempts >= maxAttempts) return false;
      r.resetCodeAttempts++;
      return true;
    },
    async findResetCode(email: string, code: string) {
      const r = live(byEmail(email));
      return r && r.resetCode === code ? r.id : null;
    },
  };
}

function setup({
  limitsInTests = false,
  account,
}: { limitsInTests?: boolean; account?: (user: Row) => unknown } = {}) {
  const store = memoryStore();
  const sendResetCode = vi.fn().mockResolvedValue(undefined);
  const onSessionsEnded = vi.fn();
  const auth = createAuth({
    store,
    isAdmin: (role) => role === 'ADMIN',
    secret: 'test-secret',
    maxAgeMs: 60_000,
    secureCookie: false,
    onSessionsEnded,
    signupSchema,
    emailLanguages: ['en', 'ro'],
    sendResetCode,
    account,
    // like an app's tests: limits are skipped unless one says otherwise
    limiter: makeLimiter(() => !limitsInTests),
  });
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', auth.router);
  app.use(errorHandler);
  return { app, store, sendResetCode, onSessionsEnded };
}

const ADA = { name: 'Ada Lovelace', email: 'ada@test.com', password: 'secret123' };

// The cookie a response signs the browser in with, as the browser sends it back
function sessionCookie(res: request.Response): string {
  const cookies = res.headers['set-cookie'] as unknown as string[];
  return cookies.find((c) => c.startsWith(`${SESSION_COOKIE}=`))!.split(';')[0]!;
}

async function signUp(app: express.Express, form: object = ADA): Promise<string> {
  const res = await request(app).post('/auth/signup').send(form).expect(200);
  return sessionCookie(res);
}

// The reset code the app was asked to send last
function sentCode(sendResetCode: ReturnType<typeof vi.fn>): string {
  return sendResetCode.mock.calls.at(-1)![1] as string;
}

describe('POST /signup', () => {
  it('makes the account with a hashed password and signs the browser in', async () => {
    const { app, store } = setup();
    const res = await request(app).post('/auth/signup').send(ADA);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'User created successfully' });
    const cookie = res.headers['set-cookie']![0]!;
    expect(cookie).toMatch(/^token=.+; Max-Age=60; .*HttpOnly; SameSite=Lax/);
    expect(bcrypt.compareSync('secret123', store.rows[0]!.passwordHash)).toBe(true);
    expect(store.rows[0]).not.toHaveProperty('password');
  });

  it("hands the form's own fields to the store", async () => {
    const { app, store } = setup();
    await signUp(app, { ...ADA, school: 'UPT' });
    expect(store.rows[0]!.school).toBe('UPT');
  });

  it("refuses a form that breaks the app's rules, with its message", async () => {
    const { app, store } = setup();
    const res = await request(app)
      .post('/auth/signup')
      .send({ ...ADA, name: 'Ada' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Name is too short');
    expect(store.rows).toHaveLength(0);
  });

  it('answers 409 when the email is taken', async () => {
    const { app } = setup();
    await signUp(app);
    const res = await request(app).post('/auth/signup').send(ADA);
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'User already exists' });
  });
});

describe('POST /login', () => {
  it("signs the browser in with a token at the account's session version", async () => {
    const { app, store } = setup();
    await signUp(app);
    store.rows[0]!.sessionVersion = 3;
    const res = await request(app)
      .post('/auth/login')
      .send({ email: ADA.email, password: ADA.password });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Login successful' });
    await request(app).get('/auth/me').set('Cookie', sessionCookie(res)).expect(200);
  });

  it('throws a generic 401 for unknown email (no enumeration)', async () => {
    const { app } = setup();
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nobody@test.com', password: 'pass' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid email or password' });
    expect(res.headers['set-cookie']).toBeUndefined();
  });

  it('throws the same generic 401 for wrong password', async () => {
    const { app } = setup();
    await signUp(app);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: ADA.email, password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid email or password' });
  });

  it('asks for a password', async () => {
    const { app } = setup();
    const res = await request(app).post('/auth/login').send({ email: ADA.email, password: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Password is required');
  });
});

describe('POST /logout', () => {
  it('clears the cookie', async () => {
    const { app } = setup();
    const res = await request(app).post('/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Logged out successfully' });
    expect(res.headers['set-cookie']![0]).toMatch(/^token=; .*Expires=Thu, 01 Jan 1970/);
  });
});

describe('GET /me', () => {
  it('needs a session', async () => {
    const { app } = setup();
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'No token provided' });
  });

  it("answers the account's id, name, email and role, nothing else", async () => {
    const { app } = setup();
    const cookie = await signUp(app, { ...ADA, school: 'UPT' });
    const res = await request(app).get('/auth/me').set('Cookie', cookie);
    expect(res.body).toEqual({ id: 1, name: 'Ada Lovelace', email: 'ada@test.com', role: 'USER' });
  });

  it("answers the app's own account answer when it gives one", async () => {
    const { app } = setup({ account: (user) => ({ id: user.id, school: user.school ?? null }) });
    const cookie = await signUp(app, { ...ADA, school: 'UPT' });
    const res = await request(app).get('/auth/me').set('Cookie', cookie);
    expect(res.body).toEqual({ id: 1, school: 'UPT' });
  });

  it('answers 404 when the account is gone', async () => {
    const { app, store } = setup();
    const cookie = await signUp(app);
    store.findById = async () => null;
    const res = await request(app).get('/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'User not found' });
  });
});

describe('POST /forgot-password', () => {
  it('stores a 6-digit code and sends it in the language asked', async () => {
    const { app, store, sendResetCode } = setup();
    await signUp(app);
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: ADA.email, lang: 'ro' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'If that email exists, a reset code was sent' });
    expect(sendResetCode).toHaveBeenCalledWith(ADA.email, expect.stringMatching(/^\d{6}$/), 'ro');
    expect(store.rows[0]!.resetCode).toBe(sentCode(sendResetCode));
  });

  it('writes in the first language when none is asked', async () => {
    const { app, sendResetCode } = setup();
    await signUp(app);
    await request(app).post('/auth/forgot-password').send({ email: ADA.email }).expect(200);
    expect(sendResetCode).toHaveBeenCalledWith(ADA.email, expect.any(String), 'en');
  });

  it('gives an unknown email the same answer and sends nothing', async () => {
    const { app, sendResetCode } = setup();
    const res = await request(app).post('/auth/forgot-password').send({ email: 'nobody@test.com' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'If that email exists, a reset code was sent' });
    expect(sendResetCode).not.toHaveBeenCalled();
  });

  it('logs and swallows a failed send instead of surfacing it', async () => {
    const { app, sendResetCode } = setup();
    await signUp(app);
    sendResetCode.mockRejectedValueOnce(new Error('smtp down'));
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await request(app).post('/auth/forgot-password').send({ email: ADA.email }).expect(200);
    expect(errSpy).toHaveBeenCalledWith(
      '[forgot-password] failed to send reset code:',
      expect.any(Error),
    );
    errSpy.mockRestore();
  });

  it('refuses a language the app has no email in', async () => {
    const { app } = setup();
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: ADA.email, lang: 'fr' });
    expect(res.status).toBe(400);
  });

  it('gives one email three codes an hour, with or without an account, also in tests', async () => {
    const { app } = setup();
    await signUp(app);
    for (const email of [ADA.email, 'nobody@test.com']) {
      for (let i = 0; i < 3; i++) {
        await request(app).post('/auth/forgot-password').send({ email }).expect(200);
      }
      const res = await request(app).post('/auth/forgot-password').send({ email });
      expect(res.status).toBe(429);
      expect(res.body).toEqual({ error: 'Too many codes asked for this email, try again later' });
      expect(res.headers['ratelimit-policy']).toBe('3;w=3600');
    }
    // keyed by the email, not the address the requests came from
    await request(app).post('/auth/forgot-password').send({ email: 'other@test.com' }).expect(200);
  });
});

describe('POST /reset-password', () => {
  async function withCode() {
    const parts = setup();
    const cookie = await signUp(parts.app);
    await request(parts.app).post('/auth/forgot-password').send({ email: ADA.email }).expect(200);
    return { ...parts, cookie, code: sentCode(parts.sendResetCode) };
  }

  const reset = (app: express.Express, code: string) =>
    request(app)
      .post('/auth/reset-password')
      .send({ email: ADA.email, code, password: 'newpass1' });

  it('sets the new password with the right code and ends every session', async () => {
    const { app, cookie, code, onSessionsEnded } = await withCode();
    const res = await reset(app, code);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Password reset successfully' });
    expect(onSessionsEnded).toHaveBeenCalledWith(1);
    await request(app).get('/auth/me').set('Cookie', cookie).expect(403);
    await request(app)
      .post('/auth/login')
      .send({ email: ADA.email, password: 'newpass1' })
      .expect(200);
  });

  it('throws 400 for invalid or expired code', async () => {
    const { app, code } = await withCode();
    const res = await reset(app, code === '000000' ? '111111' : '000000');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid or expired code' });
  });

  it('refuses the right code after five wrong ones', async () => {
    const { app, code } = await withCode();
    const wrong = code === '000000' ? '111111' : '000000';
    for (let i = 0; i < 5; i++) await reset(app, wrong).expect(400);
    const res = await reset(app, code);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'This code has expired or used up its attempts, ask for a new one',
    });
  });

  it('takes the right code as the fifth try', async () => {
    const { app, code } = await withCode();
    const wrong = code === '000000' ? '111111' : '000000';
    for (let i = 0; i < 4; i++) await reset(app, wrong).expect(400);
    await reset(app, code).expect(200);
  });

  it('refuses a code past its 15 minutes', async () => {
    const { app, store, code } = await withCode();
    const expiresAt = store.rows[0]!.resetCodeExpiresAt!.getTime();
    expect(expiresAt - Date.now()).toBeGreaterThan(14 * 60 * 1000);
    expect(expiresAt - Date.now()).toBeLessThanOrEqual(15 * 60 * 1000);
    store.rows[0]!.resetCodeExpiresAt = new Date(Date.now() - 1);
    const res = await reset(app, code);
    expect(res.body).toEqual({
      error: 'This code has expired or used up its attempts, ask for a new one',
    });
  });
});

describe('the sign-in limit', () => {
  it('allows ten tries in 15 minutes per address', async () => {
    const { app } = setup({ limitsInTests: true });
    const tries = [];
    for (let i = 0; i < 11; i++) {
      tries.push(
        (await request(app).post('/auth/login').send({ email: ADA.email, password: 'x' })).status,
      );
    }
    expect(tries).toEqual([...Array(10).fill(401), 429]);
    const res = await request(app).post('/auth/signup').send(ADA);
    expect(res.status).toBe(429);
    expect(res.body).toEqual({ error: 'Too many attempts, try again later' });
    expect(res.headers['ratelimit-policy']).toBe('10;w=900');
  });

  it("follows the app's rule for tests", async () => {
    const { app } = setup();
    for (let i = 0; i < 11; i++) {
      await request(app).post('/auth/login').send({ email: ADA.email, password: 'x' }).expect(401);
    }
  });
});
