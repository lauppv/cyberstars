import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';

const mockSupportService = {
  create: vi.fn(),
  findByUser: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  updateStatus: vi.fn(),
  getMessages: vi.fn(),
  addMessage: vi.fn(),
};

vi.mock('../services/support.service.js', () => mockSupportService);

const mockUserRepo = {
  getRole: vi.fn(),
};
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
  getTicketMessages,
  addTicketMessage,
} = await import('./support.controller.js');

function mockReq(overrides: Partial<Request> = {}): Request {
  return { params: {}, body: {}, user: undefined, ...overrides } as unknown as Request;
}

function mockRes(): Response {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
  return res as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('createTicket', () => {
  it('creates ticket successfully', async () => {
    mockSupportService.create.mockResolvedValue({ id: 10 });
    const res = mockRes();
    await createTicket(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { type: 'BUG', subject: 'Bug report', message: 'Details' },
      }),
      res,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ticketId: 10 });
  });
});

describe('getMyTickets', () => {
  it('returns user tickets as DTOs', async () => {
    const now = new Date();
    mockSupportService.findByUser.mockResolvedValue([
      {
        id: 1,
        type: 'BUG',
        subject: 's',
        message: 'm',
        status: 'OPEN',
        createdAt: now,
        updatedAt: now,
      },
    ]);
    const res = mockRes();
    await getMyTickets(mockReq({ user: { id: 1 } as Request['user'] }), res, vi.fn());
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ id: 1, type: 'BUG', createdAt: now.toISOString() }),
    ]);
  });
});

describe('getAllTickets', () => {
  it('returns 403 for non-admin', async () => {
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await getAllTickets(mockReq({ user: { id: 1 } as Request['user'] }), mockRes(), next);
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns all tickets for admin', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    const now = new Date();
    mockSupportService.findAll.mockResolvedValue([
      {
        id: 1,
        type: 'BUG',
        subject: 's',
        message: 'm',
        status: 'OPEN',
        createdAt: now,
        updatedAt: now,
        user: { name: 'Alice', email: 'a@t.com' },
      },
    ]);
    const res = mockRes();
    await getAllTickets(mockReq({ user: { id: 1 } as Request['user'] }), res, vi.fn());
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ id: 1, authorName: 'Alice' }),
    ]);
  });
});

describe('updateTicketStatus', () => {
  it('returns 404 for missing ticket', async () => {
    mockSupportService.findById.mockResolvedValue(null);
    const next = vi.fn();
    await updateTicketStatus(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '999' } as Record<string, string>,
        body: { status: 'CLOSED' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(404);
  });

  it('allows owner to close their ticket', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockSupportService.updateStatus.mockResolvedValue({});
    const res = mockRes();
    await updateTicketStatus(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
        body: { status: 'CLOSED' },
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('prevents owner from setting status other than CLOSED', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await updateTicketStatus(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
        body: { status: 'IN_PROGRESS' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('prevents non-owner non-admin from updating', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 99 });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await updateTicketStatus(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
        body: { status: 'CLOSED' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('allows admin to set any status', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 99 });
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockSupportService.updateStatus.mockResolvedValue({});
    const res = mockRes();
    await updateTicketStatus(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
        body: { status: 'IN_PROGRESS' },
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});

describe('getTicketMessages', () => {
  it('returns 403 for non-owner non-admin', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 99 });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await getTicketMessages(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns messages for owner', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const now = new Date();
    mockSupportService.getMessages.mockResolvedValue([
      { id: 1, userId: 1, message: 'Hello', createdAt: now, user: { name: 'Alice', role: 'USER' } },
    ]);
    const res = mockRes();
    await getTicketMessages(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
      }),
      res,
      vi.fn(),
    );
    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({ id: 1, authorName: 'Alice', isAdmin: false }),
    ]);
  });
});

describe('addTicketMessage', () => {
  it('creates message successfully', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 1 });
    mockUserRepo.getRole.mockResolvedValue('USER');
    mockSupportService.addMessage.mockResolvedValue({});
    const res = mockRes();
    await addTicketMessage(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
        body: { message: 'Help!' },
      }),
      res,
      vi.fn(),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it('returns 403 when non-admin tries to reply to someone else’s ticket', async () => {
    mockSupportService.findById.mockResolvedValue({ id: 1, userId: 99 });
    mockUserRepo.getRole.mockResolvedValue('USER');
    const next = vi.fn();
    await addTicketMessage(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: '1' } as Record<string, string>,
        body: { message: 'Help!' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(403);
  });

  it('returns 400 for non-numeric ticket id', async () => {
    const next = vi.fn();
    await addTicketMessage(
      mockReq({
        user: { id: 1 } as Request['user'],
        params: { id: 'abc' } as Record<string, string>,
        body: { message: 'Help!' },
      }),
      mockRes(),
      next,
    );
    expect((next.mock.calls[0][0] as AppError).statusCode).toBe(400);
  });
});

describe('error forwarding via next()', () => {
  it('createTicket forwards service errors to next()', async () => {
    mockSupportService.create.mockRejectedValue(new Error('DB down'));
    const next = vi.fn();
    await createTicket(
      mockReq({
        user: { id: 1 } as Request['user'],
        body: { type: 'BUG', subject: 'X', message: 'Y' },
      }),
      mockRes(),
      next,
    );
    expect(next).toHaveBeenCalled();
    expect((next.mock.calls[0][0] as Error).message).toBe('DB down');
  });

  it('getMyTickets forwards service errors to next()', async () => {
    mockSupportService.findByUser.mockRejectedValue(new Error('boom'));
    const next = vi.fn();
    await getMyTickets(mockReq({ user: { id: 1 } as Request['user'] }), mockRes(), next);
    expect((next.mock.calls[0][0] as Error).message).toBe('boom');
  });
});
