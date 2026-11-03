import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  user: { findMany: vi.fn() },
  poll: { create: vi.fn(), findMany: vi.fn() },
  notification: { createManyAndReturn: vi.fn() },
  // A callback handed this same client as its transaction
  $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn(mockPrisma)),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./polls.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('createPoll', () => {
  it('keeps the poll with its options and how many got it, and a bell row per account but the author', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: 10 }, { id: 11 }]);
    mockPrisma.poll.create.mockResolvedValue({ id: 4 });
    mockPrisma.notification.createManyAndReturn.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const rows = await repo.createPoll(2, 'Next?', ['Rust', 'Go']);
    expect(rows).toEqual([{ id: 1 }, { id: 2 }]);
    expect(mockPrisma.$transaction).toHaveBeenCalledWith(expect.any(Function));
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { not: 2 } } }),
    );
    expect(mockPrisma.poll.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          authorId: 2,
          question: 'Next?',
          recipients: 2,
          options: { create: [{ text: 'Rust' }, { text: 'Go' }] },
        },
      }),
    );
    const row = { actorId: 2, type: 'POLL', entityId: 4, data: { text: 'Next?' } };
    expect(mockPrisma.notification.createManyAndReturn).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          { userId: 10, ...row },
          { userId: 11, ...row },
        ],
      }),
    );
  });
});

describe('listPolls', () => {
  it('lists the newest first with their author and options in order', async () => {
    mockPrisma.poll.findMany.mockResolvedValue([{ id: 2 }]);
    expect(await repo.listPolls(50)).toEqual([{ id: 2 }]);
    expect(mockPrisma.poll.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'desc' },
      take: 50,
      include: { author: { select: { name: true } }, options: { orderBy: { id: 'asc' } } },
    });
  });
});
