import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  user: { findMany: vi.fn(), findUnique: vi.fn() },
  poll: { create: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  pollOption: { updateMany: vi.fn() },
  pollVoter: { createMany: vi.fn() },
  pollAnswer: { create: vi.fn() },
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
    const rows = await repo.createPoll(2, 'Next?', ['Rust', 'Go'], false);
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

  it('puts Other after the options when asked for', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: 10 }]);
    mockPrisma.poll.create.mockResolvedValue({ id: 4 });
    mockPrisma.notification.createManyAndReturn.mockResolvedValue([{ id: 1 }]);
    await repo.createPoll(2, 'Next?', ['Rust', 'Go'], true);
    expect(mockPrisma.poll.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          options: {
            create: [{ text: 'Rust' }, { text: 'Go' }, { text: 'Other', writeIn: true }],
          },
        }),
      }),
    );
  });
});

describe('findPoll', () => {
  it('reads the options in order without their counts, and only this user as a voter', async () => {
    mockPrisma.poll.findUnique.mockResolvedValue({ id: 4 });
    expect(await repo.findPoll(4, 10)).toEqual({ id: 4 });
    expect(mockPrisma.poll.findUnique).toHaveBeenCalledWith({
      where: { id: 4 },
      include: {
        options: { orderBy: { id: 'asc' }, select: { id: true, text: true, writeIn: true } },
        voted: { where: { userId: 10 }, select: { userId: true } },
      },
    });
  });
});

describe('joinedAt', () => {
  it("reads when the account was made, null once it's gone", async () => {
    const at = new Date('2026-11-01T10:00:00.000Z');
    mockPrisma.user.findUnique.mockResolvedValue({ createdAt: at });
    expect(await repo.joinedAt(10)).toBe(at);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 10 },
      select: { createdAt: true },
    });
    mockPrisma.user.findUnique.mockResolvedValue(null);
    expect(await repo.joinedAt(10)).toBeNull();
  });
});

describe('vote', () => {
  it('marks the voter and counts each option picked once more, with nothing tying the two', async () => {
    mockPrisma.pollVoter.createMany.mockResolvedValue({ count: 1 });
    expect(await repo.vote(4, 10, [7, 9])).toBe(true);
    expect(mockPrisma.pollVoter.createMany).toHaveBeenCalledWith({
      data: [{ pollId: 4, userId: 10 }],
      skipDuplicates: true,
    });
    expect(mockPrisma.pollOption.updateMany).toHaveBeenCalledWith({
      where: { pollId: 4, id: { in: [7, 9] } },
      data: { votes: { increment: 1 } },
    });
    expect(mockPrisma.poll.update).toHaveBeenCalledWith({
      where: { id: 4 },
      data: { voters: { increment: 1 } },
    });
  });

  it('keeps what was written under Other on its own, and nothing without it', async () => {
    mockPrisma.pollVoter.createMany.mockResolvedValue({ count: 1 });
    expect(await repo.vote(4, 10, [9], 'More C')).toBe(true);
    expect(mockPrisma.pollAnswer.create).toHaveBeenCalledWith({
      data: { pollId: 4, text: 'More C' },
    });
    mockPrisma.pollAnswer.create.mockClear();
    await repo.vote(4, 11, [7]);
    expect(mockPrisma.pollAnswer.create).not.toHaveBeenCalled();
  });

  it('counts nothing when the user had voted already', async () => {
    mockPrisma.pollVoter.createMany.mockResolvedValue({ count: 0 });
    expect(await repo.vote(4, 10, [9], 'More C')).toBe(false);
    expect(mockPrisma.pollOption.updateMany).not.toHaveBeenCalled();
    expect(mockPrisma.poll.update).not.toHaveBeenCalled();
    expect(mockPrisma.pollAnswer.create).not.toHaveBeenCalled();
  });
});

describe('listPolls', () => {
  it('lists the newest first with their author, options in order and answers newest first', async () => {
    mockPrisma.poll.findMany.mockResolvedValue([{ id: 2 }]);
    expect(await repo.listPolls(50)).toEqual([{ id: 2 }]);
    expect(mockPrisma.poll.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'desc' },
      take: 50,
      include: {
        author: { select: { name: true } },
        options: { orderBy: { id: 'asc' } },
        answers: { orderBy: { id: 'desc' }, select: { text: true } },
      },
    });
  });
});
