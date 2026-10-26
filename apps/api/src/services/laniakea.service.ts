import { lessons } from '@cyberstars/content/curriculum';
import {
  DAY_MS,
  FOREVER_LEVEL,
  LANIAKEA_COURSE,
  QUIZ_IDLE_MS,
  QUIZ_LENGTH,
  QUIZ_OUT,
  QUIZ_RETRY_MS,
  nextRecapAt,
  planetLessons,
  type LaniakeaPlanet,
  type LaniakeaState,
  type QuizAnswer,
  type QuizAnswerResult,
  type QuizMode,
  type QuizView,
} from '@cyberstars/shared/laniakea';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import * as progressRepo from '../repositories/progress.repository.js';
import * as laniakeaRepo from '../repositories/laniakea.repository.js';
import type { PlanetRow, StoredQuiz } from '../repositories/laniakea.repository.js';
import { config } from '../config/index.js';
import { loadQuiz, quizSlugs, type QuizSpec } from './laniakea-quiz.js';

// The game's planets in their lessons' order, each with the lessons it covers:
// First steps, whose lessons open the game, then one for each lesson.
const PLANET_LIST = planetLessons(
  lessons
    .filter((l) => l.courseKey === LANIAKEA_COURSE)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((l) => l.slug),
);
const PLANETS = new Map(PLANET_LIST.map((p) => [p.slug, p.lessons]));
const FIRST_STEPS = PLANET_LIST[0].lessons;

// A shorter day lets a recap be tried out on dev without waiting for it; prod
// always counts real days.
export function dayMs(): number {
  const override = Number(process.env.LANIAKEA_DAY_MS);
  return !config.isProduction && override > 0 ? override : DAY_MS;
}

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// The questions of a new test: `n` the student hasn't seen in this round of the
// pool. When fewer are left, the round starts over: those left come first and
// the rest are drawn from the others, so no question shows twice in a test.
export function drawQuestions(
  pool: string[],
  seen: string[],
  n: number,
): { ids: string[]; seen: string[] } {
  const seenSet = new Set(seen.filter((id) => pool.includes(id)));
  const unseen = pool.filter((id) => !seenSet.has(id));
  if (unseen.length >= n) return { ids: shuffle(unseen).slice(0, n), seen: [...seenSet] };
  const others = shuffle(pool.filter((id) => seenSet.has(id))).slice(0, n - unseen.length);
  return { ids: shuffle([...unseen, ...others]), seen: [] };
}

// Where a pass leaves the planet: conquered, a step up once its recap is open,
// or as it was for practice and for a planet kept for good.
export function afterPass(
  level: number,
  passedAt: Date | null,
  now: Date,
  day = DAY_MS,
): { level: number; passedAt: Date | null; leveledUp: boolean } {
  if (level < 1) return { level: 1, passedAt: now, leveledUp: true };
  const opens = nextRecapAt(level, passedAt, day);
  if (opens && opens <= now) return { level: level + 1, passedAt: now, leveledUp: true };
  return { level, passedAt, leveledUp: false };
}

export function quizMode(level: number, passedAt: Date | null, now: Date, day = DAY_MS): QuizMode {
  if (level < 1) return 'conquer';
  if (level >= FOREVER_LEVEL) return 'practice';
  const opens = nextRecapAt(level, passedAt, day);
  return opens && opens <= now ? 'recap' : 'practice';
}

export function planetView(
  slug: string,
  row: Pick<PlanetRow, 'level' | 'passedAt' | 'retryAt'> | undefined,
  lessonDone: boolean,
  hasQuiz: boolean,
  now: Date,
  day = DAY_MS,
): LaniakeaPlanet {
  const level = row?.level ?? 0;
  const passedAt = row?.passedAt ?? null;
  const retryAt = row?.retryAt && row.retryAt > now ? row.retryAt : null;
  return {
    slug,
    lessonDone,
    hasQuiz,
    level,
    passedAt: passedAt?.toISOString() ?? null,
    nextRecapAt: nextRecapAt(level, passedAt, day)?.toISOString() ?? null,
    retryAt: retryAt?.toISOString() ?? null,
  };
}

