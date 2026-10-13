import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  connection: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deleteMany: vi.fn(),
    findMany: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./connections.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('findBetween', () => {
  it('looks for a row in either direction', async () => {
    mockPrisma.connection.findFirst.mockResolvedValue({ id: 1 });
    const row = await repo.findBetween(5, 2);
    expect(row).toEqual({ id: 1 });
    expect(mockPrisma.connection.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { requesterId: 5, addresseeId: 2 },
            { requesterId: 2, addresseeId: 5 },
          ],
        },
      }),
    );
  });
});

describe('findById', () => {
  it('fetches a single row by id with participants', async () => {
    mockPrisma.connection.findUnique.mockResolvedValue({ id: 50 });
    const row = await repo.findById(50);
    expect(row).toEqual({ id: 50 });
    expect(mockPrisma.connection.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 50 } }),
    );
  });
});

describe('create', () => {
  it('creates a pending request between two users', async () => {
    mockPrisma.connection.create.mockResolvedValue({ id: 9 });
    const row = await repo.create(1, 2);
    expect(row).toEqual({ id: 9 });
    expect(mockPrisma.connection.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { requesterId: 1, addresseeId: 2 } }),
    );
  });
});

describe('accept', () => {
  it('flips the row to ACCEPTED and stamps respondedAt', async () => {
    mockPrisma.connection.update.mockResolvedValue({ id: 50, status: 'ACCEPTED' });
    const row = await repo.accept(50);
    expect(row).toEqual({ id: 50, status: 'ACCEPTED' });
    const arg = mockPrisma.connection.update.mock.calls[0][0];
    expect(arg.where).toEqual({ id: 50 });
    expect(arg.data.status).toBe('ACCEPTED');
    expect(arg.data.respondedAt).toBeInstanceOf(Date);
  });
});

describe('remove', () => {
  it('deletes the row by id', async () => {
    mockPrisma.connection.deleteMany.mockResolvedValue({ count: 1 });
    await repo.remove(50);
    expect(mockPrisma.connection.deleteMany).toHaveBeenCalledWith({ where: { id: 50 } });
  });
});

describe('listAccepted', () => {
  it('lists accepted rows in either direction, newest first', async () => {
    mockPrisma.connection.findMany.mockResolvedValue([{ id: 1 }]);
    const rows = await repo.listAccepted(7);
    expect(rows).toEqual([{ id: 1 }]);
    expect(mockPrisma.connection.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'ACCEPTED',
          OR: [{ requesterId: 7 }, { addresseeId: 7 }],
        },
        orderBy: { respondedAt: 'desc' },
      }),
    );
  });
});

describe('listIncoming', () => {
  it('lists pending requests addressed to the user', async () => {
    mockPrisma.connection.findMany.mockResolvedValue([]);
    await repo.listIncoming(7);
    expect(mockPrisma.connection.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { addresseeId: 7, status: 'PENDING' } }),
    );
  });
});

describe('listOutgoing', () => {
  it('lists pending requests the user sent', async () => {
    mockPrisma.connection.findMany.mockResolvedValue([]);
    await repo.listOutgoing(7);
    expect(mockPrisma.connection.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { requesterId: 7, status: 'PENDING' } }),
    );
  });
});
