import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { recordPageView: vi.fn(), report: vi.fn() };
vi.mock('../services/visits.service.js', () => mockService);

const { recordPageView, getVisits } = await import('./visits.controller.js');

function mockRes(): Response {
  const res = { json: vi.fn(), status: vi.fn(), end: vi.fn() };
  res.status.mockReturnValue(res);
  return res as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('recordPageView', () => {
  const req = (user?: { id: number }) =>
    ({
      body: { path: '/courses' },
      ip: '203.0.113.7',
      user,
      get: () => 'Firefox',
    }) as unknown as Request;

  it('passes the page, IP, browser and whether someone is signed in', async () => {
    mockService.recordPageView.mockResolvedValue(undefined);
    const res = mockRes();
    await recordPageView(req({ id: 1 }), res);
    expect(mockService.recordPageView).toHaveBeenCalledWith(
      { path: '/courses' },
      '203.0.113.7',
      'Firefox',
      true,
    );
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('still answers 204 when the visit could not be stored', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockService.recordPageView.mockRejectedValue(new Error('db down'));
    const res = mockRes();
    await recordPageView(req(), res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});

describe('getVisits', () => {
  const req = (query: Record<string, string>) => ({ query }) as unknown as Request;

  it('reports the range asked for', async () => {
    mockService.report.mockResolvedValue({ range: 90 });
    const res = mockRes();
    await getVisits(req({ range: '90' }), res, vi.fn());
    expect(mockService.report).toHaveBeenCalledWith(90);
    expect(res.json).toHaveBeenCalledWith({ range: 90 });
  });

  it('falls back to 30 days for a range it does not offer', async () => {
    mockService.report.mockResolvedValue({});
    await getVisits(req({ range: '7' }), mockRes(), vi.fn());
    expect(mockService.report).toHaveBeenCalledWith(30);
  });

  it('hands an error on', async () => {
    const err = new Error('db down');
    mockService.report.mockRejectedValue(err);
    const next = vi.fn();
    await getVisits(req({}), mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
