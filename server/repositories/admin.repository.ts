import { prisma } from '../config/db.js';
import type { Role } from '@prisma/client';
import type {
  AdminUserStats,
  AdminProgressStats,
  AdminForumStats,
  AdminSupportStats,
} from '../../shared/admin.js';
import type { TicketStatus } from '../../shared/support.js';

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function userStats(): Promise<AdminUserStats> {
  const [total, roleGroups, newLast7Days, newLast30Days, activeGroups] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.user.count({ where: { createdAt: { gte: daysAgo(30) } } }),
    prisma.userLessonProgress.groupBy({ by: ['userId'] }),
  ]);

  const byRole: Record<Role, number> = { USER: 0, MODERATOR: 0, ADMIN: 0 };
  for (const g of roleGroups) byRole[g.role] = g._count._all;

  return { total, byRole, newLast7Days, newLast30Days, active: activeGroups.length };
}

export async function progressStats(): Promise<AdminProgressStats> {
  const where = { completed: true };
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

export async function forumStats(): Promise<AdminForumStats> {
  const [threads, posts, reactions] = await Promise.all([
    prisma.forumThread.count(),
    prisma.forumPost.count({ where: { deleted: false } }),
    prisma.forumReaction.count(),
  ]);
  return { threads, posts, reactions };
}

export async function supportStats(): Promise<AdminSupportStats> {
  const [total, statusGroups] = await Promise.all([
    prisma.supportTicket.count(),
    prisma.supportTicket.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const byStatus: Record<TicketStatus, number> = {
    OPEN: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    CLOSED: 0,
  };
  for (const g of statusGroups) byStatus[g.status] = g._count._all;
  return { total, byStatus };
}
