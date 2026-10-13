import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  $queryRaw: vi.fn(),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./leaderboard.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('getRanked', () => {
  it('runs the ranked aggregate query and returns its rows', async () => {
    const rows = [
      { id: 1, name: 'A', avatar_url: null, total_xp: 100, lessons_done: 5, rank: 1 },
      { id: 2, name: 'B', avatar_url: null, total_xp: 50, lessons_done: 3, rank: 2 },
    ];
    mockPrisma.$queryRaw.mockResolvedValue(rows);
    expect(await repo.getRanked()).toEqual(rows);
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
  });
});
