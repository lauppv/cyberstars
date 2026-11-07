import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = {
  listChecks: vi.fn(),
  setCheck: vi.fn(),
  listCompletions: vi.fn(),
  complete: vi.fn(),
};
vi.mock('../services/projects.service.js', () => mockService);
const mockRunProjectTests = vi.fn();
vi.mock('../services/lesson-tests.service.js', () => ({
  runProjectTests: (...a: unknown[]) => mockRunProjectTests(...a),
}));

const { listChecks, setCheck, listCompletions, runTests } =
  await import('./projects.controller.js');

function mockRes(): Response {
  return {
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('listChecks', () => {
  it('answers the student’s ticks', async () => {
    mockService.listChecks.mockResolvedValue([{ stepId: 'catalog' }]);
    const res = mockRes();
    await listChecks({ user: { id: 7 } } as unknown as Request, res, vi.fn());
    expect(mockService.listChecks).toHaveBeenCalledWith(7);
    expect(res.json).toHaveBeenCalledWith([{ stepId: 'catalog' }]);
  });

  it('hands a failure on', async () => {
    const err = new Error('db down');
    mockService.listChecks.mockRejectedValue(err);
    const next = vi.fn();
    await listChecks({ user: { id: 7 } } as unknown as Request, mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('setCheck', () => {
  const req = {
    user: { id: 7 },
    params: { language: 'python', slug: 'library-desk', stepId: 'list' },
    body: { checked: true },
  } as unknown as Request;

  it('ticks the step and answers with no body', async () => {
    const res = mockRes();
    await setCheck(req, res, vi.fn());
    expect(mockService.setCheck).toHaveBeenCalledWith(7, 'python', 'library-desk', 'list', true);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('hands a refusal on', async () => {
    const err = new Error('Step not found');
    mockService.setCheck.mockRejectedValue(err);
    const next = vi.fn();
    await setCheck(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('listCompletions', () => {
  it('answers the projects the student finished', async () => {
    mockService.listCompletions.mockResolvedValue([{ slug: 'library-desk' }]);
    const res = mockRes();
    await listCompletions({ user: { id: 7 } } as unknown as Request, res, vi.fn());
    expect(mockService.listCompletions).toHaveBeenCalledWith(7);
    expect(res.json).toHaveBeenCalledWith([{ slug: 'library-desk' }]);
  });
});

describe('runTests', () => {
  const req = (user?: { id: number }) =>
    ({
      user,
      cookies: user ? {} : { guestId: 'g1' },
      ip: '127.0.0.1',
      get: () => undefined,
      params: { language: 'python', slug: 'library-desk' },
      body: { code: 'print(1)' },
    }) as unknown as Request;

  it('judges the program, and a signed-in student’s pass finishes the project', async () => {
    mockRunProjectTests.mockResolvedValue({ status: 'passed' });
    const res = mockRes();
    await runTests(req({ id: 7 }), res, vi.fn());
    expect(mockRunProjectTests).toHaveBeenCalledWith(
      'user:7',
      'python',
      'library-desk',
      'print(1)',
      undefined,
      null,
    );
    expect(mockService.complete).toHaveBeenCalledWith(7, 'python', 'library-desk');
    expect(res.json).toHaveBeenCalledWith({ status: 'passed' });
  });

  it('finishes nothing on a failing run, nor for a guest', async () => {
    mockRunProjectTests.mockResolvedValueOnce({ status: 'failed' });
    await runTests(req({ id: 7 }), mockRes(), vi.fn());
    mockRunProjectTests.mockResolvedValueOnce({ status: 'passed' });
    await runTests(req(), mockRes(), vi.fn());
    expect(mockService.complete).not.toHaveBeenCalled();
  });

  it('keeps the verdict when saving the completion fails', async () => {
    mockRunProjectTests.mockResolvedValue({ status: 'passed' });
    mockService.complete.mockRejectedValueOnce(new Error('db down'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = mockRes();
    const next = vi.fn();
    await runTests(req({ id: 7 }), res, next);
    expect(res.json).toHaveBeenCalledWith({ status: 'passed' });
    expect(next).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
