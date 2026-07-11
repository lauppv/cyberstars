export function progressPct(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
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
// lessons are worth more. sortOrder is 0-based per course.
export function xpForLesson(sortOrder: number): number {
  return 10 + sortOrder;
}

// Total XP an n-lesson course is worth: Σ (10 + i) for i in 0..n-1.
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
