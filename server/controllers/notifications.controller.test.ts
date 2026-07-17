import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const mockService = {
  getPage: vi.fn(),
  markRead: vi.fn(),
  markOneRead: vi.fn(),
};
vi.mock('../services/notifications.service.js', () => mockService);

const { getNotifications, markRead, markOneRead } = await import('./notifications.controller.js');

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

describe('getNotifications', () => {
  it('returns the page using clamped query defaults', async () => {
    mockService.getPage.mockResolvedValue({ items: [], unreadCount: 0 });
    const res = mockRes();
    const next = vi.fn();
    await getNotifications(mockReq({ query: {} }), res, next);
    expect(mockService.getPage).toHaveBeenCalledWith(10, 20, undefined);
    expect(res.json).toHaveBeenCalledWith({ items: [], unreadCount: 0 });
    expect(next).not.toHaveBeenCalled();
  });

  it('passes take and before through', async () => {
    mockService.getPage.mockResolvedValue({ items: [], unreadCount: 0 });
    await getNotifications(mockReq({ query: { take: '5', before: '100' } }), mockRes(), vi.fn());
    expect(mockService.getPage).toHaveBeenCalledWith(10, 5, 100);
  });

  it('forwards errors to next', async () => {
    mockService.getPage.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getNotifications(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('markRead', () => {
  it('marks read up to the given id', async () => {
    mockService.markRead.mockResolvedValue(3);
    const res = mockRes();
    await markRead(mockReq({ body: { upToId: 50 } }), res, vi.fn());
    expect(mockService.markRead).toHaveBeenCalledWith(10, 50);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe('markOneRead', () => {
  it('marks a single notification read', async () => {
    mockService.markOneRead.mockResolvedValue(undefined);
    const res = mockRes();
    await markOneRead(mockReq({ params: { id: '7' } }), res, vi.fn());
    expect(mockService.markOneRead).toHaveBeenCalledWith(10, 7);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('rejects a non-numeric id', async () => {
    const next = vi.fn();
    await markOneRead(mockReq({ params: { id: 'abc' } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockService.markOneRead).not.toHaveBeenCalled();
  });
});
