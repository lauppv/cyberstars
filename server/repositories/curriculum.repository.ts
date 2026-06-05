import { prisma } from '../config/db.js';
import type { Lesson } from '@prisma/client';

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
