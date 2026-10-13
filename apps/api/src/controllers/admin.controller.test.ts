import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { getStats: vi.fn() };
vi.mock('../services/admin.service.js', () => mockService);

const { getStats } = await import('./admin.controller.js');

function mockReq(query: Record<string, unknown> = {}): Request {
  return { query } as unknown as Request;
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getStats', () => {
  it('returns cached stats by default', async () => {
    mockService.getStats.mockResolvedValue({ users: 1 });
    const res = mockRes();
    await getStats(mockReq(), res, vi.fn());
    expect(mockService.getStats).toHaveBeenCalledWith(false);
    expect(res.json).toHaveBeenCalledWith({ users: 1 });
  });

  it('forces a fresh recompute when ?fresh=1', async () => {
    mockService.getStats.mockResolvedValue({ users: 2 });
    await getStats(mockReq({ fresh: '1' }), mockRes(), vi.fn());
    expect(mockService.getStats).toHaveBeenCalledWith(true);
  });

  it('forwards errors to next', async () => {
    mockService.getStats.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getStats(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
