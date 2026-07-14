export function progressPct(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

// Local calendar day as `YYYY-MM-DD`. Used as the per-day key for daily picks
// (server) and the activity heatmap (client), so both bucket by local date.
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const MAIN_COURSE_KEYS = ['python', 'java', 'c', 'kotlin'] as const;
export const ALGO_COURSE_KEYS = ['algo-python', 'algo-java', 'algo-c'] as const;
export const ALL_COURSE_KEYS = [...MAIN_COURSE_KEYS, ...ALGO_COURSE_KEYS] as const;

// Terminal courses run in a Linux sandbox, not the /api/code editor pipeline.
export const TERMINAL_COURSE_KEYS = ['linux'] as const;

// Forum categories where only moderators and admins may start threads or reply.
export const RESTRICTED_FORUM_CATEGORIES = new Set(['announcements']);

export function baseLanguage(key: string): string {
  return key.startsWith('algo-') ? key.slice(5) : key;
}

// ── XP & levels ──────────────────────────────────────────────────────────────
// XP is a DERIVED quantity: it is never stored in the DB nor accepted from a
// client. The server recomputes it from the set of judge-completed lessons
// (see progress.service.getCourseProgress), so a tampered client can only fool
// its own display — the source of truth is the completion rows, which are
// server-authoritative (only a passing judge verdict marks a lesson complete).
// These functions live in shared/ so client and server use the identical math.

// A lesson's award grows with its position in the course, so later (harder)
// lessons are worth more. sortOrder is 1-based per course (see
// prisma/curriculum.data.ts): the first lesson is worth 10 XP.
export function xpForLesson(sortOrder: number): number {
  return 10 + (sortOrder - 1);
}

// Completing the lesson/algorithm of the day on its day grants this fraction of
// the lesson's base XP on top (0.2 = 20% more). The award is server-authoritative
// (see daily.service / progress.service): the bonus only counts for a lesson the
// server itself picked for that day, so a tampered client can't self-grant it.
export const DAILY_BONUS_RATIO = 0.2;

export function dailyBonusXp(sortOrder: number): number {
  return Math.round(xpForLesson(sortOrder) * DAILY_BONUS_RATIO);
}

// Total XP an n-lesson course is worth: Σ xpForLesson(s) for s in 1..n.
export function xpForCourse(lessonCount: number): number {
  return 10 * lessonCount + (lessonCount * (lessonCount - 1)) / 2;
}

// Quadratic level curve. Level L begins at XP_LEVEL_CONSTANT·(L-1)², so each
// level costs a bit more than the last (linear marginal cost). c=100 makes
// level 2 land around the first ~9 lessons and the full curriculum (~8000 XP)
// land around level 10 — a short, legible scale.
const XP_LEVEL_CONSTANT = 100;

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / XP_LEVEL_CONSTANT)) + 1;
}

// XP threshold at which a given level begins (inverse of levelFromXp).
export function xpForLevel(level: number): number {
  return XP_LEVEL_CONSTANT * (level - 1) ** 2;
}

// Cosmos-themed titles, indexed by level (1-based). Beyond the last entry the
// final title sticks. i18n renders them via `level.title.<n>`.
export const MAX_TITLED_LEVEL = 10;

export function levelTitleKey(level: number): string {
  return `level.title.${Math.min(Math.max(level, 1), MAX_TITLED_LEVEL)}`;
}
