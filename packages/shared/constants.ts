import { PREVIEW_FEATURES } from './features.js';

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

// The languages a lesson's code can be written in.
export const CODE_LANGUAGES = ['python', 'java', 'c'] as const;
export type CodeLanguage = (typeof CODE_LANGUAGES)[number];

// Courses taught in every one of CODE_LANGUAGES: each lesson exists in all
// three, and the student switches between them on the lesson. Progress stays
// one tick per lesson, whichever language passed it. The Trees and Graphs
// course, and its challenge set in Algorithms.
export const MULTI_LANGUAGE_COURSE_KEYS = ['trees-graphs', 'algo-trees-graphs'] as const;

// Courses still being built: open to everyone, labelled Beta, and left out of
// what the landing page counts until they are whole. None today
const BETA_COURSE_KEYS: readonly string[] = [];

export function isBeta(courseKey: string): boolean {
  return BETA_COURSE_KEYS.includes(courseKey);
}

// What a multi-language lesson opens in before the student picks a language.
export const DEFAULT_CODE_LANGUAGE: CodeLanguage = 'python';

export const MAIN_COURSE_KEYS = ['python', 'java', 'c', 'trees-graphs'] as const;
export const ALGO_COURSE_KEYS = [
  'algo-python',
  'algo-java',
  'algo-c',
  'algo-trees-graphs',
] as const;
export const ALL_COURSE_KEYS = [...MAIN_COURSE_KEYS, ...ALGO_COURSE_KEYS] as const;

// Terminal courses run in a Linux sandbox, not the /api/code editor pipeline.
export const TERMINAL_COURSE_KEYS = ['linux'] as const;

// The courses under the Web Development card on the Courses page. Their
// lessons are web lessons: a site of several files in an IDE with a live
// preview (packages/shared/webFiles.ts) instead of one file of code.
export const WEB_COURSE_KEYS: readonly string[] = ['web-dev'];

// A web course while Web Development is in preview (PREVIEW_FEATURES): only
// admins and the founder open its card, and its courses are listed nowhere
// else. Launching is flipping that flag.
export function isClosedCourse(courseKey: string): boolean {
  return PREVIEW_FEATURES.webDevelopment && WEB_COURSE_KEYS.includes(courseKey);
}

// The courses Home, Progress, profiles, the daily picks, the sitemap and the
// landing page list (challenge sets have their own lists).
export const LISTED_COURSE_KEYS: readonly string[] = [
  ...MAIN_COURSE_KEYS,
  ...TERMINAL_COURSE_KEYS,
  ...(PREVIEW_FEATURES.webDevelopment ? [] : WEB_COURSE_KEYS),
];

// The lesson every new account is walked through before the rest of the app
// opens up. Passing its tests is what ends the tour (progress.service).
export const TOUR_LESSON = { courseKey: 'python', slug: 'print' } as const;

// Forum categories where only moderators and admins may start threads or reply.
export const RESTRICTED_FORUM_CATEGORIES = new Set(['announcements']);

export function baseLanguage(key: string): string {
  return key.startsWith('algo-') ? key.slice(5) : key;
}

export function isMultiLanguage(courseKey: string): boolean {
  return (MULTI_LANGUAGE_COURSE_KEYS as readonly string[]).includes(courseKey);
}

export function isCodeLanguage(value: unknown): value is CodeLanguage {
  return (CODE_LANGUAGES as readonly unknown[]).includes(value);
}

// The language a lesson's code is in: on a multi-language course the one
// picked (Python until one is), on any other the course's own.
export function codeLanguageOf(courseKey: string, picked?: string | null): string {
  if (!isMultiLanguage(courseKey)) return baseLanguage(courseKey);
  return isCodeLanguage(picked) ? picked : DEFAULT_CODE_LANGUAGE;
}

