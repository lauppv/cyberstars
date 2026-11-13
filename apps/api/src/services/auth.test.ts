import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { NextFunction, Request, Response } from 'express';
import { errorHandler } from '@cyberstars-framework/server-kit/errors';

// How CyberStars wires the auth package to its user records; the package's own
// behaviour is tested in framework/auth

const mockUserRepo = {
  create: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  findByIdWithPassword: vi.fn(),
  findRole: vi.fn(),
  updatePassword: vi.fn(),
  setResetCode: vi.fn(),
  takeResetAttempt: vi.fn(),
  findByResetCode: vi.fn(),
};
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

// The sessions in memory, each with the role mockUserRepo.findRole gives
const mockSessions = vi.hoisted(() => new Map<string, Record<string, unknown>>());
vi.mock('../repositories/session.repository.js', () => ({
  create: vi.fn(async (s: { id: string; createdAt: Date }) => {
    mockSessions.set(s.id, { ...s, lastSeenAt: s.createdAt });
  }),
  find: vi.fn(async (id: string) => {
    const row = mockSessions.get(id);
    return row ? { ...row, role: (await mockUserRepo.findRole(row.userId)) ?? 'USER' } : null;
  }),
  touch: vi.fn(),
  remove: vi.fn(async (id: string) => {
    mockSessions.delete(id);
  }),
  removeForUser: vi.fn(async (userId: number) => {
    for (const [id, row] of mockSessions) if (row.userId === userId) mockSessions.delete(id);
  }),
  removeExpired: vi.fn(async () => 3),
}));

const mockSendResetCode = vi.fn();
vi.mock('./email.service.js', () => ({
  sendResetCode: (...args: unknown[]) => mockSendResetCode(...args),
}));

const mockCloseUserSockets = vi.fn();
vi.mock('./ws-user.js', () => ({
  closeUserSockets: (...args: unknown[]) => mockCloseUserSockets(...args),
}));

const { auth, accountAnswer, scheduleSessionSweep } = await import('./auth.js');
const sessionRepo = await import('../repositories/session.repository.js');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', auth.router);
app.use(errorHandler);

const SIGNUP = { name: 'Alice', email: 'alice@test.com', password: 'pass123' };

beforeEach(() => {
  vi.clearAllMocks();
  mockSessions.clear();
  mockUserRepo.findRole.mockResolvedValue('USER');
});

// The session cookie a response set, as the browser sends it back
function sessionCookie(res: request.Response): string {
  const cookies = res.headers['set-cookie'] as unknown as string[];
  return cookies.find((c) => c.startsWith('session='))!.split(';')[0]!;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

describe('sign-up', () => {
  it('keeps the placement score the visitor got before signing up', async () => {
    mockUserRepo.create.mockResolvedValue(42);
    await request(app)
      .post('/auth/signup')
      .send({ ...SIGNUP, placementScore: 7 })
      .expect(200);
    expect(mockUserRepo.create).toHaveBeenCalledWith(
      'Alice',
      'alice@test.com',
      expect.stringMatching(/^\$2[aby]\$10\$/),
      7,
    );
  });

  it('answers 409 on a taken email (Prisma P2002)', async () => {
    mockUserRepo.create.mockRejectedValue({ code: 'P2002' });
    const res = await request(app).post('/auth/signup').send(SIGNUP);
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'User already exists' });
  });

  it('lets any other database error through', async () => {
    mockUserRepo.create.mockRejectedValue(new Error('DB down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).post('/auth/signup').send(SIGNUP);
    expect(res.status).toBe(500);
    vi.mocked(console.error).mockRestore();
  });

  it("refuses a name CyberStars doesn't take", async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ ...SIGNUP, name: 'Ion' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(
      'Name is too short, must have at least 4 characters besides spaces',
    );
  });
});

