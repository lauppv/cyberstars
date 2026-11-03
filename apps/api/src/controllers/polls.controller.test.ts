import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { get: vi.fn(), vote: vi.fn() };
vi.mock('../services/polls.service.js', () => mockService);

const { getPoll, vote } = await import('./polls.controller.js');

function req(id: string, body: unknown = {}): Request {
  return { params: { id }, user: { id: 10 }, body } as unknown as Request;
}
function mockRes(): Response {
  return {
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getPoll', () => {
  it('returns the poll for this user', async () => {
    mockService.get.mockResolvedValue({ id: 4 });
    const res = mockRes();
    await getPoll(req('4'), res, vi.fn());
    expect(mockService.get).toHaveBeenCalledWith(4, 10);
    expect(res.json).toHaveBeenCalledWith({ id: 4 });
  });

  it.each(['abc', '0', '-3', '1.5'])('refuses the id %s with a 400', async (id) => {
    const next = vi.fn();
    await getPoll(req(id), mockRes(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: 'Invalid poll ID' }),
    );
    expect(mockService.get).not.toHaveBeenCalled();
  });
});

describe('vote', () => {
  it('votes with the options picked and answers with no body', async () => {
    mockService.vote.mockResolvedValue(undefined);
    const res = mockRes();
    await vote(req('4', { optionIds: [7, 9] }), res, vi.fn());
    expect(mockService.vote).toHaveBeenCalledWith(4, 10, [7, 9]);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('forwards errors to next', async () => {
    mockService.vote.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await vote(req('4', { optionIds: [7] }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
