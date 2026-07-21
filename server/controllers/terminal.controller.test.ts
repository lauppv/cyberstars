import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockCreateSession = vi.fn();
const mockExecCommand = vi.fn();
const mockDestroySession = vi.fn();

vi.mock('../services/terminal-session.service.js', () => ({
  createSession: (...args: unknown[]) => mockCreateSession(...args),
  execCommand: (...args: unknown[]) => mockExecCommand(...args),
  destroySession: (...args: unknown[]) => mockDestroySession(...args),
}));

const mockRunTerminalTests = vi.fn();
const mockMarkComplete = vi.fn();
vi.mock('../services/terminal-tests.service.js', () => ({
  runTerminalTests: (...args: unknown[]) => mockRunTerminalTests(...args),
}));
vi.mock('../services/progress.service.js', () => ({
  markComplete: (...args: unknown[]) => mockMarkComplete(...args),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return {};
    }
  },
}));

const ctrl = await import('./terminal.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    params: {},
    body: {},
    user: { id: 1 } as Request['user'],
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = { json: vi.fn().mockReturnThis(), status: vi.fn().mockReturnThis() };
  return res as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('createSession', () => {
  it('creates session and returns it', async () => {
    const session = { sessionId: 'abc-123', cwd: '/home/student' };
    mockCreateSession.mockResolvedValue(session);
    const req = mockReq({ body: { courseKey: 'linux', lessonSlug: 'intro' } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.createSession(req, res, next);
    expect(res.json).toHaveBeenCalledWith(session);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('exec', () => {
  it('executes command and returns result', async () => {
    const result = { output: 'hello', cwd: '/home/student' };
    mockExecCommand.mockResolvedValue(result);
    const req = mockReq({
      body: { sessionId: '550e8400-e29b-41d4-a716-446655440000', command: 'ls' },
    });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.exec(req, res, next);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('returns 404 AppError when session not found', async () => {
    mockExecCommand.mockRejectedValue(new Error('Session not found'));
    const req = mockReq({
      body: { sessionId: '550e8400-e29b-41d4-a716-446655440000', command: 'ls' },
    });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.exec(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const err = next.mock.calls[0][0] as AppError;
    expect(err.statusCode).toBe(404);
  });

  it('passes other errors to next', async () => {
    mockExecCommand.mockRejectedValue(new Error('Docker failed'));
    const req = mockReq({
      body: { sessionId: '550e8400-e29b-41d4-a716-446655440000', command: 'ls' },
    });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.exec(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('checkTests', () => {
  const body = { sessionId: 'sid', courseKey: 'linux', lessonSlug: 'cd', lang: 'en' };

  it('marks the lesson complete for a logged-in user on a passing verdict', async () => {
    const result = { status: 'passed', checks: [] };
    mockRunTerminalTests.mockResolvedValue(result);
    mockMarkComplete.mockResolvedValue(undefined);
    const req = mockReq({ body, user: { id: 7 } as Request['user'] });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.checkTests(req, res, next);
    expect(mockMarkComplete).toHaveBeenCalledWith(7, 'linux', 'cd');
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('does not mark complete for a guest (no user id)', async () => {
    mockRunTerminalTests.mockResolvedValue({ status: 'passed', checks: [] });
    const req = mockReq({ body, user: undefined });
    const res = mockRes();
    await ctrl.checkTests(req, res, vi.fn());
    expect(mockMarkComplete).not.toHaveBeenCalled();
  });

  it('does not mark complete when the verdict is a failure', async () => {
    mockRunTerminalTests.mockResolvedValue({ status: 'failed', checks: [] });
    const req = mockReq({ body, user: { id: 7 } as Request['user'] });
    const res = mockRes();
    await ctrl.checkTests(req, res, vi.fn());
    expect(mockMarkComplete).not.toHaveBeenCalled();
  });

  it('swallows a completion-persistence failure and still returns the result', async () => {
    const result = { status: 'passed', checks: [] };
    mockRunTerminalTests.mockResolvedValue(result);
    mockMarkComplete.mockRejectedValue(new Error('db down'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const req = mockReq({ body, user: { id: 7 } as Request['user'] });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.checkTests(req, res, next);
    expect(res.json).toHaveBeenCalledWith(result);
    expect(next).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('passes an error from the judge to next', async () => {
    mockRunTerminalTests.mockRejectedValue(new AppError(404, 'no tests'));
    const req = mockReq({ body });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.checkTests(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});

describe('destroy', () => {
  it('destroys session and returns ok', async () => {
    mockDestroySession.mockResolvedValue(undefined);
    const req = mockReq({ params: { sessionId: '550e8400-e29b-41d4-a716-446655440000' } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.destroy(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('calls next on validation error (invalid UUID)', async () => {
    const req = mockReq({ params: { sessionId: 'not-a-uuid' } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.destroy(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('passes non-validation errors straight to next', async () => {
    mockDestroySession.mockRejectedValue(new Error('Docker failed'));
    const req = mockReq({ params: { sessionId: '550e8400-e29b-41d4-a716-446655440000' } });
    const res = mockRes();
    const next = vi.fn();
    await ctrl.destroy(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect((next.mock.calls[0][0] as Error).message).toBe('Docker failed');
  });
});

describe('execRateLimitHandler', () => {
  it('responds 429 with the remaining seconds until the window resets', async () => {
    const { execRateLimitHandler } = await import('../routes/terminal.routes.js');
    const res = mockRes();
    const req = { rateLimit: { resetTime: new Date(Date.now() + 34_000) } } as unknown as Request;
    execRateLimitHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.stringMatching(/^Too many attempts — try again in \d+s\.$/),
    });
  });

  it('defaults to 1s when no reset time is available', async () => {
    const { execRateLimitHandler } = await import('../routes/terminal.routes.js');
    const res = mockRes();
    execRateLimitHandler({ rateLimit: {} } as unknown as Request, res);
    expect(res.json).toHaveBeenCalledWith({ error: 'Too many attempts — try again in 1s.' });
  });
});
