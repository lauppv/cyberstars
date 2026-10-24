// Laniakea, the explorer game: every lesson of a course is a planet. A student
// conquers a planet by passing a test of multiple-choice questions on its
// lesson, then keeps it by passing it again after longer and longer breaks,
// until it is theirs for good. Shared by client and server so the rules shown
// and the rules enforced can never disagree.

// The course whose lessons are the planets, and how many of its lessons open
// the game.
export const LANIAKEA_COURSE = 'python';
export const LANIAKEA_UNLOCK_LESSONS = 3;

// A test: QUIZ_LENGTH questions drawn from the lesson's pool, four options
// each. It ends as soon as QUIZ_OUT answers are wrong, since it can no longer
// reach QUIZ_PASS right ones; otherwise every question is asked.
export const QUIZ_LENGTH = 10;
const QUIZ_PASS = 6;
export const QUIZ_OUT = QUIZ_LENGTH - QUIZ_PASS + 1;
export const QUIZ_OPTIONS = 4;

// A failed test opens the next try this much later. A test left untouched this
// long is dropped, so it never holds the planet.
export const QUIZ_RETRY_MS = 5 * 60 * 1000;
export const QUIZ_IDLE_MS = 30 * 60 * 1000;

// The days a conquered planet waits before each recap. A pass after the wait
// moves it one step up; a pass before it is practice and changes nothing. A
// planet whose last recap is passed is the student's for good.
export const RECAP_DAYS: readonly number[] = [1, 2, 4, 8, 16, 32, 64];

// A planet's level counts the tests that moved it: 0 not conquered yet, 1 just
// conquered, FOREVER_LEVEL once every recap is passed.
export const FOREVER_LEVEL = RECAP_DAYS.length + 1;

export const DAY_MS = 24 * 60 * 60 * 1000;

// When the planet's next recap opens, or null when there is none to wait for:
// not conquered yet, or kept for good.
export function nextRecapAt(level: number, passedAt: Date | null, dayMs = DAY_MS): Date | null {
  if (!passedAt || level < 1 || level >= FOREVER_LEVEL) return null;
  return new Date(passedAt.getTime() + RECAP_DAYS[level - 1] * dayMs);
}

export interface LaniakeaPlanet {
  slug: string;
  // The lesson is completed, so the planet can be conquered.
  lessonDone: boolean;
  // The lesson has questions; without them the planet waits.
  hasQuiz: boolean;
  level: number;
  // ISO times: the last pass that moved the planet, when its next recap opens,
  // and, after a failed test, when the next try opens (null once it has).
  passedAt: string | null;
  nextRecapAt: string | null;
  retryAt: string | null;
}

export interface LaniakeaState {
  courseKey: string;
  unlocked: boolean;
  // Lessons of the course completed, against the number that opens the game.
  lessonsDone: number;
  unlockAt: number;
  // The server's clock, so countdowns don't follow a wrong one on the device.
  serverNow: string;
  // Every lesson of the course, in its order.
  planets: LaniakeaPlanet[];
}

// What a test is for: the first conquest, a recap that moves the planet up, or
// practice, which changes nothing.
export type QuizMode = 'conquer' | 'recap' | 'practice';

interface QuizQuestion {
  text: string;
  // A snippet the question is about, shown as code.
  code: string | null;
  // What a program prints, shown under the code: the output the student has to
  // get with a line, a value or a whole program.
  output: string | null;
  // In the order shown, which is shuffled for each test.
  options: string[];
}

export interface QuizAnswer {
  // Positions in the options as shown.
  choice: number;
  correct: boolean;
  correctChoice: number;
}

export interface QuizView {
  slug: string;
  mode: QuizMode;
  questions: QuizQuestion[];
  // The questions answered so far, in order: a test opened again picks up where
  // it was.
  answers: QuizAnswer[];
}

type QuizStatus = 'active' | 'passed' | 'failed';

export interface QuizAnswerResult extends QuizAnswer {
  status: QuizStatus;
  // Once the test is over, the planet as it now stands, and whether the test
  // moved it up.
  planet: LaniakeaPlanet | null;
  leveledUp: boolean;
}
