import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockRunLessonTests = vi.fn();
const mockMarkComplete = vi.fn();

vi.mock('../services/lesson-tests.service.js', () => ({
  runLessonTests: (...args: unknown[]) => mockRunLessonTests(...args),
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

const ctrl = await import('./tests.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    params: { courseKey: 'python', lessonSlug: 'booleans' },
    body: { code: 'print(1)', lang: 'en' },
    cookies: {},
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

const next: NextFunction = vi.fn();

beforeEach(() => vi.clearAllMocks());

describe('resolveOwnerKey', () => {
  it('keys a logged-in user by id', () => {
    expect(ctrl.resolveOwnerKey(mockReq({ user: { id: 7 } as Request['user'] }))).toBe('user:7');
  });

  it('keys a guest by the guestId cookie', () => {
    expect(ctrl.resolveOwnerKey(mockReq({ cookies: { guestId: 'g-1' } }))).toBe('guest:g-1');
  });

  it('returns null when neither is present', () => {
    expect(ctrl.resolveOwnerKey(mockReq())).toBeNull();
  });
});

describe('runTests', () => {
  it('marks the lesson complete server-side when a logged-in user passes', async () => {
    mockRunLessonTests.mockResolvedValue({ status: 'passed' });
    const req = mockReq({ user: { id: 7 } as Request['user'] });
    const res = mockRes();

    await ctrl.runTests(req, res, next);

    expect(mockMarkComplete).toHaveBeenCalledWith(7, 'python', 'booleans');
    expect(res.json).toHaveBeenCalledWith({ status: 'passed' });
  });

  it('does not mark complete for a guest who passes (no account, no progress)', async () => {
    mockRunLessonTests.mockResolvedValue({ status: 'passed' });
    const req = mockReq({ cookies: { guestId: 'g-1' } });
    const res = mockRes();

    await ctrl.runTests(req, res, next);

    expect(mockMarkComplete).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ status: 'passed' });
  });

  it('does not mark complete when the verdict is not passed', async () => {
    mockRunLessonTests.mockResolvedValue({ status: 'failed' });
    const req = mockReq({ user: { id: 7 } as Request['user'] });
    const res = mockRes();

    await ctrl.runTests(req, res, next);

    expect(mockMarkComplete).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ status: 'failed' });
  });

  it('forwards errors to next', async () => {
    const err = new Error('judge exploded');
    mockRunLessonTests.mockRejectedValue(err);
    const req = mockReq({ user: { id: 7 } as Request['user'] });

    await ctrl.runTests(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