function questionOf(spec: QuizSpec, id: string) {
  return spec.questions.find((q) => q.id === id);
}

function answerOf(quiz: StoredQuiz, index: number, choice: number, spec: QuizSpec): QuizAnswer {
  const right = questionOf(spec, quiz.ids[index])!.answer;
  const correctChoice = quiz.orders[index].indexOf(right);
  return { choice, correct: choice === correctChoice, correctChoice };
}

// The test as the student sees it: each question in the page's language with
// its options shuffled as drawn, and the answers so far.
function quizView(
  slug: string,
  mode: QuizMode,
  quiz: StoredQuiz,
  spec: QuizSpec,
  shown: QuizSpec,
): QuizView {
  return {
    slug,
    mode,
    questions: quiz.ids.map((id, i) => {
      const q = questionOf(shown, id) ?? questionOf(spec, id)!;
      return {
        text: q.text,
        code: q.code,
        output: q.output,
        options: quiz.orders[i].map((k) => q.options[k]),
      };
    }),
    answers: quiz.answers.map((choice, i) => answerOf(quiz, i, choice, spec)),
  };
}

// A test still going on: untouched for less than QUIZ_IDLE_MS and drawn from
// questions the lesson still has.
function liveQuiz(row: PlanetRow, spec: QuizSpec, now: Date): StoredQuiz | null {
  const { quiz, quizAt } = row;
  if (!quiz || !quizAt || now.getTime() - quizAt.getTime() >= QUIZ_IDLE_MS) return null;
  return quiz.ids.every((id) => questionOf(spec, id)) ? quiz : null;
}

async function completedLessons(userId: number): Promise<Set<string>> {
  const rows = await progressRepo.getByCourse(userId, LANIAKEA_COURSE);
  return new Set(rows.filter((r) => r.completed).map((r) => r.lessonSlug));
}

// The planet's lessons are all completed, so it can be conquered.
function lessonsDone(slug: string, done: Set<string>): boolean {
  return PLANETS.get(slug)!.every((lesson) => done.has(lesson));
}

function unlocked(done: Set<string>): boolean {
  return FIRST_STEPS.every((lesson) => done.has(lesson));
}

// The board can show the planet's recap to the student: the game is open, the
// slug is still a planet and the planet can be flown to.
export function onBoard(slug: string, done: Set<string>, quizzes: Set<string>): boolean {
  return PLANETS.has(slug) && unlocked(done) && lessonsDone(slug, done) && quizzes.has(slug);
}

export async function getState(userId: number, now = new Date()): Promise<LaniakeaState> {
  const [done, rows] = await Promise.all([
    completedLessons(userId),
    laniakeaRepo.listPlanets(userId, LANIAKEA_COURSE),
  ]);
  const quizzes = new Set(quizSlugs());
  const bySlug = new Map(rows.map((r) => [r.lessonSlug, r]));
  const day = dayMs();
  return {
    courseKey: LANIAKEA_COURSE,
    unlocked: unlocked(done),
    lessonsDone: FIRST_STEPS.filter((lesson) => done.has(lesson)).length,
    unlockAt: FIRST_STEPS.length,
    nextLesson: FIRST_STEPS.find((lesson) => !done.has(lesson)) ?? null,
    serverNow: now.toISOString(),
    planets: PLANET_LIST.map(({ slug }) =>
      planetView(slug, bySlug.get(slug), lessonsDone(slug, done), quizzes.has(slug), now, day),
    ),
  };
}

// The lesson's questions, the English ones holding the ids and right answers
// every language shares.
function questionsFor(slug: string): QuizSpec {
  const spec = PLANETS.has(slug) ? loadQuiz(slug, 'en') : null;
  if (!spec) throw new AppError(404, 'This planet has no questions yet');
  return spec;
}

