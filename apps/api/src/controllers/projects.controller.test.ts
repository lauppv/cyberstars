import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { listChecks: vi.fn(), setCheck: vi.fn() };
vi.mock('../services/projects.service.js', () => mockService);

const { listChecks, setCheck } = await import('./projects.controller.js');

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
