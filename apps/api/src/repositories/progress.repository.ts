import { prisma } from '../config/db.js';
import type { UserLessonProgress } from '@prisma/client';

export async function getByCourse(
  userId: number,
  courseKey: string,
): Promise<UserLessonProgress[]> {
  return prisma.userLessonProgress.findMany({ where: { userId, courseKey } });
}

// The lessons of the course each of the students completed.
export function getCompletedOf(
  userIds: number[],
  courseKey: string,
): Promise<{ userId: number; lessonSlug: string }[]> {
  return prisma.userLessonProgress.findMany({
    where: { userId: { in: userIds }, courseKey, completed: true },
    select: { userId: true, lessonSlug: true },
  });
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
  language: string,
): Promise<string | null> {
  const row = await prisma.userSavedCode.findUnique({
    where: {
      userId_courseKey_lessonSlug_language: { userId, courseKey, lessonSlug, language },
    },
    select: { code: true },
  });
  return row?.code ?? null;
}

export async function upsertCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  language: string,
  code: string,
): Promise<void> {
  await prisma.userSavedCode.upsert({
    where: {
      userId_courseKey_lessonSlug_language: { userId, courseKey, lessonSlug, language },
    },
    create: { userId, courseKey, lessonSlug, language, code },
    update: { code, updatedAt: new Date() },
  });
}

// Completed lesson slugs per course for one user (oldest-completed first).
// Single source for the public profile's active-course/badge tallies (derived
// from slugs.length, the same way the client's useGamification does it) and the
// per-course lesson enumeration.
export async function getCompletedByCourse(
  userId: number,
): Promise<{ courseKey: string; slugs: string[] }[]> {
  const rows = await prisma.userLessonProgress.findMany({
    where: { userId, completed: true },
    select: { courseKey: true, lessonSlug: true, completedAt: true },
    orderBy: { completedAt: 'asc' },
  });
  const byCourse = new Map<string, string[]>();
  for (const r of rows) {
    const slugs = byCourse.get(r.courseKey) ?? [];
    slugs.push(r.lessonSlug);
    byCourse.set(r.courseKey, slugs);
  }
  return [...byCourse].map(([courseKey, slugs]) => ({ courseKey, slugs }));
}

// Every lesson the student opened, for what the tutor knows about them
export async function getByUser(userId: number): Promise<
  {
    courseKey: string;
    lessonSlug: string;
    completed: boolean;
    lastAccessedAt: Date;
  }[]
> {
  return prisma.userLessonProgress.findMany({
    where: { userId },
    select: { courseKey: true, lessonSlug: true, completed: true, lastAccessedAt: true },
  });
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
