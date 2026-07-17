import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  notification: {
    findMany: vi.fn(),
    count: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./notifications.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('list', () => {
  it('lists newest-first without a cursor', async () => {
    mockPrisma.notification.findMany.mockResolvedValue([{ id: 3 }]);
    const rows = await repo.list(10, 20);
    expect(rows).toEqual([{ id: 3 }]);
    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 10 }, orderBy: { id: 'desc' }, take: 20 }),
    );
  });

  it('applies the before cursor when provided', async () => {
    mockPrisma.notification.findMany.mockResolvedValue([]);
    await repo.list(10, 20, 50);
    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 10, id: { lt: 50 } } }),
    );
  });
});

describe('countUnread', () => {
  it('counts unread rows for the user', async () => {
    mockPrisma.notification.count.mockResolvedValue(4);
    expect(await repo.countUnread(10)).toBe(4);
    expect(mockPrisma.notification.count).toHaveBeenCalledWith({
      where: { userId: 10, readAt: null },
    });
  });
});

describe('findUnreadFor', () => {
  it('finds an unread row for the same type + entity', async () => {
    mockPrisma.notification.findFirst.mockResolvedValue({ id: 7 });
    const row = await repo.findUnreadFor(10, 'FORUM_REPLY', 5);
    expect(row).toEqual({ id: 7 });
    expect(mockPrisma.notification.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 10, type: 'FORUM_REPLY', entityId: 5, readAt: null },
      }),
    );
  });
});

describe('create', () => {
  it('creates with data', async () => {
    mockPrisma.notification.create.mockResolvedValue({ id: 1 });
    await repo.create({
      userId: 10,
      actorId: 2,
      type: 'FORUM_REPLY',
      entityId: 5,
      data: { title: 'T' },
    });
    expect(mockPrisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: 10, data: { title: 'T' } }),
      }),
    );
  });

  it('stores JsonNull when no data is given', async () => {
    mockPrisma.notification.create.mockResolvedValue({ id: 1 });
    await repo.create({ userId: 10, actorId: null, type: 'SUPPORT_STATUS', entityId: 5 });
    const arg = mockPrisma.notification.create.mock.calls[0][0];
    expect(arg.data.data).not.toEqual({ title: 'T' });
  });
});

describe('collapse', () => {
  it('bumps actor, data, and createdAt', async () => {
    mockPrisma.notification.update.mockResolvedValue({ id: 9 });
    await repo.collapse(9, 3, { title: 'T', count: 2 });
    const arg = mockPrisma.notification.update.mock.calls[0][0];
    expect(arg.where).toEqual({ id: 9 });
    expect(arg.data.actorId).toBe(3);
    expect(arg.data.data).toEqual({ title: 'T', count: 2 });
    expect(arg.data.createdAt).toBeInstanceOf(Date);
  });
});

describe('markReadUpTo', () => {
  it('marks unread rows up to the id read and returns the count', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 });
    expect(await repo.markReadUpTo(10, 99)).toBe(3);
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 10, id: { lte: 99 }, readAt: null } }),
    );
  });
});

describe('markOneRead', () => {
  it('scopes the update by user id', async () => {
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 });
    await repo.markOneRead(10, 7);
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 7, userId: 10, readAt: null } }),
    );
  });
});

describe('pruneOverCap', () => {
  it('deletes rows at or below the boundary when over the cap', async () => {
    mockPrisma.notification.findMany.mockResolvedValue([{ id: 40 }]);
    mockPrisma.notification.deleteMany.mockResolvedValue({ count: 5 });
    await repo.pruneOverCap(10, 100);
    expect(mockPrisma.notification.deleteMany).toHaveBeenCalledWith({
      where: { userId: 10, id: { lte: 40 } },
    });
  });

  it('is a no-op when under the cap', async () => {
    mockPrisma.notification.findMany.mockResolvedValue([]);
    await repo.pruneOverCap(10, 100);
    expect(mockPrisma.notification.deleteMany).not.toHaveBeenCalled();
  });
});
