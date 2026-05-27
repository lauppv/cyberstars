import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockGetLessonContent = vi.fn();
const mockGetLessonCode = vi.fn();
const mockGetCurriculum = vi.fn();

vi.mock('../services/lesson.service.js', () => ({
  getLessonContent: (...args: unknown[]) => mockGetLessonContent(...args),
  getLessonCode: (...args: unknown[]) => mockGetLessonCode(...args),
  getCurriculum: (...args: unknown[]) => mockGetCurriculum(...args),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return {};
    }
  },
}));

const { getLesson, getLessonCode, getCurriculum } = await import('./lesson.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    json: vi.fn().mockReturnThis(),
    type: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

function mockNext(): NextFunction {
  return vi.fn() as unknown as NextFunction;
}

beforeEach(() => vi.clearAllMocks());

describe('getLesson', () => {
  it('returns lesson content', () => {
    const content = { content: '# Hello' };
    mockGetLessonContent.mockReturnValue(content);
    const req = mockReq({ params: { lang: 'python', lesson: 'booleans' } });
    const res = mockRes();
    getLesson(req, res, mockNext());
    expect(res.json).toHaveBeenCalledWith(content);
  });

  it('calls next on error', () => {
    const err = new Error('not found');
    mockGetLessonContent.mockImplementation(() => {
      throw err;
    });
    const req = mockReq({ params: { lang: 'python', lesson: 'bad' } });
    const res = mockRes();
    const next = mockNext();
    getLesson(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('getLessonCode', () => {
  it('returns code as text', () => {
    mockGetLessonCode.mockReturnValue('print("hi")');
    const req = mockReq({ params: { lang: 'python', file: 'hello.py' } });
    const res = mockRes();
    getLessonCode(req, res, mockNext());
    expect(res.type).toHaveBeenCalledWith('text/plain');
    expect(res.send).toHaveBeenCalledWith('print("hi")');
  });

  it('calls next on error', () => {
    const err = new Error('not found');
    mockGetLessonCode.mockImplementation(() => {
      throw err;
    });
    const req = mockReq({ params: { lang: 'python', file: 'bad' } });
    const res = mockRes();
    const next = mockNext();
    getLessonCode(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('getCurriculum', () => {
  it('returns curriculum', async () => {
    const data = [{ id: 1 }];
    mockGetCurriculum.mockResolvedValue(data);
    const req = mockReq();
    const res = mockRes();
    await getCurriculum(req, res, mockNext());
    expect(res.json).toHaveBeenCalledWith(data);
  });

  it('calls next on error', async () => {
    const err = new Error('db error');
    mockGetCurriculum.mockRejectedValue(err);
    const req = mockReq();
    const res = mockRes();
    const next = mockNext();
    await getCurriculum(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
