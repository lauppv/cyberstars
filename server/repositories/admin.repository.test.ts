import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = {
  user: {
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  userLessonProgress: {
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  forumThread: { count: vi.fn() },
  forumPost: { count: vi.fn() },
  forumReaction: { count: vi.fn() },
  supportTicket: {
    count: vi.fn(),
    groupBy: vi.fn(),
  },
};

vi.mock('../config/db.js', () => ({ prisma: mockPrisma }));

const repo = await import('./admin.repository.js');

beforeEach(() => vi.clearAllMocks());

describe('userStats', () => {
  it('aggregates totals, roles, recency and active learners', async () => {
    mockPrisma.user.count
      .mockResolvedValueOnce(10) // total
      .mockResolvedValueOnce(3) // newLast7Days
      .mockResolvedValueOnce(6); // newLast30Days
    mockPrisma.user.groupBy.mockResolvedValueOnce([
      { role: 'ADMIN', _count: { _all: 1 } },
      { role: 'USER', _count: { _all: 8 } },
    ]);
    mockPrisma.userLessonProgress.groupBy.mockResolvedValueOnce([{ userId: 1 }, { userId: 2 }]);

    const result = await repo.userStats();

    expect(result.total).toBe(10);
    expect(result.byRole).toEqual({ USER: 8, MODERATOR: 0, ADMIN: 1, FOUNDER: 0 });
    expect(result.newLast7Days).toBe(3);
    expect(result.newLast30Days).toBe(6);
    expect(result.active).toBe(2);
  });

  it('filters new-user counts by a createdAt lower bound', async () => {
    mockPrisma.user.count.mockResolvedValue(0);
    mockPrisma.user.groupBy.mockResolvedValue([]);
    mockPrisma.userLessonProgress.groupBy.mockResolvedValue([]);

    await repo.userStats();

    const sevenDayArg = mockPrisma.user.count.mock.calls[1][0];
    expect(sevenDayArg.where.createdAt.gte).toBeInstanceOf(Date);
  });
});

describe('progressStats', () => {
  it('derives per-course completions and distinct learners', async () => {
    mockPrisma.userLessonProgress.count.mockResolvedValueOnce(5); // totalCompletions
    mockPrisma.userLessonProgress.groupBy
      .mockResolvedValueOnce([
        // courseUserGroups — one row per (course, user)
        { courseKey: 'python', userId: 1 },
        { courseKey: 'python', userId: 2 },
        { courseKey: 'c', userId: 1 },
      ])
      .mockResolvedValueOnce([
        // lessonGroups — top lessons
        { courseKey: 'python', lessonSlug: 'intro', _count: { _all: 4 } },
      ])
      .mockResolvedValueOnce([
        // completionCounts — per course
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

describe('forumStats', () => {
  it('counts threads, non-deleted posts and reactions', async () => {
    mockPrisma.forumThread.count.mockResolvedValue(2);
    mockPrisma.forumPost.count.mockResolvedValue(7);
    mockPrisma.forumReaction.count.mockResolvedValue(11);

    const result = await repo.forumStats();

    expect(result).toEqual({ threads: 2, posts: 7, reactions: 11 });
    expect(mockPrisma.forumPost.count).toHaveBeenCalledWith({ where: { deleted: false } });
  });
});

describe('supportStats', () => {
  it('aggregates ticket totals by status with a zeroed baseline', async () => {
    mockPrisma.supportTicket.count.mockResolvedValue(3);
    mockPrisma.supportTicket.groupBy.mockResolvedValue([
      { status: 'OPEN', _count: { _all: 2 } },
      { status: 'CLOSED', _count: { _all: 1 } },
    ]);

    const result = await repo.supportStats();

    expect(result.total).toBe(3);
    expect(result.byStatus).toEqual({ OPEN: 2, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 1 });
  });
});
