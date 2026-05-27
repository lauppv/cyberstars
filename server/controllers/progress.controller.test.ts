import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockGetCourseProgress = vi.fn();
const mockMarkComplete = vi.fn();
const mockGetSavedCode = vi.fn();
const mockSaveCode = vi.fn();
const mockTrackAccess = vi.fn();

vi.mock('../services/progress.service.js', () => ({
  getCourseProgress: (...args: unknown[]) => mockGetCourseProgress(...args),
  markComplete: (...args: unknown[]) => mockMarkComplete(...args),
  getSavedCode: (...args: unknown[]) => mockGetSavedCode(...args),
  saveCode: (...args: unknown[]) => mockSaveCode(...args),
  trackAccess: (...args: unknown[]) => mockTrackAccess(...args),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: class {
    constructor() {
      return {};
    }
  },
}));

const ctrl = await import('./progress.controller.js');

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

describe('getCourseProgress', () => {
  it('returns progress for a course', async () => {
    const progress = [{ lessonSlug: 'intro', completed: true }];
    mockGetCourseProgress.mockResolvedValue(progress);
    const req = mockReq({ params: { courseKey: 'python' } });
    const res = mockRes();
    await ctrl.getCourseProgress(req, res);
    expect(mockGetCourseProgress).toHaveBeenCalledWith(1, 'python');
    expect(res.json).toHaveBeenCalledWith(progress);
  });
});

describe('markComplete', () => {
  it('marks a lesson as complete', async () => {
    mockMarkComplete.mockResolvedValue(undefined);
    const req = mockReq({ params: { courseKey: 'python', lessonSlug: 'booleans' } });
    const res = mockRes();
    await ctrl.markComplete(req, res);
    expect(mockMarkComplete).toHaveBeenCalledWith(1, 'python', 'booleans');
    expect(res.json).toHaveBeenCalledWith({ message: 'Lesson marked as complete' });
  });
});

describe('getSavedCode', () => {
  it('returns saved code for a lesson', async () => {
    mockGetSavedCode.mockResolvedValue("print('hi')");
    const req = mockReq({ params: { courseKey: 'python', lessonSlug: 'booleans' } });
    const res = mockRes();
    await ctrl.getSavedCode(req, res);
    expect(mockGetSavedCode).toHaveBeenCalledWith(1, 'python', 'booleans');
    expect(res.json).toHaveBeenCalledWith({ code: "print('hi')" });
  });
});

describe('saveCode', () => {
  it('saves code for a lesson', async () => {
    mockSaveCode.mockResolvedValue(undefined);
    const req = mockReq({
      params: { courseKey: 'python', lessonSlug: 'booleans' },
      body: { code: 'x=1' },
    });
    const res = mockRes();
    await ctrl.saveCode(req, res);
    expect(mockSaveCode).toHaveBeenCalledWith(1, 'python', 'booleans', 'x=1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Code saved' });
  });
});

describe('trackAccess', () => {
  it('tracks lesson access', async () => {
    mockTrackAccess.mockResolvedValue(undefined);
    const req = mockReq({ params: { courseKey: 'python', lessonSlug: 'booleans' } });
    const res = mockRes();
    await ctrl.trackAccess(req, res);
    expect(mockTrackAccess).toHaveBeenCalledWith(1, 'python', 'booleans');
    expect(res.json).toHaveBeenCalledWith({ message: 'Access tracked' });
  });
});
