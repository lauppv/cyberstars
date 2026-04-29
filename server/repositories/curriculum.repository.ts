import { prisma } from "../config/db.js";
import type { Curriculum, Lesson } from "@prisma/client";

export async function getAllCourses(): Promise<Curriculum[]> {
  return prisma.curriculum.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getLessonsByCourse(courseKey: string): Promise<Lesson[]> {
  return prisma.lesson.findMany({
    where: { courseKey },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllLessons(): Promise<Lesson[]> {
  return prisma.lesson.findMany({
    orderBy: [{ courseKey: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getLessonCount(courseKey: string): Promise<number> {
  return prisma.lesson.count({ where: { courseKey } });
}
