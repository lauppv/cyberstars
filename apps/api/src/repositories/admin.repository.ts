import { prisma } from '../config/db.js';
import { BOT_EMAIL_ENDINGS, PEOPLE } from './user.repository.js';
import type { AdminUserStats, AdminProgressStats, AdminTutorStats } from '@cyberstars/shared/admin';

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

// Students only, like every number on the admin page (see PEOPLE); byRole
// alone also counts the founder, the admins and our test accounts
export async function userStats(): Promise<AdminUserStats> {
  const [total, newLast7Days, newLast30Days, founders, admins, bots] = await Promise.all([
    prisma.user.count({ where: PEOPLE }),
    prisma.user.count({ where: { ...PEOPLE, createdAt: { gte: daysAgo(7) } } }),
    prisma.user.count({ where: { ...PEOPLE, createdAt: { gte: daysAgo(30) } } }),
    prisma.user.count({ where: { role: 'FOUNDER' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({
      where: { role: 'USER', OR: BOT_EMAIL_ENDINGS.map((endsWith) => ({ email: { endsWith } })) },
    }),
  ]);
  return {
    total,
    byRole: { FOUNDER: founders, ADMIN: admins, USER: total, BOT: bots },
    newLast7Days,
    newLast30Days,
  };
}

export async function progressStats(): Promise<AdminProgressStats> {
  const where = { completed: true, user: PEOPLE };
  const [totalCompletions, courseUserGroups, lessonGroups] = await Promise.all([
    prisma.userLessonProgress.count({ where }),
    prisma.userLessonProgress.groupBy({ by: ['courseKey', 'userId'], where }),
    prisma.userLessonProgress.groupBy({
      by: ['courseKey', 'lessonSlug'],
      where,
      _count: { _all: true },
      orderBy: { _count: { lessonSlug: 'desc' } },
      take: 10,
    }),
  ]);

  // groupBy on [courseKey, userId] yields one row per (course, user), so the
  // number of rows for a course is its distinct-learner count.
  const learnersByCourse = new Map<string, Set<number>>();
  for (const g of courseUserGroups) {
    const learners = learnersByCourse.get(g.courseKey) ?? new Set<number>();
    learners.add(g.userId);
    learnersByCourse.set(g.courseKey, learners);
  }

  // Completions per course need a separate aggregate (the query above requested
  // no _count).
  const completionCounts = await prisma.userLessonProgress.groupBy({
    by: ['courseKey'],
    where,
    _count: { _all: true },
  });

  const byCourse = completionCounts
    .map((c) => ({
      courseKey: c.courseKey,
      completions: c._count._all,
      learners: learnersByCourse.get(c.courseKey)?.size ?? 0,
    }))
    .sort((a, b) => b.completions - a.completions);

  const topLessons = lessonGroups.map((g) => ({
    courseKey: g.courseKey,
    lessonSlug: g.lessonSlug,
    completions: g._count._all,
  }));

  return { totalCompletions, byCourse, topLessons };
}

// How many messages students sent the tutor in the last 7 and 30 days; only
// USER accounts that aren't bots were ever counted.
export async function tutorStats(): Promise<AdminTutorStats> {
  const [promptsLast7Days, promptsLast30Days] = await Promise.all([
    prisma.tutorPrompt.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.tutorPrompt.count({ where: { createdAt: { gte: daysAgo(30) } } }),
  ]);
  return { promptsLast7Days, promptsLast30Days };
}

// How many of these users are students
export async function countPeople(ids: number[]): Promise<number> {
  return prisma.user.count({ where: { id: { in: ids }, ...PEOPLE } });
}
