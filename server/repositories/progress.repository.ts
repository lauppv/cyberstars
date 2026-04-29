import { prisma } from "../config/db.js";
import type { UserLessonProgress } from "@prisma/client";

export async function getByUser(userId: number): Promise<UserLessonProgress[]> {
  return prisma.userLessonProgress.findMany({ where: { userId } });
}

export async function getByCourse(userId: number, courseKey: string): Promise<UserLessonProgress[]> {
  return prisma.userLessonProgress.findMany({ where: { userId, courseKey } });
}

export async function upsertProgress(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  completed: boolean
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
  lessonSlug: string
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
  lessonSlug: string
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
  code: string
): Promise<void> {
  await prisma.userSavedCode.upsert({
    where: { userId_courseKey_lessonSlug: { userId, courseKey, lessonSlug } },
    create: { userId, courseKey, lessonSlug, code },
    update: { code, updatedAt: new Date() },
  });
}
