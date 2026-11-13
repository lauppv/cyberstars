import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  session: {
    create: vi.fn(),
    findUnique: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./session.repository.js');

const CREATED = new Date('2026-11-13T10:00:00Z');

beforeEach(() => vi.clearAllMocks());

describe('create', () => {
  it('keeps the session, last seen when it was made', async () => {
    await repo.create({ id: 'abc', userId: 4, secretHash: 'f00', createdAt: CREATED });
    expect(mockPrisma.session.create).toHaveBeenCalledWith({
      data: { id: 'abc', userId: 4, secretHash: 'f00', createdAt: CREATED, lastSeenAt: CREATED },
    });
  });
});

describe('find', () => {
  it("reads the session with the account's role in one query", async () => {
    mockPrisma.session.findUnique.mockResolvedValue({
      userId: 4,
      secretHash: 'f00',
      createdAt: CREATED,
      lastSeenAt: CREATED,
      user: { role: 'ADMIN' },
    });
    expect(await repo.find('abc')).toEqual({
      userId: 4,
      secretHash: 'f00',
      createdAt: CREATED,
      lastSeenAt: CREATED,
      role: 'ADMIN',
    });
    expect(mockPrisma.session.findUnique).toHaveBeenCalledWith({
      where: { id: 'abc' },
      select: {
        userId: true,
        secretHash: true,
        createdAt: true,
        lastSeenAt: true,
        user: { select: { role: true } },
      },
    });
  });

  it('returns null for a session that is gone', async () => {
    mockPrisma.session.findUnique.mockResolvedValue(null);
    expect(await repo.find('abc')).toBeNull();
  });
});

describe('touch', () => {
  it('moves the time last seen, with no error for a session ended meanwhile', async () => {
    const seen = new Date('2026-11-13T11:00:00Z');
    await repo.touch('abc', seen);
    expect(mockPrisma.session.updateMany).toHaveBeenCalledWith({
      where: { id: 'abc' },
      data: { lastSeenAt: seen },
    });
  });
});

describe('remove and removeForUser', () => {
  it("ends one session, or every one of the account's", async () => {
    await repo.remove('abc');
    expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({ where: { id: 'abc' } });
    await repo.removeForUser(4);
    expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({ where: { userId: 4 } });
  });
});

describe('removeExpired', () => {
  it('ends the sessions unused since, or made before, the dates given', async () => {
    mockPrisma.session.deleteMany.mockResolvedValue({ count: 5 });
    const lastSeenBefore = new Date('2026-10-14T10:00:00Z');
    const createdBefore = new Date('2026-08-15T10:00:00Z');
    expect(await repo.removeExpired(lastSeenBefore, createdBefore)).toBe(5);
    expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
      where: {
        OR: [{ lastSeenAt: { lt: lastSeenBefore } }, { createdAt: { lt: createdBefore } }],
      },
    });
  });
});
