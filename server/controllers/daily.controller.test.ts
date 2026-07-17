import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { getDaily: vi.fn() };
vi.mock('../services/daily.service.js', () => mockService);

const { getDaily } = await import('./daily.controller.js');

function mockReq(): Request {
  return { user: { id: 10 } } as unknown as Request;
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getDaily', () => {
  it('returns the daily payload for the user', async () => {
    mockService.getDaily.mockResolvedValue({ picks: [] });
    const res = mockRes();
    await getDaily(mockReq(), res);
    expect(mockService.getDaily).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith({ picks: [] });
  });
});