describe('login', () => {
  it("signs in with the account's password, in a session kept in `sessions`", async () => {
    const bcrypt = await import('bcryptjs');
    const password = bcrypt.hashSync('correct', 4);
    mockUserRepo.findByEmail.mockResolvedValue({ id: 7, password });
    mockUserRepo.findByIdWithPassword.mockResolvedValue({ id: 7, password });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'bob@test.com', password: 'correct' })
      .expect(200);
    expect(sessionRepo.create).toHaveBeenCalledWith(expect.objectContaining({ userId: 7 }));
    const token = sessionCookie(res).slice('session='.length);
    expect(await auth.sessionUserId(token)).toBe(7);
  });

  it('gives a student a 30-day cookie and an admin or the founder a 12-hour one', async () => {
    const bcrypt = await import('bcryptjs');
    const password = bcrypt.hashSync('correct', 4);
    mockUserRepo.findByEmail.mockResolvedValue({ id: 7, password });
    mockUserRepo.findByIdWithPassword.mockResolvedValue({ id: 7, password });
    const login = () =>
      request(app).post('/auth/login').send({ email: 'bob@test.com', password: 'correct' });
    expect((await login()).headers['set-cookie']![0]).toContain(`Max-Age=${(30 * DAY) / 1000};`);
    for (const role of ['ADMIN', 'FOUNDER']) {
      mockUserRepo.findRole.mockResolvedValue(role);
      expect((await login()).headers['set-cookie']![0]).toContain(`Max-Age=${(12 * HOUR) / 1000};`);
    }
  });

  it('throws a generic 401 for unknown email (no enumeration)', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nobody@test.com', password: 'pass' });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid email or password' });
  });
});