// Opens a test on a planet, or the one already going on there, which picks up
// where it was. The planet must be the student's to reach: the game unlocked and
// its lessons completed.
export async function startQuiz(
  userId: number,
  slug: string,
  lang: 'en' | 'ro',
  now = new Date(),
): Promise<QuizView> {
  if (!PLANETS.has(slug)) throw new AppError(404, 'Planet not found');
  const done = await completedLessons(userId);
  if (!unlocked(done)) throw new AppError(403, 'Laniakea is still locked');
  if (!lessonsDone(slug, done)) throw new AppError(403, 'Finish this lesson to reach its planet');
  const spec = questionsFor(slug);
  const shown = loadQuiz(slug, lang) ?? spec;
  const day = dayMs();

  return laniakeaRepo.withPlanet(userId, LANIAKEA_COURSE, slug, (row) => {
    const mode = quizMode(row.level, row.passedAt, now, day);
    const live = liveQuiz(row, spec, now);
    if (live) return { change: null, result: quizView(slug, mode, live, spec, shown) };
    if (row.retryAt && row.retryAt > now) {
      throw new AppError(409, 'This planet opens for another try soon');
    }
    const drawn = drawQuestions(
      spec.questions.map((q) => q.id),
      row.seen,
      QUIZ_LENGTH,
    );
    const quiz: StoredQuiz = {
      ids: drawn.ids,
      orders: drawn.ids.map((id) => shuffle(questionOf(spec, id)!.options.map((_, k) => k))),
      answers: [],
    };
    return {
      change: { quiz, quizAt: now, seen: drawn.seen, retryAt: null },
      result: quizView(slug, mode, quiz, spec, shown),
    };
  });
}

// Answers the test's next question. The right answer comes back at once; the
// test ends once QUIZ_OUT answers are wrong, a failure that holds the planet for
// QUIZ_RETRY_MS, or after its last question, a pass. The same answer sent again
// gets the same reply. Each new answer also counts for its question, for the
// admin's list of the most missed ones.
export async function answerQuiz(
  userId: number,
  slug: string,
  index: number,
  choice: number,
  now = new Date(),
): Promise<QuizAnswerResult> {
  const spec = questionsFor(slug);
  const day = dayMs();

  return laniakeaRepo.withPlanet<QuizAnswerResult>(userId, LANIAKEA_COURSE, slug, (row) => {
    const quiz = liveQuiz(row, spec, now);
    if (!quiz) throw new AppError(404, 'This test is over');
    if (index < quiz.answers.length) {
      const again = answerOf(quiz, index, quiz.answers[index], spec);
      return {
        change: null,
        result: { ...again, status: 'active', planet: null, leveledUp: false },
      };
    }
    if (index !== quiz.answers.length) throw new AppError(409, 'Answer the questions in order');

    const answers = [...quiz.answers, choice];
    const answer = answerOf(quiz, index, choice, spec);
    const wrong = answers.filter((c, i) => !answerOf(quiz, i, c, spec).correct).length;
    const seen = row.seen.includes(quiz.ids[index]) ? row.seen : [...row.seen, quiz.ids[index]];
    const ended = { quiz: null, quizAt: null, seen };
    // Counted once, here, since an answer sent again comes back above.
    const counted = {
      questionId: quiz.ids[index],
      pick: quiz.orders[index][choice],
      correct: answer.correct,
    };

    if (wrong >= QUIZ_OUT) {
      const retryAt = new Date(now.getTime() + QUIZ_RETRY_MS);
      const planet = planetView(slug, { ...row, retryAt }, true, true, now, day);
      return {
        change: { ...ended, retryAt },
        counted,
        result: { ...answer, status: 'failed', planet, leveledUp: false },
      };
    }
    if (answers.length === quiz.ids.length) {
      const moved = afterPass(row.level, row.passedAt, now, day);
      const planet = planetView(
        slug,
        { level: moved.level, passedAt: moved.passedAt, retryAt: null },
        true,
        true,
        now,
        day,
      );
      return {
        change: { ...ended, level: moved.level, passedAt: moved.passedAt, retryAt: null },
        counted,
        result: { ...answer, status: 'passed', planet, leveledUp: moved.leveledUp },
      };
    }
    return {
      change: { quiz: { ...quiz, answers }, quizAt: now, seen },
      counted,
      result: { ...answer, status: 'active', planet: null, leveledUp: false },
    };
  });
}
