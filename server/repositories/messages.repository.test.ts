import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  conversation: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  directMessage: {
    groupBy: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
    findUnique: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./messages.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('findOrCreatePair', () => {
  it('orders the pair canonically (a<b) and returns an existing row', async () => {
    mockPrisma.conversation.findUnique.mockResolvedValue({ id: 1 });
    const row = await repo.findOrCreatePair(5, 2);
    expect(row).toEqual({ id: 1 });
    expect(mockPrisma.conversation.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userAId_userBId: { userAId: 2, userBId: 5 } } }),
    );
    expect(mockPrisma.conversation.create).not.toHaveBeenCalled();
  });

  it('creates the pair when none exists (a<b keeps order)', async () => {
    mockPrisma.conversation.findUnique.mockResolvedValue(null);
    mockPrisma.conversation.create.mockResolvedValue({ id: 9 });
    const row = await repo.findOrCreatePair(2, 5);
    expect(row).toEqual({ id: 9 });
    expect(mockPrisma.conversation.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { userAId: 2, userBId: 5 } }),
    );
  });

  it('re-reads the winner row when a concurrent create hits the unique constraint', async () => {
    const { Prisma } = await import('@prisma/client');
    mockPrisma.conversation.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 7 });
    mockPrisma.conversation.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('unique', { code: 'P2002', clientVersion: 'test' }),
    );
    const row = await repo.findOrCreatePair(2, 5);
    expect(row).toEqual({ id: 7 });
    expect(mockPrisma.conversation.findUnique).toHaveBeenCalledTimes(2);
  });

  it('rethrows non-P2002 create errors', async () => {
    mockPrisma.conversation.findUnique.mockResolvedValue(null);
    mockPrisma.conversation.create.mockRejectedValue(new Error('boom'));
    await expect(repo.findOrCreatePair(2, 5)).rejects.toThrow('boom');
  });
});

describe('findConversation', () => {
  it('looks up by id with the include', async () => {
    mockPrisma.conversation.findUnique.mockResolvedValue({ id: 3 });
    expect(await repo.findConversation(3)).toEqual({ id: 3 });
    expect(mockPrisma.conversation.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 } }),
    );
  });
});

describe('listConversations', () => {
  it('lists conversations where the user is a participant, newest first', async () => {
    mockPrisma.conversation.findMany.mockResolvedValue([{ id: 1 }]);
    expect(await repo.listConversations(7)).toEqual([{ id: 1 }]);
    expect(mockPrisma.conversation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { OR: [{ userAId: 7 }, { userBId: 7 }] },
        orderBy: { updatedAt: 'desc' },
      }),
    );
  });
});

describe('unreadByConversation', () => {
  it('maps grouped unread counts', async () => {
    mockPrisma.directMessage.groupBy.mockResolvedValue([
      { conversationId: 1, _count: { _all: 3 } },
      { conversationId: 2, _count: { _all: 1 } },
    ]);
    const map = await repo.unreadByConversation(7);
    expect(map.get(1)).toBe(3);
    expect(map.get(2)).toBe(1);
    expect(mockPrisma.directMessage.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ readAt: null, senderId: { not: 7 } }),
      }),
    );
  });
});

describe('listMessages', () => {
  it('lists newest-first with a take and no cursor', async () => {
    mockPrisma.directMessage.findMany.mockResolvedValue([{ id: 5 }]);
    await repo.listMessages(1, 30);
    expect(mockPrisma.directMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { conversationId: 1 }, take: 30, orderBy: { id: 'desc' } }),
    );
  });

  it('applies the before cursor', async () => {
    mockPrisma.directMessage.findMany.mockResolvedValue([]);
    await repo.listMessages(1, 30, 99);
    expect(mockPrisma.directMessage.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { conversationId: 1, id: { lt: 99 } } }),
    );
  });
});

describe('createMessage', () => {
  it('creates the message and bumps the conversation in one transaction', async () => {
    mockPrisma.$transaction.mockResolvedValue([{ id: 11 }, { id: 1 }]);
    const msg = await repo.createMessage(1, 7, 'hi');
    expect(msg).toEqual({ id: 11 });
    expect(mockPrisma.directMessage.create).toHaveBeenCalledWith({
      data: { conversationId: 1, senderId: 7, content: 'hi' },
    });
    expect(mockPrisma.conversation.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 } }),
    );
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });
});

describe('markRead', () => {
  it('marks the other side messages read up to the id and returns the count', async () => {
    mockPrisma.directMessage.updateMany.mockResolvedValue({ count: 4 });
    expect(await repo.markRead(1, 7, 50)).toBe(4);
    expect(mockPrisma.directMessage.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          conversationId: 1,
          senderId: { not: 7 },
          id: { lte: 50 },
          readAt: null,
        }),
      }),
    );
  });
});

describe('findMessage', () => {
  it('finds a message by id', async () => {
    mockPrisma.directMessage.findUnique.mockResolvedValue({ id: 3 });
    expect(await repo.findMessage(3)).toEqual({ id: 3 });
  });
});

describe('softDeleteMessage', () => {
  it('returns null when nothing was deleted (not sender / already deleted)', async () => {
    mockPrisma.directMessage.updateMany.mockResolvedValue({ count: 0 });
    expect(await repo.softDeleteMessage(3, 7)).toBeNull();
    expect(mockPrisma.directMessage.findUnique).not.toHaveBeenCalled();
  });

  it('blanks content and returns the row when deleted', async () => {
    mockPrisma.directMessage.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.directMessage.findUnique.mockResolvedValue({ id: 3, deleted: true, content: '' });
    const row = await repo.softDeleteMessage(3, 7);
    expect(row).toEqual({ id: 3, deleted: true, content: '' });
    expect(mockPrisma.directMessage.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 3, senderId: 7, deleted: false },
        data: { deleted: true, content: '' },
      }),
    );
  });
});
