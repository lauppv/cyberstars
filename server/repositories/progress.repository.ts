import { prisma } from "../config/db.js";
import type { UserLessonProgress } from "@prisma/client";

export interface LeaderboardRow {
  userId: number;
  name: string;
  totalXp: number;
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const rows = await prisma.$queryRaw<LeaderboardRow[]>`
    SELECT u.id AS "userId", u.name,
           COALESCE(SUM(10 + l.sort_order), 0)::int AS "totalXp"
    FROM users u
    JOIN user_lesson_progress p ON p.user_id = u.id AND p.completed = true
    JOIN lessons l ON l.course_key = p.course_key AND l.slug = p.lesson_slug
    GROUP BY u.id, u.name
    ORDER BY "totalXp" DESC
  `;
  return rows;
}

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
