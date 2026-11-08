import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '@cyberstars-framework/server-kit/errors';

const mockService = {
  getPage: vi.fn(),
  markRead: vi.fn(),
  markOneRead: vi.fn(),
  getNotices: vi.fn(),
  markShown: vi.fn(),
  markSectionRead: vi.fn(),
};
vi.mock('../services/notifications.service.js', () => mockService);

const { getNotifications, markRead, markOneRead, getNotices, markShown, markSectionRead } =
  await import('./notifications.controller.js');

const NO_SECTIONS = { forum: [], support: [], connections: 0, laniakea: 0 };

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, query: {}, user: { id: 10 }, ...overrides } as unknown as Request;
}
function mockRes(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('getNotifications', () => {
  it('returns the page using clamped query defaults', async () => {
    mockService.getPage.mockResolvedValue({ items: [], unreadCount: 0, sections: NO_SECTIONS });
    const res = mockRes();
    const next = vi.fn();
    await getNotifications(mockReq({ query: {} }), res, next);
    expect(mockService.getPage).toHaveBeenCalledWith(10, 20, undefined);
    expect(res.json).toHaveBeenCalledWith({ items: [], unreadCount: 0, sections: NO_SECTIONS });
    expect(next).not.toHaveBeenCalled();
  });

  it('passes take and before through', async () => {
    mockService.getPage.mockResolvedValue({ items: [], unreadCount: 0, sections: NO_SECTIONS });
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

describe('getNotices', () => {
  it("returns the user's notices", async () => {
    mockService.getNotices.mockResolvedValue([{ id: 3 }]);
    const res = mockRes();
    await getNotices(mockReq(), res, vi.fn());
    expect(mockService.getNotices).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith([{ id: 3 }]);
  });

  it('forwards errors to next', async () => {
    mockService.getNotices.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getNotices(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('markShown', () => {
  it('marks the ids shown and answers 204', async () => {
    mockService.markShown.mockResolvedValue(undefined);
    const res = mockRes();
    await markShown(mockReq({ body: { ids: [3, 5] } }), res, vi.fn());
    expect(mockService.markShown).toHaveBeenCalledWith(10, [3, 5]);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('forwards errors to next', async () => {
    mockService.markShown.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await markShown(mockReq({ body: { ids: [3] } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('markSectionRead', () => {
  it('reads one thread of a section and answers 204', async () => {
    mockService.markSectionRead.mockResolvedValue(undefined);
    const res = mockRes();
    await markSectionRead(mockReq({ body: { section: 'forum', entityId: 7 } }), res, vi.fn());
    expect(mockService.markSectionRead).toHaveBeenCalledWith(10, 'forum', 7);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('reads a whole section when no entity is given', async () => {
    mockService.markSectionRead.mockResolvedValue(undefined);
    await markSectionRead(mockReq({ body: { section: 'connections' } }), mockRes(), vi.fn());
    expect(mockService.markSectionRead).toHaveBeenCalledWith(10, 'connections', undefined);
  });

  it('forwards errors to next', async () => {
    mockService.markSectionRead.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await markSectionRead(mockReq({ body: { section: 'support', entityId: 3 } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
