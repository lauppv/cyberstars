import * as progressRepo from '../repositories/progress.repository.js';
import * as curriculumRepo from '../repositories/curriculum.repository.js';
import { ALL_COURSE_KEYS, TERMINAL_COURSE_KEYS } from '../../shared/constants.js';
import { AppError } from '../middleware/errorHandler.js';
import type { CourseProgress } from '../../shared/progress.js';

const VALID_COURSE_KEYS = new Set<string>([...ALL_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]);

function assertValidCourse(courseKey: string): void {
  if (!VALID_COURSE_KEYS.has(courseKey)) throw new AppError(400, 'Invalid course');
}

// Guards lesson-level writes/reads: reject unknown courses and slugs so the
// URL can't seed garbage rows in user_lesson_progress (audit H11).
async function assertLesson(courseKey: string, lessonSlug: string): Promise<void> {
  assertValidCourse(courseKey);
  if (!(await curriculumRepo.lessonExists(courseKey, lessonSlug))) {
    throw new AppError(404, 'Lesson not found');
  }
}

export async function getCourseProgress(
  userId: number,
  courseKey: string,
): Promise<CourseProgress> {
  assertValidCourse(courseKey);
  const [lessons, progress] = await Promise.all([
    curriculumRepo.getLessonsByCourse(courseKey),
    progressRepo.getByCourse(userId, courseKey),
  ]);

  const progressMap = new Map(progress.map((p) => [p.lessonSlug, p]));

  const lessonItems = lessons.map((l) => {
    const p = progressMap.get(l.slug);
    return {
      slug: l.slug,
      title: l.title,
      completed: p?.completed ?? false,
      completedAt: p?.completedAt?.toISOString() ?? null,
      lastAccessedAt: p?.lastAccessedAt?.toISOString() ?? null,
    };
  });

  return {
    courseKey,
    completed: progress.filter((p) => p.completed).length,
    total: lessons.length,
    lessons: lessonItems,
  };
}

export async function markComplete(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<void> {
  await assertLesson(courseKey, lessonSlug);
  await progressRepo.upsertProgress(userId, courseKey, lessonSlug, true);
}

export async function markIncomplete(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<void> {
  await assertLesson(courseKey, lessonSlug);
  await progressRepo.upsertProgress(userId, courseKey, lessonSlug, false);
}

export async function saveCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  code: string,
): Promise<void> {
  await assertLesson(courseKey, lessonSlug);
  await progressRepo.upsertCode(userId, courseKey, lessonSlug, code);
}

export async function getSavedCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<string | null> {
  await assertLesson(courseKey, lessonSlug);
  return progressRepo.getSavedCode(userId, courseKey, lessonSlug);
}

export async function trackAccess(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<void> {
  await assertLesson(courseKey, lessonSlug);
  await progressRepo.touchAccess(userId, courseKey, lessonSlug);
}
