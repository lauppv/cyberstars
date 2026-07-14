import * as progressRepo from '../repositories/progress.repository.js';
import * as curriculumRepo from '../repositories/curriculum.repository.js';
import * as dailyRepo from '../repositories/daily.repository.js';
import * as dailyService from './daily.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { assertValidCourse } from './paths.js';
import { xpForLesson, dailyBonusXp } from '../../shared/constants.js';
import type { CourseProgress } from '../../shared/progress.js';

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
  const [lessons, progress, awardedSlugs] = await Promise.all([
    curriculumRepo.getLessonsByCourse(courseKey),
    progressRepo.getByCourse(userId, courseKey),
    dailyRepo.getAwardedSlugs(userId, courseKey),
  ]);

  const progressMap = new Map(progress.map((p) => [p.lessonSlug, p]));
  const bonusSlugs = new Set(awardedSlugs);

  let earnedXp = 0;
  let totalXp = 0;
  const lessonItems = lessons.map((l) => {
    const p = progressMap.get(l.slug);
    const completed = p?.completed ?? false;
    const xp = xpForLesson(l.sortOrder);
    totalXp += xp;
    // The daily-of-the-day bonus is extra on top of the base award, so it
    // counts toward earned XP (and thus level) without inflating the course's
    // baseline total.
    if (completed) earnedXp += xp + (bonusSlugs.has(l.slug) ? dailyBonusXp(l.sortOrder) : 0);
    return {
      slug: l.slug,
      title: l.title,
      completed,
      completedAt: p?.completedAt?.toISOString() ?? null,
      lastAccessedAt: p?.lastAccessedAt?.toISOString() ?? null,
    };
  });

  return {
    courseKey,
    completed: progress.filter((p) => p.completed).length,
    total: lessons.length,
    earnedXp,
    totalXp,
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
  // Grant the daily bonus if this lesson is today's pick. Idempotent no-op
  // otherwise, so it's safe on every completion (including re-runs).
  await dailyService.awardBonusForCompletion(userId, courseKey, lessonSlug);
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
