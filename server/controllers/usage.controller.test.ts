import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockUsage = { getSummary: vi.fn(), consume: vi.fn() };
vi.mock('../services/usage.service.js', () => mockUsage);

const mockUserRepo = { getRole: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const { getUsage, consumeSolution } = await import('./usage.controller.js');

function mockReq(id = 5): Request {
  return { user: { id } } as unknown as Request;
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getUsage', () => {
  it('passes admin=true for a FOUNDER role', async () => {
    mockUserRepo.getRole.mockResolvedValue('FOUNDER');
    mockUsage.getSummary.mockReturnValue({ ok: true });
    const res = mockRes();
    await getUsage(mockReq(), res, vi.fn());
    expect(mockUsage.getSummary).toHaveBeenCalledWith(5, true);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('passes admin=false for a USER role', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockUsage.getSummary.mockReturnValue({});
    await getUsage(mockReq(), mockRes(), vi.fn());
    expect(mockUsage.getSummary).toHaveBeenCalledWith(5, false);
  });

  it('forwards errors to next', async () => {
    mockUserRepo.getRole.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getUsage(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('consumeSolution', () => {
  it('consumes the showSolution action', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockUsage.consume.mockReturnValue({ spent: 1 });
    const res = mockRes();
    await consumeSolution(mockReq(8), res, vi.fn());
    expect(mockUsage.consume).toHaveBeenCalledWith(8, 'showSolution', false);
    expect(res.json).toHaveBeenCalledWith({ spent: 1 });
  });

  it('forwards a 429 from the service to next', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockUsage.consume.mockImplementation(() => {
      throw new Error('limit');
    });
    const next = vi.fn();
    await consumeSolution(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
