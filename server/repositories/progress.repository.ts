import { prisma } from '../config/db.js';
import type { UserLessonProgress } from '@prisma/client';

export async function getByCourse(
  userId: number,
  courseKey: string,
): Promise<UserLessonProgress[]> {
  return prisma.userLessonProgress.findMany({ where: { userId, courseKey } });
}

export async function upsertProgress(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  completed: boolean,
): Promise<void> {
  const completedAt = completed ? new Date() : null;
  await prisma.userLessonProgress.upsert({
    where: { userId_courseKey_lessonSlug: { userId, courseKey, lessonSlug } },
    create: { userId, courseKey, lessonSlug, completed, completedAt, lastAccessedAt: new Date() },
    update: { completed, completedAt, lastAccessedAt: new Date() },
  });
}

export async function touchAccess(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<void> {
  await prisma.userLessonProgress.upsert({
    where: { userId_courseKey_lessonSlug: { userId, courseKey, lessonSlug } },
    create: { userId, courseKey, lessonSlug, lastAccessedAt: new Date() },
    update: { lastAccessedAt: new Date() },
  });
}

export async function getSavedCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<string | null> {
  const row = await prisma.userSavedCode.findUnique({
    where: { userId_courseKey_lessonSlug: { userId, courseKey, lessonSlug } },
    select: { code: true },
  });
  return row?.code ?? null;
}

export async function upsertCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  code: string,
): Promise<void> {
  await prisma.userSavedCode.upsert({
    where: { userId_courseKey_lessonSlug: { userId, courseKey, lessonSlug } },
    create: { userId, courseKey, lessonSlug, code },
    update: { code, updatedAt: new Date() },
  });
}

// Completed-lesson count per course for one user. Powers the public profile's
// active-course and badge tallies (badges are derived from these counts, the
// same way the client's useGamification does it).
export async function getCompletedCountsByCourse(
  userId: number,
): Promise<{ courseKey: string; done: number }[]> {
  const rows = await prisma.userLessonProgress.groupBy({
    by: ['courseKey'],
    where: { userId, completed: true },
    _count: { _all: true },
  });
  return rows.map((r) => ({ courseKey: r.courseKey, done: r._count._all }));
}

export async function getActivityDates(userId: number): Promise<
  {
    completedAt: Date | null;
    lastAccessedAt: Date;
  }[]
> {
  return prisma.userLessonProgress.findMany({
    where: { userId },
    select: { completedAt: true, lastAccessedAt: true },
  });
}
