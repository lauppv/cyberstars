import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUserRepo = { findById: vi.fn() };
const mockProgressRepo = {
  getCompletedByCourse: vi.fn(),
  getActivityDates: vi.fn(),
};

// Fabricate `n` completed lesson slugs for a course, matching the repo shape.
function slugs(courseKey: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => `${courseKey}-${i + 1}`);
}
const mockLeaderboardService = { getMyRank: vi.fn() };
const mockActivityService = { computeStreak: vi.fn() };

vi.mock('../repositories/user.repository.js', () => mockUserRepo);
vi.mock('../repositories/progress.repository.js', () => mockProgressRepo);
vi.mock('./leaderboard.service.js', () => mockLeaderboardService);
vi.mock('./activity.service.js', () => mockActivityService);

const { getPublicProfile } = await import('./public-profile.service.js');

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 7,
    name: 'Nova',
    avatarUrl: '/uploads/avatars/nova.png',
    bio: 'Exploring the cosmos',
    status: 'coding',
    statusExpiresAt: new Date('2999-01-01T00:00:00Z'),
    createdAt: new Date('2025-01-01T00:00:00Z'),
    showBio: true,
    showStats: true,
    showProgress: true,
    showActivity: true,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockProgressRepo.getCompletedByCourse.mockResolvedValue([]);
  mockProgressRepo.getActivityDates.mockResolvedValue([]);
  mockLeaderboardService.getMyRank.mockResolvedValue(null);
  mockActivityService.computeStreak.mockReturnValue(0);
});

