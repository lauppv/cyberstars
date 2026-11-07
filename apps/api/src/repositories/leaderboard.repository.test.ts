import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  $queryRaw: vi.fn(),
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));
// No web course exists yet, so web-js plays a closed one and web-css an open one
vi.mock('@cyberstars/shared/constants', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@cyberstars/shared/constants')>()),
  WEB_COURSE_KEYS: ['web-js', 'web-css'],
  isClosedCourse: (courseKey: string) => courseKey === 'web-js',
}));

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

  it('counts no lesson of a closed course', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([]);
    await repo.getRanked();
    const query = mockPrisma.$queryRaw.mock.calls[0][0];
    expect(query.sql).toContain('p.course_key <> ALL(');
    expect(query.values).toContainEqual(['web-js']);
  });
});
