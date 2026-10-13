import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockRunLessonTests = vi.fn();
const mockMarkComplete = vi.fn();
const mockRecord = vi.fn();
const mockListForLesson = vi.fn();
const mockGetForUser = vi.fn();

vi.mock('../services/lesson-tests.service.js', () => ({
  runLessonTests: (...args: unknown[]) => mockRunLessonTests(...args),
}));
vi.mock('../services/progress.service.js', () => ({
  markComplete: (...args: unknown[]) => mockMarkComplete(...args),
}));
vi.mock('../services/submissions.service.js', () => ({
  record: (...args: unknown[]) => mockRecord(...args),
  listForLesson: (...args: unknown[]) => mockListForLesson(...args),
  getForUser: (...args: unknown[]) => mockGetForUser(...args),
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

  it('still returns the passing verdict when persisting completion fails', async () => {
    mockRunLessonTests.mockResolvedValue({ status: 'passed' });
    mockMarkComplete.mockRejectedValue(new Error('db down'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const req = mockReq({ user: { id: 7 } as Request['user'] });
    const res = mockRes();

    await ctrl.runTests(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ status: 'passed' });
    expect(next).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('forwards errors to next', async () => {
    const err = new Error('judge exploded');
    mockRunLessonTests.mockRejectedValue(err);
    const req = mockReq({ user: { id: 7 } as Request['user'] });

    await ctrl.runTests(req, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('runTests submission history', () => {
  const verdict = { status: 'failed', structureFailures: [], cases: [], total: 2, passedCount: 0 };
  const summary = { id: 4, status: 'failed', passedCount: 0, total: 2 };

  it("records a logged-in student's verdict and returns it as the submission", async () => {
    mockRunLessonTests.mockResolvedValue({ ...verdict });
    mockRecord.mockResolvedValue(summary);
    const req = mockReq({
      user: { id: 7 } as Request['user'],
      body: { code: 'print(2)', lang: 'ro' },
    });
    const res = mockRes();

    await ctrl.runTests(req, res, next);

    expect(mockRecord).toHaveBeenCalledWith(7, 'python', 'booleans', 'ro', 'print(2)', {
      ...verdict,
      submission: summary,
    });
    expect(res.json).toHaveBeenCalledWith({ ...verdict, submission: summary });
  });

  it('records a passing verdict too, after marking the lesson complete', async () => {
    mockRunLessonTests.mockResolvedValue({ ...verdict, status: 'passed' });
    mockRecord.mockResolvedValue({ ...summary, status: 'passed' });
    const req = mockReq({ user: { id: 7 } as Request['user'], body: { code: 'x' } });

    await ctrl.runTests(req, mockRes(), next);

    expect(mockMarkComplete).toHaveBeenCalled();
    expect(mockRecord).toHaveBeenCalledWith(7, 'python', 'booleans', 'en', 'x', expect.anything());
  });

  it('keeps no history for a guest', async () => {
    mockRunLessonTests.mockResolvedValue({ ...verdict });
    const res = mockRes();

    await ctrl.runTests(mockReq({ cookies: { guestId: 'g-1' } }), res, next);

    expect(mockRecord).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(verdict);
  });

  it('still returns the verdict, without a submission, when recording fails', async () => {
    mockRunLessonTests.mockResolvedValue({ ...verdict });
    mockRecord.mockRejectedValue(new Error('db down'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = mockRes();

    await ctrl.runTests(mockReq({ user: { id: 7 } as Request['user'] }), res, next);

    expect(res.json).toHaveBeenCalledWith(verdict);
    expect(vi.mocked(res.json).mock.calls[0][0]).not.toHaveProperty('submission');
    expect(next).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('listSubmissions', () => {
  it("returns the student's attempts on the lesson", async () => {
    mockListForLesson.mockResolvedValue([{ id: 2 }, { id: 1 }]);
    const res = mockRes();

    await ctrl.listSubmissions(mockReq({ user: { id: 7 } as Request['user'] }), res, next);

    expect(mockListForLesson).toHaveBeenCalledWith(7, 'python', 'booleans');
    expect(res.json).toHaveBeenCalledWith([{ id: 2 }, { id: 1 }]);
  });

  it('forwards errors to next', async () => {
    const err = new Error('bad course');
    mockListForLesson.mockRejectedValue(err);

    await ctrl.listSubmissions(mockReq({ user: { id: 7 } as Request['user'] }), mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('getSubmission', () => {
  function reqFor(id: string): Request {
    return mockReq({ user: { id: 7 } as Request['user'], params: { id } });
  }

  it('returns the attempt for its owner', async () => {
    mockGetForUser.mockResolvedValue({ id: 5, code: 'x' });
    const res = mockRes();

    await ctrl.getSubmission(reqFor('5'), res, next);

    expect(mockGetForUser).toHaveBeenCalledWith(7, 5);
    expect(res.json).toHaveBeenCalledWith({ id: 5, code: 'x' });
  });

  it.each(['abc', '0', '-3', '1.5', '2147483648'])('400s the id %s', async (id) => {
    await ctrl.getSubmission(reqFor(id), mockRes(), next);

    expect(mockGetForUser).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  it('forwards a not-found to next', async () => {
    const err = new Error('not found');
    mockGetForUser.mockRejectedValue(err);

    await ctrl.getSubmission(reqFor('5'), mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
