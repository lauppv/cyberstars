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

  const courses = new Map<string, { completions: number; learners: Set<number> }>();
  for (const g of courseUserGroups) {
    const entry = courses.get(g.courseKey) ?? { completions: 0, learners: new Set<number>() };
    entry.completions += g._count?._all ?? 0;
    entry.learners.add(g.userId);
    courses.set(g.courseKey, entry);
  }

  // groupBy on [courseKey, userId] yields one row per (course, user); _count is
  // absent because no aggregate was requested, so recount completions per course.
  const completionCounts = await prisma.userLessonProgress.groupBy({
    by: ['courseKey'],
    where,
    _count: { _all: true },
  });
  const completionsByCourse = new Map(completionCounts.map((c) => [c.courseKey, c._count._all]));

  const byCourse = [...courses.entries()]
    .map(([courseKey, v]) => ({
      courseKey,
      completions: completionsByCourse.get(courseKey) ?? 0,
      learners: v.learners.size,
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