// ── XP & levels ──────────────────────────────────────────────────────────────
// XP is a DERIVED quantity: it is never stored in the DB nor accepted from a
// client. The server recomputes it from the set of judge-completed lessons
// (see progress.service.getCourseProgress), so a tampered client can only fool
// its own display; the source of truth is the completion rows, which are
// server-authoritative (only a passing judge verdict marks a lesson complete).
// These functions live in shared/ so client and server use the identical math.

// Where each part of a course split into parts begins: the sortOrder of the
// part's first lesson (packages/content/curriculum.ts `courseParts`, which
// curriculum.test.ts keeps in step with this list). A course left out is one
// list.
export const PART_STARTS: Readonly<Record<string, readonly number[]>> = {
  'web-dev': [1, 44, 112, 157, 207, 246, 292, 325, 359],
};

// The lessons a lesson's XP is spread over: its part (first and last
// sortOrder), or the whole course on a course without parts.
function partOf(courseKey: string, sortOrder: number, lessonCount: number) {
  const starts = PART_STARTS[courseKey] ?? [1];
  let i = 0;
  while (i + 1 < starts.length && starts[i + 1] <= sortOrder) i++;
  return { first: starts[i], last: (starts[i + 1] ?? lessonCount + 1) - 1 };
}

export type Difficulty = 'easy' | 'medium' | 'hard';

// A challenge's title starts with its difficulty, in English in both
// languages: "Easy · Two Sum". null on a title without one.
export function difficultyOf(title: string): Difficulty | null {
  const m = title.match(/^(Easy|Medium|Hard)\s*·/i);
  return m ? (m[1].toLowerCase() as Difficulty) : null;
}

// A challenge is a whole problem, so even an easy one is worth two late
// lessons and a hard one as much as an easy project (PROJECT_XP).
export const CHALLENGE_XP: Record<Difficulty, number> = { easy: 40, medium: 70, hard: 100 };

function isChallengeSet(courseKey: string): boolean {
  return (ALGO_COURSE_KEYS as readonly string[]).includes(courseKey);
}

// What a lesson's XP is read from: its place (1-based sortOrder, see
// packages/content/curriculum.ts) and its title.
export interface XpLesson {
  sortOrder: number;
  title: string;
}

// A challenge pays by its difficulty (a title without one counts as Easy). A
// lesson pays 10 XP first in its course and 30 XP last, growing evenly in
// between, so a long course doesn't inflate its late lessons. On a course
// split into parts the climb starts again on each part. lessonCount is the
// course's whole lesson count, which closes its last part.
export function xpForLesson(courseKey: string, lesson: XpLesson, lessonCount: number): number {
  if (isChallengeSet(courseKey)) return CHALLENGE_XP[difficultyOf(lesson.title) ?? 'easy'];
  const { first, last } = partOf(courseKey, lesson.sortOrder, lessonCount);
  if (last <= first) return 10;
  return 10 + Math.round((20 * (lesson.sortOrder - first)) / (last - first));
}

// Completing the lesson/algorithm of the day on its day grants this fraction of
// the lesson's base XP on top (0.2 = 20% more). The award is server-authoritative
// (see daily.service / progress.service): the bonus only counts for a lesson the
// server itself picked for that day, so a tampered client can't self-grant it.
export const DAILY_BONUS_RATIO = 0.2;

export function dailyBonusXp(courseKey: string, lesson: XpLesson, lessonCount: number): number {
  return Math.round(xpForLesson(courseKey, lesson, lessonCount) * DAILY_BONUS_RATIO);
}

// Total XP a course is worth: the sum of xpForLesson over its lessons.
export function xpForCourse(courseKey: string, lessons: readonly XpLesson[]): number {
  let total = 0;
  for (const l of lessons) total += xpForLesson(courseKey, l, lessons.length);
  return total;
}

// Quadratic level curve. Level L begins at XP_LEVEL_CONSTANT·(L-1)², so each
// level costs a bit more than the last (linear marginal cost). c=100 makes
// level 2 land after about the first 10 lessons of a course (or one hard
// challenge) and the titled levels (up to 10, ~8,100 XP) come early; the whole
// catalog goes well past them.
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
