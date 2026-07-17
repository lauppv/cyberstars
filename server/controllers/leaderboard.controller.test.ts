import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { getPage: vi.fn(), getMyRank: vi.fn() };
vi.mock('../services/leaderboard.service.js', () => mockService);

const { getLeaderboard, getMyRank } = await import('./leaderboard.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return { query: {}, user: { id: 10 }, ...overrides } as unknown as Request;
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getLeaderboard', () => {
  it('parses the query and returns the page', async () => {
    mockService.getPage.mockResolvedValue({ entries: [] });
    const res = mockRes();
    await getLeaderboard(mockReq({ query: { take: '5', skip: '10' } }), res, vi.fn());
    expect(mockService.getPage).toHaveBeenCalledWith(5, 10, false);
    expect(res.json).toHaveBeenCalledWith({ entries: [] });
  });

  it('forces fresh with ?fresh=1', async () => {
    mockService.getPage.mockResolvedValue({ entries: [] });
    await getLeaderboard(mockReq({ query: { fresh: '1' } }), mockRes(), vi.fn());
    expect(mockService.getPage).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), true);
  });

  it('forwards errors to next', async () => {
    mockService.getPage.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getLeaderboard(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('getMyRank', () => {
  it('returns the user rank entry', async () => {
    mockService.getMyRank.mockResolvedValue({ rank: 3 });
    const res = mockRes();
    await getMyRank(mockReq(), res, vi.fn());
    expect(mockService.getMyRank).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith({ rank: 3 });
  });

  it('forwards errors to next', async () => {
    mockService.getMyRank.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getMyRank(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
