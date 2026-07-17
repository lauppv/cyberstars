import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

const mockService = {
  getInbox: vi.fn(),
  openConversation: vi.fn(),
  getHistory: vi.fn(),
  sendMessage: vi.fn(),
  markRead: vi.fn(),
  deleteMessage: vi.fn(),
};
vi.mock('../services/messages.service.js', () => mockService);

const ctrl = await import('./messages.controller.js');

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

describe('getInbox', () => {
  it('returns the inbox', async () => {
    mockService.getInbox.mockResolvedValue([{ id: 1 }]);
    const res = mockRes();
    await ctrl.getInbox(mockReq(), res, vi.fn());
    expect(mockService.getInbox).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith({ conversations: [{ id: 1 }] });
  });

  it('forwards errors to next', async () => {
    mockService.getInbox.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await ctrl.getInbox(mockReq(), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('openConversation', () => {
  it('creates/opens a conversation and returns 201', async () => {
    mockService.openConversation.mockResolvedValue({ id: 3 });
    const res = mockRes();
    await ctrl.openConversation(mockReq({ body: { recipientId: 2 } }), res, vi.fn());
    expect(mockService.openConversation).toHaveBeenCalledWith(10, 2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ conversation: { id: 3 } });
  });

  it('forwards errors to next', async () => {
    mockService.openConversation.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await ctrl.openConversation(mockReq({ body: { recipientId: 2 } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('getHistory', () => {
  it('parses the query and returns history', async () => {
    mockService.getHistory.mockResolvedValue({ messages: [] });
    const res = mockRes();
    await ctrl.getHistory(
      mockReq({ params: { id: '3' }, query: { take: '5', before: '100' } }),
      res,
      vi.fn(),
    );
    expect(mockService.getHistory).toHaveBeenCalledWith(10, 3, 5, 100);
    expect(res.json).toHaveBeenCalledWith({ messages: [] });
  });

  it('rejects a non-numeric conversation id via next', async () => {
    const next = vi.fn();
    await ctrl.getHistory(mockReq({ params: { id: 'abc' }, query: {} }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockService.getHistory).not.toHaveBeenCalled();
  });
});

describe('sendMessage', () => {
  it('sends and returns 201', async () => {
    mockService.sendMessage.mockResolvedValue({ id: 7 });
    const res = mockRes();
    await ctrl.sendMessage(mockReq({ params: { id: '3' }, body: { content: 'hi' } }), res, vi.fn());
    expect(mockService.sendMessage).toHaveBeenCalledWith(10, 3, 'hi');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: { id: 7 } });
  });

  it('forwards errors to next', async () => {
    mockService.sendMessage.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await ctrl.sendMessage(
      mockReq({ params: { id: '3' }, body: { content: 'hi' } }),
      mockRes(),
      next,
    );
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('markRead', () => {
  it('marks read and returns ok', async () => {
    mockService.markRead.mockResolvedValue(undefined);
    const res = mockRes();
    await ctrl.markRead(
      mockReq({ params: { id: '3' }, body: { upToMessageId: 50 } }),
      res,
      vi.fn(),
    );
    expect(mockService.markRead).toHaveBeenCalledWith(10, 3, 50);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe('deleteMessage', () => {
  it('deletes a message by id', async () => {
    mockService.deleteMessage.mockResolvedValue({ id: 7, deleted: true });
    const res = mockRes();
    await ctrl.deleteMessage(mockReq({ params: { messageId: '7' } }), res, vi.fn());
    expect(mockService.deleteMessage).toHaveBeenCalledWith(10, 7);
    expect(res.json).toHaveBeenCalledWith({ message: { id: 7, deleted: true } });
  });

  it('rejects a non-numeric message id via next', async () => {
    const next = vi.fn();
    await ctrl.deleteMessage(mockReq({ params: { messageId: 'abc' } }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockService.deleteMessage).not.toHaveBeenCalled();
  });
});
