import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { getPublicProfile: vi.fn() };
vi.mock('../services/public-profile.service.js', () => mockService);

const { getPublicProfile } = await import('./users.controller.js');

function mockReq(params: Record<string, string>, userId?: number): Request {
  return { params, user: userId ? { id: userId } : undefined } as unknown as Request;
}
function mockRes(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getPublicProfile', () => {
  it('returns the profile for a valid id, passing the viewer id', async () => {
    const profile = { userId: 7, name: 'Nova' };
    mockService.getPublicProfile.mockResolvedValue(profile);
    const res = mockRes();
    await getPublicProfile(mockReq({ id: '7' }, 42), res, vi.fn());
    expect(mockService.getPublicProfile).toHaveBeenCalledWith(7, 42);
    expect(res.json).toHaveBeenCalledWith(profile);
  });

  it('passes a null viewer id for a guest', async () => {
    mockService.getPublicProfile.mockResolvedValue({ userId: 7 });
    await getPublicProfile(mockReq({ id: '7' }), mockRes(), vi.fn());
    expect(mockService.getPublicProfile).toHaveBeenCalledWith(7, null);
  });

  it('rejects a non-numeric id with 400 without calling the service', async () => {
    const next = vi.fn();
    await getPublicProfile(mockReq({ id: 'abc' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    expect(mockService.getPublicProfile).not.toHaveBeenCalled();
  });

  it('rejects a non-positive id with 400', async () => {
    const next = vi.fn();
    await getPublicProfile(mockReq({ id: '0' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    expect(mockService.getPublicProfile).not.toHaveBeenCalled();
  });

  it('forwards service errors to next', async () => {
    mockService.getPublicProfile.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getPublicProfile(mockReq({ id: '7' }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
