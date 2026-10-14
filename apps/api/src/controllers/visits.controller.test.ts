import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = {
  recordPageView: vi.fn(),
  recordSteps: vi.fn(),
  report: vi.fn(),
  guestVisits: vi.fn(),
};
vi.mock('../services/visits.service.js', () => mockService);
const mockUserRepo = { getRole: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const { recordPageView, recordSteps, getVisits, getGuestVisits } =
  await import('./visits.controller.js');

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
    mockUserRepo.getRole.mockResolvedValue('USER');
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

  it.each(['ADMIN', 'FOUNDER'])('leaves out the visits of an %s', async (role) => {
    mockUserRepo.getRole.mockResolvedValue(role);
    const res = mockRes();
    await recordPageView(req({ id: 1 }), res);
    expect(mockUserRepo.getRole).toHaveBeenCalledWith(1);
    expect(mockService.recordPageView).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('counts a guest without asking for a role', async () => {
    mockService.recordPageView.mockResolvedValue(undefined);
    await recordPageView(req(), mockRes());
    expect(mockUserRepo.getRole).not.toHaveBeenCalled();
    expect(mockService.recordPageView).toHaveBeenCalled();
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

describe('recordSteps', () => {
  const steps = { steps: [{ kind: 'click', target: 'run' }] };
  const req = (user?: { id: number }) =>
    ({ body: steps, ip: '203.0.113.7', user, get: () => 'Firefox' }) as unknown as Request;

  it('passes the steps, IP and browser', async () => {
    mockService.recordSteps.mockResolvedValue(undefined);
    const res = mockRes();
    await recordSteps(req(), res);
    expect(mockService.recordSteps).toHaveBeenCalledWith(steps, '203.0.113.7', 'Firefox');
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it('leaves out the steps of an admin', async () => {
    mockUserRepo.getRole.mockResolvedValue('FOUNDER');
    await recordSteps(req({ id: 1 }), mockRes());
    expect(mockService.recordSteps).not.toHaveBeenCalled();
  });

  it('still answers 204 when the steps could not be stored', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockService.recordSteps.mockRejectedValue(new Error('db down'));
    const res = mockRes();
    await recordSteps(req(), res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(error).toHaveBeenCalledWith('[visits] could not record steps:', expect.any(Error));
    error.mockRestore();
  });
});

describe('getGuestVisits', () => {
  const req = (query: Record<string, string>) => ({ query }) as unknown as Request;

  it('passes the range, source and where the page starts', async () => {
    mockService.guestVisits.mockResolvedValue({ visits: [], next: null });
    const res = mockRes();
    await getGuestVisits(req({ range: '90', source: 'reddit', before: '40' }), res, vi.fn());
    expect(mockService.guestVisits).toHaveBeenCalledWith(90, { source: 'reddit', before: 40 });
    expect(res.json).toHaveBeenCalledWith({ visits: [], next: null });
  });

  it('ignores a source too long to be one and a start that is not an id', async () => {
    mockService.guestVisits.mockResolvedValue({ visits: [], next: null });
    await getGuestVisits(req({ source: 'x'.repeat(101), before: '-3' }), mockRes(), vi.fn());
    await getGuestVisits(req({ before: 'abc' }), mockRes(), vi.fn());
    expect(mockService.guestVisits).toHaveBeenNthCalledWith(1, 30, {
      source: undefined,
      before: undefined,
    });
    expect(mockService.guestVisits).toHaveBeenNthCalledWith(2, 30, {
      source: undefined,
      before: undefined,
    });
  });

  it('hands an error on', async () => {
    const err = new Error('db down');
    mockService.guestVisits.mockRejectedValue(err);
    const next = vi.fn();
    await getGuestVisits(req({}), mockRes(), next);
    expect(next).toHaveBeenCalledWith(err);
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
