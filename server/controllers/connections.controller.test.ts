import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const mockService = {
  getOverview: vi.fn(),
  sendRequest: vi.fn(),
  accept: vi.fn(),
  decline: vi.fn(),
  removeByCaller: vi.fn(),
};
vi.mock('../services/connections.service.js', () => mockService);

const ctrl = await import('./connections.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, query: {}, user: { id: 10 }, ...overrides } as unknown as Request;
}
function mockRes(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getOverview', () => {
  it('returns the overview for the caller', async () => {
    mockService.getOverview.mockResolvedValue({ connections: [], incoming: [], outgoing: [] });
    const res = mockRes();
    await ctrl.getOverview(mockReq(), res, vi.fn());
    expect(mockService.getOverview).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith({ connections: [], incoming: [], outgoing: [] });
  });

  it('forwards errors to next', async () => {
    mockService.getOverview.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await ctrl.getOverview(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('sendRequest', () => {
  it('sends a request and returns 201', async () => {
    mockService.sendRequest.mockResolvedValue(undefined);
    const res = mockRes();
    await ctrl.sendRequest(mockReq({ body: { addresseeId: 2 } }), res, vi.fn());
    expect(mockService.sendRequest).toHaveBeenCalledWith(10, 2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('forwards errors to next', async () => {
    mockService.sendRequest.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await ctrl.sendRequest(mockReq({ body: { addresseeId: 2 } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('accept', () => {
  it('accepts a connection by id', async () => {
    mockService.accept.mockResolvedValue(undefined);
    const res = mockRes();
    await ctrl.accept(mockReq({ params: { id: '50' } }), res, vi.fn());
    expect(mockService.accept).toHaveBeenCalledWith(10, 50);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('rejects a non-numeric id via next', async () => {
    const next = vi.fn();
    await ctrl.accept(mockReq({ params: { id: 'abc' } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockService.accept).not.toHaveBeenCalled();
  });
});

describe('decline', () => {
  it('declines a connection by id', async () => {
    mockService.decline.mockResolvedValue(undefined);
    const res = mockRes();
    await ctrl.decline(mockReq({ params: { id: '50' } }), res, vi.fn());
    expect(mockService.decline).toHaveBeenCalledWith(10, 50);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('rejects a non-numeric id via next', async () => {
    const next = vi.fn();
    await ctrl.decline(mockReq({ params: { id: 'abc' } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockService.decline).not.toHaveBeenCalled();
  });
});

describe('remove', () => {
  it('removes/cancels a connection by id', async () => {
    mockService.removeByCaller.mockResolvedValue(undefined);
    const res = mockRes();
    await ctrl.remove(mockReq({ params: { id: '50' } }), res, vi.fn());
    expect(mockService.removeByCaller).toHaveBeenCalledWith(10, 50);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('rejects a non-numeric id via next', async () => {
    const next = vi.fn();
    await ctrl.remove(mockReq({ params: { id: 'abc' } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockService.removeByCaller).not.toHaveBeenCalled();
  });
});
