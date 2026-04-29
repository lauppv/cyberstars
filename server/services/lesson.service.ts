import fs from "fs";
import path from "path";
import type { LessonContent } from "../../shared/lesson.js";
import { AppError } from "../middleware/errorHandler.js";
import * as curriculumRepo from "../repositories/curriculum.repository.js";

const LESSONS_DIR = path.join(process.cwd(), "server", "lessons");

export function getLessonContent(courseKey: string, lessonSlug: string): LessonContent {
  const filePath = path.join(LESSONS_DIR, courseKey, `${lessonSlug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new AppError(404, "Lesson not found");
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return { title: lessonSlug, content };
}

export function getLessonCode(courseKey: string, file: string): string {
  const filePath = path.join(LESSONS_DIR, courseKey, file);

  if (!fs.existsSync(filePath)) {
    throw new AppError(404, "Code file not found");
  }

  return fs.readFileSync(filePath, "utf-8");
}

export async function getCurriculum() {
  const courses = await curriculumRepo.getAllCourses();
  const lessons = await curriculumRepo.getAllLessons();

  return courses.map(course => ({
    key: course.key,
    title: course.title,
    description: course.description,
    lessons: lessons
      .filter(l => l.courseKey === course.key)
      .map(l => ({
        slug: l.slug,
        title: l.title,
        sortOrder: l.sortOrder,
      })),
  }));
}
