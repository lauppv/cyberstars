import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  dailyPick: {
    findUnique: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
    findMany: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./daily.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('getPick', () => {
  it('looks up the pick by the composite key', async () => {
    mockPrisma.dailyPick.findUnique.mockResolvedValue({ id: 1 });
    expect(await repo.getPick(7, '2026-07-17', 'lesson')).toEqual({ id: 1 });
    expect(mockPrisma.dailyPick.findUnique).toHaveBeenCalledWith({
      where: { userId_date_kind: { userId: 7, date: '2026-07-17', kind: 'lesson' } },
    });
  });
});

describe('createPick', () => {
  it('creates a pick with all fields', async () => {
    mockPrisma.dailyPick.create.mockResolvedValue({ id: 2 });
    await repo.createPick(7, '2026-07-17', 'lesson', 'python', 'vars', 'Variables');
    expect(mockPrisma.dailyPick.create).toHaveBeenCalledWith({
      data: {
        userId: 7,
        date: '2026-07-17',
        kind: 'lesson',
        courseKey: 'python',
        lessonSlug: 'vars',
        title: 'Variables',
      },
    });
  });
});

describe('awardBonusIfPicked', () => {
  it('returns true when a pick was newly rewarded', async () => {
    mockPrisma.dailyPick.updateMany.mockResolvedValue({ count: 1 });
    expect(await repo.awardBonusIfPicked(7, '2026-07-17', 'python', 'vars')).toBe(true);
    expect(mockPrisma.dailyPick.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 7,
          date: '2026-07-17',
          courseKey: 'python',
          lessonSlug: 'vars',
          bonusAwarded: false,
        },
        data: { bonusAwarded: true },
      }),
    );
  });

  it('returns false when nothing matched', async () => {
    mockPrisma.dailyPick.updateMany.mockResolvedValue({ count: 0 });
    expect(await repo.awardBonusIfPicked(7, '2026-07-17', 'python', 'vars')).toBe(false);
  });
});

describe('getAwardedSlugs', () => {
  it('maps rows to slugs', async () => {
    mockPrisma.dailyPick.findMany.mockResolvedValue([{ lessonSlug: 'a' }, { lessonSlug: 'b' }]);
    expect(await repo.getAwardedSlugs(7, 'python')).toEqual(['a', 'b']);
    expect(mockPrisma.dailyPick.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 7, courseKey: 'python', bonusAwarded: true } }),
    );
  });
});