describe('sessions', () => {
  it("ends the account's sessions and closes its notification sockets when a password is set", async () => {
    await auth.setPassword(5, 'freshpass');
    expect(sessionRepo.removeForUser).toHaveBeenCalledWith(5);
    expect(mockCloseUserSockets).toHaveBeenCalledWith(5);
  });

  it("closes the account's notification sockets on logout", async () => {
    mockUserRepo.create.mockResolvedValue(9);
    const cookie = sessionCookie(await request(app).post('/auth/signup').send(SIGNUP).expect(200));
    await request(app).post('/auth/logout').set('Cookie', cookie).expect(200);
    expect(mockCloseUserSockets).toHaveBeenCalledWith(9);
    expect(mockSessions.size).toBe(0);
  });

  it('sweeps sessions past the 30 days unused or 90 days old, at start and every hour', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-13T10:00:00Z') });
    const timer = scheduleSessionSweep();
    await vi.advanceTimersByTimeAsync(0);
    expect(sessionRepo.removeExpired).toHaveBeenCalledWith(
      new Date('2026-10-14T10:00:00Z'),
      new Date('2026-08-15T10:00:00Z'),
    );
    await vi.advanceTimersByTimeAsync(HOUR);
    expect(sessionRepo.removeExpired).toHaveBeenCalledTimes(2);
    clearInterval(timer);
    vi.useRealTimers();
  });

  it('logs a failed sweep and keeps going', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(sessionRepo.removeExpired).mockRejectedValueOnce(new Error('db down'));
    clearInterval(scheduleSessionSweep());
    await vi.waitFor(() =>
      expect(err).toHaveBeenCalledWith('[sessions] sweep failed:', expect.any(Error)),
    );
    err.mockRestore();
  });

  it.each(['ADMIN', 'FOUNDER'])('lets a %s through requireAdmin', async (role) => {
    mockUserRepo.findRole.mockResolvedValue(role);
    const next = vi.fn() as unknown as NextFunction;
    await auth.requireAdmin({ user: { id: 1 } } as Request, {} as Response, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('keeps a deleted account out of requireAdmin', async () => {
    mockUserRepo.findRole.mockResolvedValue(null);
    const next = vi.fn() as unknown as NextFunction;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    await auth.requireAdmin({ user: { id: 1 } } as Request, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("checks the current password against the account's", async () => {
    const bcrypt = await import('bcryptjs');
    mockUserRepo.findByIdWithPassword.mockResolvedValue({
      id: 7,
      password: bcrypt.hashSync('right', 4),
    });
    await expect(auth.checkCurrentPassword(7, 'right')).resolves.toBeUndefined();
    mockUserRepo.findByIdWithPassword.mockResolvedValue(null);
    await expect(auth.checkCurrentPassword(7, 'right')).rejects.toThrow('User not found');
  });
});

describe('password reset', () => {
  it('sends the code in the language of the page, English by default', async () => {
    mockUserRepo.setResetCode.mockResolvedValue(true);
    mockSendResetCode.mockResolvedValue(undefined);
    await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'ro@test.com', lang: 'ro' })
      .expect(200);
    await request(app).post('/auth/forgot-password').send({ email: 'en@test.com' }).expect(200);
    expect(mockSendResetCode).toHaveBeenCalledWith('ro@test.com', expect.any(String), 'ro');
    expect(mockSendResetCode).toHaveBeenCalledWith('en@test.com', expect.any(String), 'en');
  });

  it('sets the password of the account the code belongs to', async () => {
    mockUserRepo.takeResetAttempt.mockResolvedValue(true);
    mockUserRepo.findByResetCode.mockResolvedValue({ id: 5 });
    mockUserRepo.updatePassword.mockResolvedValue(1);
    await request(app)
      .post('/auth/reset-password')
      .send({ email: 'user@test.com', code: '123456', password: 'newpass' })
      .expect(200);
    expect(mockUserRepo.takeResetAttempt).toHaveBeenCalledWith('user@test.com', 5);
    expect(mockUserRepo.findByResetCode).toHaveBeenCalledWith('user@test.com', '123456');
    expect(mockUserRepo.updatePassword).toHaveBeenCalledWith(5, expect.any(String));
    expect(mockCloseUserSockets).toHaveBeenCalledWith(5);
  });

  it('refuses a code no account has', async () => {
    mockUserRepo.takeResetAttempt.mockResolvedValue(true);
    mockUserRepo.findByResetCode.mockResolvedValue(null);
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ email: 'user@test.com', code: '000000', password: 'newpass' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid or expired code' });
  });
});

describe('the account answer', () => {
  const ada = {
    id: 1,
    name: 'Ada',
    email: 'ada@test.com',
    role: 'USER' as const,
    avatarUrl: null,
    bio: null,
    status: null,
    statusExpiresAt: null,
    pendingEmail: null,
    emailChangeCodeExpiresAt: null,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    showBio: true,
    showStats: true,
    showProgress: true,
    showConnections: true,
    onboardedAt: null,
    placementScore: null,
    interests: [],
    interestsAt: null,
    codeLanguage: null,
  };

  it('is what GET /auth/me answers', async () => {
    mockUserRepo.create.mockResolvedValue(1);
    const cookie = sessionCookie(await request(app).post('/auth/signup').send(SIGNUP).expect(200));
    mockUserRepo.findById.mockResolvedValue(ada);
    const res = await request(app).get('/auth/me').set('Cookie', cookie).expect(200);
    expect(res.body).toEqual(accountAnswer(ada));
    expect(mockUserRepo.findById).toHaveBeenCalledWith(1);
  });

  it('returns user data with active status', () => {
    const future = new Date(Date.now() + 60_000);
    const user = accountAnswer({ ...ada, bio: 'hello', status: 'coding', statusExpiresAt: future });
    expect(user.status).toBe('coding');
    expect(user.statusExpiresAt).toBe(future.toISOString());
    expect(user.name).toBe('Ada');
    expect(user.onboardedAt).toBeNull();
  });

  it('nullifies expired status', () => {
    const past = new Date(Date.now() - 60_000);
    const user = accountAnswer({ ...ada, status: 'old status', statusExpiresAt: past });
    expect(user.status).toBeNull();
    expect(user.statusExpiresAt).toBeNull();
  });

  it('nullifies both status and statusExpiresAt when neither is set', () => {
    const user = accountAnswer(ada);
    expect(user.status).toBeNull();
    expect(user.statusExpiresAt).toBeNull();
    expect(user.pendingEmail).toBeNull();
  });

  it('passes the onboarding date through as an ISO string', () => {
    const user = accountAnswer({ ...ada, onboardedAt: new Date('2024-01-02T00:00:00Z') });
    expect(user.onboardedAt).toBe('2024-01-02T00:00:00.000Z');
  });

  it('gives the level from the placement score, and none without one', () => {
    expect(accountAnswer({ ...ada, placementScore: 6 }).placementLevel).toBe('intermediate');
    expect(accountAnswer(ada).placementLevel).toBeNull();
  });

  it('gives the interests once asked, and null before', () => {
    expect(accountAnswer(ada).interests).toBeNull();
    expect(
      accountAnswer({ ...ada, interests: ['python'], interestsAt: new Date() }).interests,
    ).toEqual(['python']);
  });

  it('gives the code language picked last, and none for anything else', () => {
    expect(accountAnswer({ ...ada, codeLanguage: 'java' }).codeLanguage).toBe('java');
    expect(accountAnswer({ ...ada, codeLanguage: null }).codeLanguage).toBeNull();
    expect(accountAnswer({ ...ada, codeLanguage: 'cobol' }).codeLanguage).toBeNull();
  });

  it('surfaces pendingEmail when the change code has not expired yet', () => {
    const user = accountAnswer({
      ...ada,
      pendingEmail: 'new@test.com',
      emailChangeCodeExpiresAt: new Date('2999-12-31T23:59:59Z'),
    });
    expect(user.pendingEmail).toBe('new@test.com');
  });

  it('nullifies pendingEmail when the change code has already expired', () => {
    const user = accountAnswer({
      ...ada,
      pendingEmail: 'new@test.com',
      emailChangeCodeExpiresAt: new Date('2000-01-01T00:00:00Z'),
    });
    expect(user.pendingEmail).toBeNull();
  });
});
