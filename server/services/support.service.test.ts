import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  supportTicket: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  supportMessage: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const supportService = await import('./support.service.js');

beforeEach(() => vi.clearAllMocks());

describe('create', () => {
  it('creates a support ticket', async () => {
    const ticket = { id: 1, userId: 1, type: 'BUG', subject: 'Test', message: 'Help' };
    mockPrisma.supportTicket.create.mockResolvedValue(ticket);
    const result = await supportService.create(1, 'BUG' as never, 'Test', 'Help');
    expect(result).toEqual(ticket);
    expect(mockPrisma.supportTicket.create).toHaveBeenCalledWith({
      data: { userId: 1, type: 'BUG', subject: 'Test', message: 'Help' },
    });
  });
});

describe('findByUser', () => {
  it('returns tickets ordered by createdAt desc', async () => {
    mockPrisma.supportTicket.findMany.mockResolvedValue([]);
    await supportService.findByUser(5);
    expect(mockPrisma.supportTicket.findMany).toHaveBeenCalledWith({
      where: { userId: 5 },
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('findAll', () => {
  it('returns all tickets with user info', async () => {
    mockPrisma.supportTicket.findMany.mockResolvedValue([]);
    await supportService.findAll();
    expect(mockPrisma.supportTicket.findMany).toHaveBeenCalledWith({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      include: { user: { select: { name: true, email: true } } },
    });
  });
});

describe('findById', () => {
  it('returns a ticket by id', async () => {
    const ticket = { id: 3 };
    mockPrisma.supportTicket.findUnique.mockResolvedValue(ticket);
    const result = await supportService.findById(3);
    expect(result).toEqual(ticket);
  });
});

describe('updateStatus', () => {
  it('updates ticket status', async () => {
    mockPrisma.supportTicket.update.mockResolvedValue({ id: 1, status: 'CLOSED' });
    await supportService.updateStatus(1, 'CLOSED' as never);
    expect(mockPrisma.supportTicket.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'CLOSED' },
    });
  });
});

describe('getMessages', () => {
  it('returns messages for a ticket', async () => {
    mockPrisma.supportMessage.findMany.mockResolvedValue([]);
    await supportService.getMessages(7);
    expect(mockPrisma.supportMessage.findMany).toHaveBeenCalledWith({
      where: { ticketId: 7 },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { name: true, role: true } } },
    });
  });
});

describe('addMessage', () => {
  it('creates a message on a ticket', async () => {
    const msg = { id: 1, ticketId: 2, userId: 3, message: 'Reply' };
    mockPrisma.supportMessage.create.mockResolvedValue(msg);
    const result = await supportService.addMessage(2, 3, 'Reply');
    expect(result).toEqual(msg);
  });
});
