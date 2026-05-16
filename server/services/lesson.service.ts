import fs from "fs";
import path from "path";
import type { LessonContent } from "../../shared/lesson.js";
import { AppError } from "../middleware/errorHandler.js";
import { contentDir } from "./paths.js";
import * as curriculumRepo from "../repositories/curriculum.repository.js";

export function getLessonContent(courseKey: string, lessonSlug: string): LessonContent {
  if (lessonSlug.includes("..") || lessonSlug.includes("/")) {
    throw new AppError(400, "Invalid lesson slug");
  }

  const filePath = path.join(contentDir(courseKey), `${lessonSlug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new AppError(404, "Lesson not found");
  }

  const content = fs.readFileSync(filePath, "utf-8");
  return { title: lessonSlug, content };
}

export function getLessonCode(courseKey: string, file: string): string {
  if (file.includes("..") || file.includes("/")) {
    throw new AppError(400, "Invalid file path");
  }

  const filePath = path.join(contentDir(courseKey), file);

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
