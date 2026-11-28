import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  user: { count: vi.fn() },
  userLessonProgress: {
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  tutorPrompt: { count: vi.fn() },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./admin.repository.js');
const { PEOPLE } = await import('./user.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('userStats', () => {
  it('counts students only: in all and made in the last 7 and 30 days, and the accounts per role', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-15T12:00:00Z') });
    mockPrisma.user.count
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(3) // newLast7Days
      .mockResolvedValueOnce(6) // newLast30Days
      .mockResolvedValueOnce(1) // founders
      .mockResolvedValueOnce(2) // admins
      .mockResolvedValueOnce(4); // bots

    const result = await repo.userStats();
    vi.useRealTimers();

    expect(result).toEqual({
      total: 10,
      byRole: { FOUNDER: 1, ADMIN: 2, USER: 10, BOT: 4 },
      newLast7Days: 3,
      newLast30Days: 6,
    });
    expect(mockPrisma.user.count.mock.calls).toEqual([
      [{ where: PEOPLE }],
      [{ where: { ...PEOPLE, createdAt: { gte: new Date('2026-11-08T12:00:00Z') } } }],
      [{ where: { ...PEOPLE, createdAt: { gte: new Date('2026-10-16T12:00:00Z') } } }],
      [{ where: { role: 'FOUNDER' } }],
      [{ where: { role: 'ADMIN' } }],
      [
        {
          where: {
            role: 'USER',
            OR: [
              { email: { endsWith: '@fake.com' } },
              { email: { endsWith: '.fake.com' } },
              { email: { endsWith: '@bots.cyberstars.app' } },
            ],
          },
        },
      ],
    ]);
  });

  it('leaves out moderators, admins, the founder and the test accounts', () => {
    expect(PEOPLE).toEqual({
      role: 'USER',
      NOT: {
        OR: [
          { email: { endsWith: '@fake.com' } },
          { email: { endsWith: '.fake.com' } },
          { email: { endsWith: '@bots.cyberstars.app' } },
        ],
      },
    });
  });
});

describe('progressStats', () => {
  it('derives per-course completions and distinct learners', async () => {
    mockPrisma.userLessonProgress.count.mockResolvedValueOnce(5); // totalCompletions
    mockPrisma.userLessonProgress.groupBy
      .mockResolvedValueOnce([
        // courseUserGroups: one row per (course, user)
        { courseKey: 'python', userId: 1 },
        { courseKey: 'python', userId: 2 },
        { courseKey: 'c', userId: 1 },
      ])
      .mockResolvedValueOnce([
        // lessonGroups: top lessons
        { courseKey: 'python', lessonSlug: 'intro', _count: { _all: 4 } },
      ])
      .mockResolvedValueOnce([
        // completionCounts: per course
        { courseKey: 'python', _count: { _all: 4 } },
        { courseKey: 'c', _count: { _all: 1 } },
      ]);

    const result = await repo.progressStats();

    expect(result.totalCompletions).toBe(5);
    expect(result.byCourse).toEqual([
      { courseKey: 'python', completions: 4, learners: 2 },
      { courseKey: 'c', completions: 1, learners: 1 },
    ]);
    expect(result.topLessons).toEqual([
      { courseKey: 'python', lessonSlug: 'intro', completions: 4 },
    ]);
  });

  it("counts students' completions only", async () => {
    mockPrisma.userLessonProgress.count.mockResolvedValueOnce(0);
    mockPrisma.userLessonProgress.groupBy.mockResolvedValue([]);

    await repo.progressStats();

    const where = { completed: true, user: PEOPLE };
    expect(mockPrisma.userLessonProgress.count).toHaveBeenCalledWith({ where });
    for (const [arg] of mockPrisma.userLessonProgress.groupBy.mock.calls) {
      expect(arg.where).toEqual(where);
    }
  });

  it('sorts courses by completions descending', async () => {
    mockPrisma.userLessonProgress.count.mockResolvedValueOnce(0);
    mockPrisma.userLessonProgress.groupBy
      .mockResolvedValueOnce([
        { courseKey: 'a', userId: 1 },
        { courseKey: 'b', userId: 1 },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { courseKey: 'a', _count: { _all: 1 } },
        { courseKey: 'b', _count: { _all: 9 } },
      ]);

    const result = await repo.progressStats();

    expect(result.byCourse.map((c) => c.courseKey)).toEqual(['b', 'a']);
  });

  it('reports zero learners for a course with completions but no learner rows', async () => {
    mockPrisma.userLessonProgress.count.mockResolvedValueOnce(0);
    mockPrisma.userLessonProgress.groupBy
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ courseKey: 'python', _count: { _all: 2 } }]);

    const result = await repo.progressStats();

    expect(result.byCourse).toEqual([{ courseKey: 'python', completions: 2, learners: 0 }]);
  });
});

describe('tutorStats', () => {
  it('counts the messages sent to the tutor in the last 7 and 30 days', async () => {
    vi.useFakeTimers({ now: new Date('2026-11-15T12:00:00Z') });
    mockPrisma.tutorPrompt.count.mockResolvedValueOnce(42).mockResolvedValueOnce(120);

    const result = await repo.tutorStats();
    vi.useRealTimers();

    expect(result).toEqual({ promptsLast7Days: 42, promptsLast30Days: 120 });
    expect(mockPrisma.tutorPrompt.count).toHaveBeenCalledWith({
      where: { createdAt: { gte: new Date('2026-11-08T12:00:00Z') } },
    });
    expect(mockPrisma.tutorPrompt.count).toHaveBeenCalledWith({
      where: { createdAt: { gte: new Date('2026-10-16T12:00:00Z') } },
    });
  });
});

describe('countPeople', () => {
  it('counts the students among the given accounts', async () => {
    mockPrisma.user.count.mockResolvedValueOnce(2);

    expect(await repo.countPeople([1, 2, 3])).toBe(2);
    expect(mockPrisma.user.count).toHaveBeenCalledWith({
      where: { id: { in: [1, 2, 3] }, ...PEOPLE },
    });
  });
});
