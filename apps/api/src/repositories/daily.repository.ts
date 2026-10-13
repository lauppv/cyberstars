import { prisma } from '../config/db.js';
import type { DailyPick } from '@prisma/client';

export async function getPick(
  userId: number,
  date: string,
  kind: string,
): Promise<DailyPick | null> {
  return prisma.dailyPick.findUnique({
    where: { userId_date_kind: { userId, date, kind } },
  });
}

export async function createPick(
  userId: number,
  date: string,
  kind: string,
  courseKey: string,
  lessonSlug: string,
  title: string,
): Promise<DailyPick> {
  return prisma.dailyPick.create({
    data: { userId, date, kind, courseKey, lessonSlug, title },
  });
}

// Mark the bonus earned for a completion that matches an as-yet-unrewarded pick
// on its own day. Returns true if a bonus was newly awarded.
export async function awardBonusIfPicked(
  userId: number,
  date: string,
  courseKey: string,
  lessonSlug: string,
): Promise<boolean> {
  const { count } = await prisma.dailyPick.updateMany({
    where: { userId, date, courseKey, lessonSlug, bonusAwarded: false },
    data: { bonusAwarded: true },
  });
  return count > 0;
}

// Slugs in a course for which this user has an awarded daily bonus, so the XP
// calc can credit the extra. Bonuses persist across days once awarded.
export async function getAwardedSlugs(userId: number, courseKey: string): Promise<string[]> {
  const rows = await prisma.dailyPick.findMany({
    where: { userId, courseKey, bonusAwarded: true },
    select: { lessonSlug: true },
  });
  return rows.map((r) => r.lessonSlug);
}