describe('getPublicProfile', () => {
  it('throws 404 when the user does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);
    await expect(getPublicProfile(99, null)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('always exposes name, avatar and member-since', async () => {
    mockUserRepo.findById.mockResolvedValue(makeUser());
    const p = await getPublicProfile(7, null);
    expect(p.userId).toBe(7);
    expect(p.name).toBe('Nova');
    expect(p.avatarUrl).toBe('/uploads/avatars/nova.png');
    expect(p.memberSince).toBe('2025-01-01T00:00:00.000Z');
  });

  it('hides every optional section for another viewer when all flags are off', async () => {
    mockUserRepo.findById.mockResolvedValue(
      makeUser({ showBio: false, showStats: false, showProgress: false, showActivity: false }),
    );
    const p = await getPublicProfile(7, 42);
    expect(p.isSelf).toBe(false);
    expect(p.bio).toBeNull();
    expect(p.status).toBeNull();
    expect(p.stats).toBeNull();
    expect(p.progress).toBeNull();
    expect(p.activity).toBeNull();
    // Nothing beyond the base lookup should be fetched.
    expect(mockLeaderboardService.getMyRank).not.toHaveBeenCalled();
    expect(mockProgressRepo.getCompletedByCourse).not.toHaveBeenCalled();
    expect(mockProgressRepo.getActivityDates).not.toHaveBeenCalled();
  });

  it('shows everything to the owner even with all flags off', async () => {
    mockUserRepo.findById.mockResolvedValue(
      makeUser({ showBio: false, showStats: false, showProgress: false }),
    );
    const p = await getPublicProfile(7, 7);
    expect(p.isSelf).toBe(true);
    expect(p.bio).toBe('Exploring the cosmos');
    expect(p.status).toBe('coding');
    expect(p.stats).not.toBeNull();
    expect(p.progress).not.toBeNull();
  });

  it('reveals bio and status to others when showBio is on', async () => {
    mockUserRepo.findById.mockResolvedValue(makeUser({ showStats: false, showProgress: false }));
    const p = await getPublicProfile(7, 42);
    expect(p.bio).toBe('Exploring the cosmos');
    expect(p.status).toBe('coding');
  });

  it('nulls an expired status', async () => {
    mockUserRepo.findById.mockResolvedValue(
      makeUser({ statusExpiresAt: new Date('2000-01-01T00:00:00Z') }),
    );
    const p = await getPublicProfile(7, 7);
    expect(p.status).toBeNull();
    // Bio is unaffected by status expiry.
    expect(p.bio).toBe('Exploring the cosmos');
  });

  it('derives lessonsDone and activeCourses from live counts, not the cached rank', async () => {
    mockUserRepo.findById.mockResolvedValue(makeUser({ showProgress: false }));
    mockProgressRepo.getCompletedByCourse.mockResolvedValue([
      { courseKey: 'python', slugs: slugs('python', 12) },
      { courseKey: 'linux', slugs: slugs('linux', 3) },
      { courseKey: 'algo-c', slugs: slugs('algo-c', 5) }, // not a MAIN/TERMINAL course
    ]);
    // Stale leaderboard lessonsDone must be ignored in favour of the counts sum.
    mockLeaderboardService.getMyRank.mockResolvedValue({
      rank: 5,
      totalXp: 150,
      lessonsDone: 999,
      level: 2,
      titleKey: 'level.title.2',
    });
    mockActivityService.computeStreak.mockReturnValue(4);

    const p = await getPublicProfile(7, 42);
    expect(p.stats).toEqual({
      lessonsDone: 20,
      activeCourses: 2,
      streak: 4,
      // Sorted most-completed first, each carrying its completed slug list.
      courses: [
        { courseKey: 'python', lessons: slugs('python', 12) },
        { courseKey: 'algo-c', lessons: slugs('algo-c', 5) },
        { courseKey: 'linux', lessons: slugs('linux', 3) },
      ],
    });
  });

  it('builds the progress section from the leaderboard rank', async () => {
    mockUserRepo.findById.mockResolvedValue(makeUser({ showStats: false }));
    mockProgressRepo.getCompletedByCourse.mockResolvedValue([
      { courseKey: 'python', slugs: slugs('python', 12) },
      { courseKey: 'algo-c', slugs: slugs('algo-c', 3) },
    ]);
    mockLeaderboardService.getMyRank.mockResolvedValue({
      rank: 5,
      totalXp: 150,
      lessonsDone: 15,
      level: 2,
      titleKey: 'level.title.2',
    });

    const p = await getPublicProfile(7, 42);
    // python: First Steps + 1 tier = 2; algo-c: First Steps only = 1 → 3 badges.
    expect(p.progress).toEqual({
      level: 2,
      totalXp: 150,
      titleKey: 'level.title.2',
      rank: 5,
      badges: 3,
      badgeList: [
        { courseKey: 'python', level: 0 },
        { courseKey: 'python', level: 1 },
        { courseKey: 'algo-c', level: 0 },
      ],
    });
  });

  it('returns recent completed-lesson timestamps for the heatmap, filtered to the window', async () => {
    // Only showActivity is on; stats/progress stay hidden and their queries skip.
    mockUserRepo.findById.mockResolvedValue(makeUser({ showStats: false, showProgress: false }));
    const recent = new Date();
    const old = new Date(Date.now() - 200 * 86_400_000); // outside the ~150-day window
    mockProgressRepo.getActivityDates.mockResolvedValue([
      { completedAt: recent, lastAccessedAt: recent },
      { completedAt: old, lastAccessedAt: old },
      { completedAt: null, lastAccessedAt: recent }, // accessed but never completed
    ]);

    const p = await getPublicProfile(7, 42);
    expect(p.activity).toEqual([recent.toISOString()]);
    expect(p.stats).toBeNull();
    expect(p.progress).toBeNull();
    expect(mockProgressRepo.getCompletedByCourse).not.toHaveBeenCalled();
  });

  it('hides the heatmap when showActivity is off', async () => {
    mockUserRepo.findById.mockResolvedValue(makeUser({ showActivity: false }));
    const p = await getPublicProfile(7, 42);
    expect(p.activity).toBeNull();
  });

  it('reports rank as null and falls back to computed level for an unranked user', async () => {
    mockUserRepo.findById.mockResolvedValue(makeUser({ showStats: false }));
    mockProgressRepo.getCompletedByCourse.mockResolvedValue([]);
    mockLeaderboardService.getMyRank.mockResolvedValue(null);

    const p = await getPublicProfile(7, 42);
    expect(p.progress?.rank).toBeNull();
    expect(p.progress?.totalXp).toBe(0);
    expect(p.progress?.level).toBe(1); // levelFromXp(0)
    expect(p.progress?.badges).toBe(0);
  });
});
