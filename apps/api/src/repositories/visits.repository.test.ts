import { describe, it, expect, vi, beforeEach } from 'vitest';

// The SQL itself is checked against a real database in
// test/integration/visits.test.ts; this only covers what goes in and out.
const mockPrisma = {
  pageVisit: { create: vi.fn(), deleteMany: vi.fn() },
  visitSalt: { upsert: vi.fn(), deleteMany: vi.fn() },
  guestVisit: { findFirst: vi.fn(), findMany: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
  visitStep: { count: vi.fn(), createMany: vi.fn() },
  $executeRaw: vi.fn(),
  $queryRaw: vi.fn(),
  $transaction: vi.fn(),
};
vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./visits.repository.js');

const day = new Date('2026-11-01T00:00:00Z');

beforeEach(() => vi.clearAllMocks());

describe('addVisit', () => {
  it('stores the row as given', async () => {
    const row = {
      day,
      visitor: 'a'.repeat(64),
      path: '/',
      source: null,
      signedIn: false,
      lang: 'en',
    };
    await repo.addVisit(row);
    expect(mockPrisma.pageVisit.create).toHaveBeenCalledWith({ data: row });
  });
});

describe('saltFor', () => {
  it('keeps the salt already made for the day', async () => {
    mockPrisma.visitSalt.upsert.mockResolvedValue({ day, salt: 'old' });
    expect(await repo.saltFor(day, 'new')).toBe('old');
    expect(mockPrisma.visitSalt.upsert).toHaveBeenCalledWith({
      where: { day },
      create: { day, salt: 'new' },
      update: {},
    });
  });
});

describe('rollUpBefore', () => {
  const keepFrom = new Date('2026-08-04T00:00:00Z');

  it('writes the totals and deletes the visits and salts in one transaction', async () => {
    mockPrisma.$executeRaw.mockReturnValue('insert');
    mockPrisma.pageVisit.deleteMany.mockReturnValue('visits');
    mockPrisma.visitSalt.deleteMany.mockReturnValue('salts');
    mockPrisma.guestVisit.updateMany.mockReturnValue('unhash');
    mockPrisma.guestVisit.deleteMany.mockReturnValue('expire');
    await repo.rollUpBefore(day, keepFrom);
    expect(mockPrisma.$transaction).toHaveBeenCalledWith([
      'insert',
      'visits',
      'salts',
      'unhash',
      'expire',
    ]);
    expect(mockPrisma.pageVisit.deleteMany).toHaveBeenCalledWith({ where: { day: { lt: day } } });
    expect(mockPrisma.visitSalt.deleteMany).toHaveBeenCalledWith({ where: { day: { lt: day } } });
  });

  it("takes the hash off the finished days' guest visits and deletes the expired ones", async () => {
    await repo.rollUpBefore(day, keepFrom);
    expect(mockPrisma.guestVisit.updateMany).toHaveBeenCalledWith({
      where: { day: { lt: day }, visitor: { not: null } },
      data: { visitor: null },
    });
    expect(mockPrisma.guestVisit.deleteMany).toHaveBeenCalledWith({
      where: { day: { lt: keepFrom } },
    });
  });
});

describe('guestVisitFor', () => {
  it('returns the id of the visit made or found', async () => {
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ id: 7 }]);
    expect(await repo.guestVisitFor(day, 'a'.repeat(64), 'reddit', 'en')).toBe(7);
  });
});

describe('guestVisitId', () => {
  it("finds today's visit for the hash, or null", async () => {
    mockPrisma.guestVisit.findFirst.mockResolvedValueOnce({ id: 3 });
    expect(await repo.guestVisitId(day, 'a'.repeat(64))).toBe(3);
    expect(mockPrisma.guestVisit.findFirst).toHaveBeenCalledWith({
      where: { day, visitor: 'a'.repeat(64) },
      select: { id: true },
    });
    mockPrisma.guestVisit.findFirst.mockResolvedValueOnce(null);
    expect(await repo.guestVisitId(day, 'b'.repeat(64))).toBeNull();
  });
});

describe('countSteps and addSteps', () => {
  it("count and store a visit's steps", async () => {
    mockPrisma.visitStep.count.mockResolvedValue(4);
    expect(await repo.countSteps(3)).toBe(4);
    await repo.addSteps(3, [{ kind: 'click', target: 'run' }]);
    expect(mockPrisma.visitStep.createMany).toHaveBeenCalledWith({
      data: [{ visitId: 3, kind: 'click', target: 'run' }],
    });
  });
});

describe('guestVisitsSince', () => {
  it('filters by source and by where the page starts only when asked', async () => {
    mockPrisma.guestVisit.findMany.mockResolvedValue([]);
    await repo.guestVisitsSince(day, { take: 21 });
    expect(mockPrisma.guestVisit.findMany.mock.calls[0][0]).toMatchObject({
      where: { day: { gte: day } },
      orderBy: { id: 'desc' },
      take: 21,
    });
    await repo.guestVisitsSince(day, { source: 'reddit', before: 40, take: 21 });
    expect(mockPrisma.guestVisit.findMany.mock.calls[1][0].where).toEqual({
      day: { gte: day },
      source: 'reddit',
      id: { lt: 40 },
    });
  });
});

describe('totalsSince, newAccountsSince and topClicksSince', () => {
  it('return the rows the database gives back', async () => {
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ dimension: 'all' }]);
    expect(await repo.totalsSince(day)).toEqual([{ dimension: 'all' }]);
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ day, count: 2 }]);
    expect(await repo.newAccountsSince(day)).toEqual([{ day, count: 2 }]);
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ key: 'run', visitors: 1, views: 3 }]);
    expect(await repo.topClicksSince(day, 10)).toEqual([{ key: 'run', visitors: 1, views: 3 }]);
  });
});
