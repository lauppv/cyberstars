import * as progressRepo from "../repositories/progressRepository.js";
import * as curriculumRepo from "../repositories/curriculumRepository.js";
import type { CourseProgressSummary } from "../types/progress.js";

export async function getCourseProgress(userId: number, courseKey: string): Promise<CourseProgressSummary> {
  const [lessons, progress] = await Promise.all([
    curriculumRepo.getLessonsByCourse(courseKey),
    progressRepo.getByCourse(userId, courseKey),
  ]);

  const progressMap = new Map(
    progress.map(p => [p.lesson_slug, p])
  );

  return {
    courseKey,
    completed: progress.filter(p => p.completed).length,
    total: lessons.length,
    lessons: lessons.map(l => {
      const p = progressMap.get(l.slug);
      return {
        slug: l.slug,
        title: l.title,
        completed: p?.completed ?? false,
        completedAt: p?.completed_at?.toISOString() ?? null,
      };
    }),
  };
}

export async function markComplete(userId: number, courseKey: string, lessonSlug: string): Promise<void> {
  await progressRepo.upsertProgress(userId, courseKey, lessonSlug, true);
}

export async function saveCode(userId: number, courseKey: string, lessonSlug: string, code: string): Promise<void> {
  await progressRepo.upsertCode(userId, courseKey, lessonSlug, code);
}

export async function getSavedCode(userId: number, courseKey: string, lessonSlug: string): Promise<string | null> {
  return progressRepo.getSavedCode(userId, courseKey, lessonSlug);
}

export async function trackAccess(userId: number, courseKey: string, lessonSlug: string): Promise<void> {
  await progressRepo.touchAccess(userId, courseKey, lessonSlug);
}
