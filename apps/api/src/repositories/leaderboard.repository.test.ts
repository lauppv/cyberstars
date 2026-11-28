import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  $queryRaw: vi.fn(),
  lesson: { findMany: vi.fn() },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));
// The curriculum has 2 python lessons, whatever rows the table keeps
vi.mock('./curriculum.repository.js', () => ({
  courseLessonCount: (courseKey: string) => (courseKey === 'python' ? 2 : 1),
}));
// No web course exists yet, so web-js plays a closed one and web-css an open one
vi.mock('@cyberstars/shared/constants', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@cyberstars/shared/constants')>()),
  WEB_COURSE_KEYS: ['web-js', 'web-css'],
  isClosedCourse: (courseKey: string) => courseKey === 'web-js',
}));

const repo = await import('./leaderboard.repository.js');

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma.lesson.findMany.mockResolvedValue([]);
});

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

  it('leaves our test accounts out', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([]);
    await repo.getRanked();
    const query = mockPrisma.$queryRaw.mock.calls[0][0];
    expect(query.sql).toContain('NOT (u.email LIKE ANY(');
    expect(query.values).toContainEqual(['%@fake.com', '%.fake.com', '%@bots.cyberstars.app']);
  });

  it("reads each lesson's XP from the shared formula", async () => {
    mockPrisma.lesson.findMany.mockResolvedValue([
      { courseKey: 'python', slug: 'print', sortOrder: 1, title: 'Print' },
      { courseKey: 'python', slug: 'files', sortOrder: 2, title: 'Files' },
      { courseKey: 'python', slug: 'gone', sortOrder: 3, title: 'Taken out' },
      { courseKey: 'algo-python', slug: 'anagrams', sortOrder: 1, title: 'Hard · Anagrams' },
    ]);
    mockPrisma.$queryRaw.mockResolvedValue([]);
    await repo.getRanked();
    const query = mockPrisma.$queryRaw.mock.calls[0][0];
    expect(query.sql).toContain('AS l(course_key, slug, xp)');
    // Each row is (course_key, slug, xp), so a lesson's XP follows its slug
    const values: unknown[] = query.values;
    const xpOf = (slug: string) => values[values.indexOf(slug) + 1];
    expect(xpOf('print')).toBe(10);
    expect(xpOf('files')).toBe(30);
    expect(xpOf('anagrams')).toBe(100);
  });
});
