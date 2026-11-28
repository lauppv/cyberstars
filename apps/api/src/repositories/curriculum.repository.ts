import { prisma } from '../config/db.js';
import type { Lesson } from '@prisma/client';
import { lessons } from '@cyberstars/content/curriculum';

export async function getLessonsByCourse(courseKey: string): Promise<Lesson[]> {
  return prisma.lesson.findMany({
    where: { courseKey },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function lessonExists(courseKey: string, slug: string): Promise<boolean> {
  const lesson = await prisma.lesson.findUnique({
    where: { courseKey_slug: { courseKey, slug } },
    select: { id: true },
  });
  return lesson !== null;
}

// How many lessons a course has, counted from the curriculum in code, the one
// the client reads too (curriculum.json). xpForLesson spreads a lesson's XP
// over this count, so it can't come from the lessons table: the seed only
// upserts, and a lesson taken out of the curriculum keeps its row there.
const lessonCounts = new Map<string, number>();
for (const l of lessons) lessonCounts.set(l.courseKey, (lessonCounts.get(l.courseKey) ?? 0) + 1);

export function courseLessonCount(courseKey: string): number {
  return lessonCounts.get(courseKey) ?? 0;
}
