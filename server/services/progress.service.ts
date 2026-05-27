import * as progressRepo from '../repositories/progress.repository.js';
import * as curriculumRepo from '../repositories/curriculum.repository.js';
import type { CourseProgress } from '../../shared/progress.js';

export async function getCourseProgress(
  userId: number,
  courseKey: string,
): Promise<CourseProgress> {
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
  await progressRepo.upsertProgress(userId, courseKey, lessonSlug, true);
}

export async function saveCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  code: string,
): Promise<void> {
  await progressRepo.upsertCode(userId, courseKey, lessonSlug, code);
}

export async function getSavedCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<string | null> {
  return progressRepo.getSavedCode(userId, courseKey, lessonSlug);
}

export async function trackAccess(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<void> {
  await progressRepo.touchAccess(userId, courseKey, lessonSlug);
}
