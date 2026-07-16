import * as dailyRepo from '../repositories/daily.repository.js';
import * as curriculumRepo from '../repositories/curriculum.repository.js';
import { hasTestsFile } from './paths.js';
import {
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
  ALGO_COURSE_KEYS,
  DAILY_BONUS_RATIO,
  dateKey,
} from '../../shared/constants.js';
import type { DailyKind, DailyPickDto, DailyResponse } from '../../shared/daily.js';

// Courses each kind draws from — mirrors the client's home-page grouping.
const POOLS: Record<DailyKind, readonly string[]> = {
  lesson: [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS],
  algo: [...ALGO_COURSE_KEYS],
};

export function todayKey(): string {
  return dateKey(new Date());
}

// Stable non-negative hash so the pick is deterministic per day/kind — the same
// choice for every user (the concrete row is then persisted per user only so the
// per-user bonus can be tracked — see getOrCreatePick).
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

async function poolLessons(
  courses: readonly string[],
): Promise<{ courseKey: string; slug: string; title: string }[]> {
  const out: { courseKey: string; slug: string; title: string }[] = [];
  for (const courseKey of courses) {
    const lessons = await curriculumRepo.getLessonsByCourse(courseKey);
    for (const l of lessons) {
      // Only judge-completable lessons can earn the daily bonus. Skipping
      // untested ones (Kotlin, main-course lessons without a tests file) keeps
      // every daily pick claimable — otherwise the deterministic global pick
      // could land on a lesson nobody can complete.
      if (!hasTestsFile(courseKey, l.slug)) continue;
      out.push({ courseKey, slug: l.slug, title: l.title });
    }
  }
  return out;
}

async function getOrCreatePick(
  userId: number,
  date: string,
  kind: DailyKind,
): Promise<DailyPickDto | null> {
  const existing = await dailyRepo.getPick(userId, date, kind);
  if (existing) {
    return {
      kind,
      courseKey: existing.courseKey,
      slug: existing.lessonSlug,
      title: existing.title,
    };
  }

  const candidates = await poolLessons(POOLS[kind]);
  if (!candidates.length) return null;
  const chosen = candidates[hash(`${date}-${kind}`) % candidates.length];

  try {
    await dailyRepo.createPick(userId, date, kind, chosen.courseKey, chosen.slug, chosen.title);
  } catch {
    // Lost a race with a concurrent request that created the pick first — reuse
    // whatever landed (the unique (userId,date,kind) row).
    const raced = await dailyRepo.getPick(userId, date, kind);
    if (raced) {
      return { kind, courseKey: raced.courseKey, slug: raced.lessonSlug, title: raced.title };
    }
  }
  return { kind, courseKey: chosen.courseKey, slug: chosen.slug, title: chosen.title };
}

export async function getDaily(userId: number): Promise<DailyResponse> {
  const date = todayKey();
  const [lesson, algo] = await Promise.all([
    getOrCreatePick(userId, date, 'lesson'),
    getOrCreatePick(userId, date, 'algo'),
  ]);
  return { lesson, algo, bonusRatio: DAILY_BONUS_RATIO };
}

// Award the daily bonus if this completion matches today's pick. Idempotent and
// safe to call on every completion — it no-ops when the lesson isn't a pick.
export async function awardBonusForCompletion(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<void> {
  await dailyRepo.awardBonusIfPicked(userId, todayKey(), courseKey, lessonSlug);
}
