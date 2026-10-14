import { describe, it, expect, vi, beforeEach } from 'vitest';

// The SQL itself is checked against a real database in
// test/integration/visits.test.ts; this only covers what goes in and out.
const mockPrisma = {
  pageVisit: { create: vi.fn(), deleteMany: vi.fn() },
  visitSalt: { upsert: vi.fn(), deleteMany: vi.fn() },
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
  it('writes the totals and deletes the visits and salts in one transaction', async () => {
    mockPrisma.$executeRaw.mockReturnValue('insert');
    mockPrisma.pageVisit.deleteMany.mockReturnValue('visits');
    mockPrisma.visitSalt.deleteMany.mockReturnValue('salts');
    await repo.rollUpBefore(day);
    expect(mockPrisma.$transaction).toHaveBeenCalledWith(['insert', 'visits', 'salts']);
    expect(mockPrisma.pageVisit.deleteMany).toHaveBeenCalledWith({ where: { day: { lt: day } } });
    expect(mockPrisma.visitSalt.deleteMany).toHaveBeenCalledWith({ where: { day: { lt: day } } });
  });
});

describe('totalsSince and newAccountsSince', () => {
  it('return the rows the database gives back', async () => {
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ dimension: 'all' }]);
    expect(await repo.totalsSince(day)).toEqual([{ dimension: 'all' }]);
    mockPrisma.$queryRaw.mockResolvedValueOnce([{ day, count: 2 }]);
    expect(await repo.newAccountsSince(day)).toEqual([{ day, count: 2 }]);
  });
});
