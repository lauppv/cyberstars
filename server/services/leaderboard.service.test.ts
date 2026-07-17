import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.JWT_SECRET = 'test-secret';
process.env.DB_USER = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test';
process.env.DB_PASSWORD = 'test';
process.env.LEADERBOARD_CACHE_MS = '60000';

const mockRepo = {
  getRanked: vi.fn(),
};

vi.mock('../repositories/leaderboard.repository.js', () => mockRepo);

const { getPage, getMyRank, clearCache } = await import('./leaderboard.service.js');

// Three users, one tie: RANK() with gaps means the two 200-XP users share rank
// 1 and the next is rank 3 (§7.4). 220 XP → level 2 (levelFromXp).
const rows = [
  { id: 1, name: 'Ada', avatar_url: '/a.png', total_xp: 220, lessons_done: 12, rank: 1 },
  { id: 2, name: 'Bo', avatar_url: null, total_xp: 220, lessons_done: 12, rank: 1 },
  { id: 3, name: 'Cy', avatar_url: null, total_xp: 50, lessons_done: 5, rank: 3 },
];

beforeEach(() => {
  vi.clearAllMocks();
  clearCache();
  mockRepo.getRanked.mockResolvedValue(rows);
});

describe('leaderboard.service getPage', () => {
  it('shapes rows into DTO entries with derived level + title', async () => {
    const { entries, total } = await getPage(50, 0);
    expect(total).toBe(3);
    expect(entries[0]).toEqual({
      rank: 1,
      userId: 1,
      name: 'Ada',
      avatarUrl: '/a.png',
      totalXp: 220,
      lessonsDone: 12,
      level: 2,
      titleKey: 'level.title.2',
    });
    expect(entries[2].level).toBe(1);
    expect(entries[2].titleKey).toBe('level.title.1');
  });

  it('paginates via take/skip against the ranked list', async () => {
    const page = await getPage(1, 1);
    expect(page.entries).toHaveLength(1);
    expect(page.entries[0].userId).toBe(2);
    expect(page.total).toBe(3);
  });

  it('serves from cache within TTL (single query)', async () => {
    await getPage(50, 0);
    await getPage(10, 0);
    expect(mockRepo.getRanked).toHaveBeenCalledTimes(1);
  });

  it('bypasses the cache when force=true', async () => {
    await getPage(50, 0);
    await getPage(50, 0, true);
    expect(mockRepo.getRanked).toHaveBeenCalledTimes(2);
  });
});

describe('leaderboard.service getMyRank', () => {
  it('returns the requesting user derived from the same cache', async () => {
    await getPage(50, 0); // warm cache
    const me = await getMyRank(3);
    expect(mockRepo.getRanked).toHaveBeenCalledTimes(1);
    expect(me?.rank).toBe(3);
    expect(me?.name).toBe('Cy');
  });

  it('returns null for a user not in the ranking', async () => {
    const me = await getMyRank(999);
    expect(me).toBeNull();
  });
});
