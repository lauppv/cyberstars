import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

function makePrismaProxy() {
  return new Proxy(
    {},
    {
      get() {
        return new Proxy(() => {}, {
          get() {
            return () => Promise.resolve([]);
          },
          apply() {
            return Promise.resolve([]);
          },
        });
      },
    },
  );
}

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return makePrismaProxy();
    }
  },
}));
vi.mock('../config/db.js', () => ({ prisma: makePrismaProxy() }));

const mockSessionService = vi.hoisted(() => ({
  createSession: vi.fn(),
  execCommand: vi.fn(),
  destroySession: vi.fn(),
  loadSetup: vi.fn(),
}));
vi.mock('../services/terminal-session.service.js', () => mockSessionService);

const { app } = await import('../app.js');
const { execRateLimitHandler } = await import('./terminal.routes.js');

const token = jwt.sign({ id: 42 }, 'test-secret');

beforeEach(() => vi.clearAllMocks());

describe('terminal routes — owner resolution (requireOwner)', () => {
  it('rejects a request with no user and no guestId cookie with 401', async () => {
    const res = await request(app)
      .post('/api/terminal/session')
      .send({ courseKey: 'linux', lessonSlug: 'ls-basics' });

    expect(res.status).toBe(401);
    expect(mockSessionService.createSession).not.toHaveBeenCalled();
  });

  it('lets an authenticated user through to create a session', async () => {
    mockSessionService.createSession.mockResolvedValue({ sessionId: 'sid', cwd: '/home/student' });

    const res = await request(app)
      .post('/api/terminal/session')
      .set('Cookie', `token=${token}`)
      .send({ courseKey: 'linux', lessonSlug: 'ls-basics' });

    expect(res.status).toBe(200);
    expect(mockSessionService.createSession).toHaveBeenCalledWith(
      'linux',
      'ls-basics',
      'user:42',
      undefined,
    );
  });

  it('lets a guest (guestId cookie) through, keyed by the raw guestId', async () => {
    mockSessionService.createSession.mockResolvedValue({ sessionId: 'sid', cwd: '/home/student' });

    const res = await request(app)
      .post('/api/terminal/session')
      .set('Cookie', 'guestId=guest-abc')
      .send({ courseKey: 'linux', lessonSlug: 'ls-basics' });

    expect(res.status).toBe(200);
    expect(mockSessionService.createSession).toHaveBeenCalledWith(
      'linux',
      'ls-basics',
      'guest-abc',
      undefined,
    );
  });

  it('runs the rate-limited exec path for an owner (keyGenerator resolves the owner)', async () => {
    mockSessionService.execCommand.mockResolvedValue({ output: 'hi', cwd: '/home/student' });

    const res = await request(app)
      .post('/api/terminal/exec')
      .set('Cookie', 'guestId=guest-xyz')
      .send({ sessionId: '11111111-1111-4111-8111-111111111111', command: 'echo hi' });

    expect(res.status).toBe(200);
    expect(res.body.output).toBe('hi');
  });
});

describe('execRateLimitHandler', () => {
  function fakeRes() {
    const res = { statusCode: 0, body: undefined as unknown } as unknown as Response;
    res.status = ((code: number) => {
      (res as { statusCode: number }).statusCode = code;
      return res;
    }) as Response['status'];
    res.json = ((body: unknown) => {
      (res as { body: unknown }).body = body;
      return res;
    }) as Response['json'];
    return res;
  }

  it('reports the remaining seconds from rateLimit.resetTime', () => {
    const res = fakeRes();
    const req = { rateLimit: { resetTime: new Date(Date.now() + 5000) } } as unknown as Request;

    execRateLimitHandler(req, res);

    expect((res as { statusCode: number }).statusCode).toBe(429);
    expect((res as { body: { error: string } }).body.error).toMatch(/try again in \d+s/);
  });

  it('falls back to a 1s minimum when resetTime is missing', () => {
    const res = fakeRes();
    const req = { rateLimit: {} } as unknown as Request;

    execRateLimitHandler(req, res);

    expect((res as { body: { error: string } }).body.error).toContain('1s');
  });
});
