import { Prisma } from '@prisma/client';
import { QUIZ_OPTIONS } from '@cyberstars/shared/laniakea';
import { prisma } from '../config/db.js';

// The test going on, as kept on the planet: its questions by id, each one's
// options in the order shown (positions in the file's list), and the answers
// so far as positions in that shown order.
export interface StoredQuiz {
  ids: string[];
  orders: number[][];
  answers: number[];
}

export interface PlanetRow {
  lessonSlug: string;
  level: number;
  passedAt: Date | null;
  retryAt: Date | null;
  seen: string[];
  quiz: StoredQuiz | null;
  quizAt: Date | null;
}

export type PlanetChange = Partial<Omit<PlanetRow, 'lessonSlug'>>;

// One new answer to a question of the planet, counted without who gave it:
// `pick` is the option's place in the question's file.
export interface CountedAnswer {
  questionId: string;
  pick: number;
  correct: boolean;
}

const columns = {
  lessonSlug: true,
  level: true,
  passedAt: true,
  retryAt: true,
  seen: true,
  quiz: true,
  quizAt: true,
} as const;

export async function listPlanets(userId: number, courseKey: string): Promise<PlanetRow[]> {
  const rows = await prisma.laniakeaPlanet.findMany({
    where: { userId, courseKey },
    select: columns,
  });
  return rows.map((r) => ({ ...r, quiz: r.quiz as unknown as StoredQuiz | null }));
}

// Runs `decide` on the student's planet, made first if it is new, with the row
// locked for the transaction, so two tabs answering at once take turns. It says
// what to change, if anything, the answer to count, if any, when the planet
// moved, if it did, and what to hand back; it throws to change nothing.
export function withPlanet<T>(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  decide: (row: PlanetRow) => {
    change: PlanetChange | null;
    counted?: CountedAnswer;
    passedAt?: Date;
    result: T;
  },
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.laniakeaPlanet.createMany({
      data: [{ userId, courseKey, lessonSlug }],
      skipDuplicates: true,
    });
    const [row] = await tx.$queryRaw<
      {
        level: number;
        passed_at: Date | null;
        retry_at: Date | null;
        seen: string[] | null;
        quiz: StoredQuiz | null;
        quiz_at: Date | null;
      }[]
    >`
      SELECT level, passed_at, retry_at, seen, quiz, quiz_at FROM laniakea_planets
      WHERE user_id = ${userId} AND course_key = ${courseKey} AND lesson_slug = ${lessonSlug}
      FOR UPDATE`;
    const { change, counted, passedAt, result } = decide({
      lessonSlug,
      level: row.level,
      passedAt: row.passed_at,
      retryAt: row.retry_at,
      seen: row.seen ?? [],
      quiz: row.quiz,
      quizAt: row.quiz_at,
    });
    if (change) {
      const { quiz, ...rest } = change;
      await tx.laniakeaPlanet.update({
        where: { userId_courseKey_lessonSlug: { userId, courseKey, lessonSlug } },
        data: {
          ...rest,
          ...(quiz !== undefined && {
            quiz: quiz === null ? Prisma.DbNull : (quiz as unknown as Prisma.InputJsonValue),
          }),
        },
      });
    }
    if (counted) await countAnswer(tx, courseKey, lessonSlug, counted);
    if (passedAt)
      await tx.laniakeaPass.create({ data: { userId, courseKey, lessonSlug, passedAt } });
    return result;
  });
}

// Adds the answer to its question's counts, the question's row made by its
// first answer. Postgres counts the array from 1.
async function countAnswer(
  tx: Prisma.TransactionClient,
  courseKey: string,
  lessonSlug: string,
  { questionId, pick, correct }: CountedAnswer,
): Promise<void> {
  const picks = Array.from({ length: QUIZ_OPTIONS }, (_, k) => (k === pick ? 1 : 0));
  const at = pick + 1;
  await tx.$executeRaw`
    INSERT INTO laniakea_question_stats (course_key, lesson_slug, question_id, answered, wrong, picks)
    VALUES (${courseKey}, ${lessonSlug}, ${questionId}, 1, ${correct ? 0 : 1}, ${picks}::int[])
    ON CONFLICT (course_key, lesson_slug, question_id) DO UPDATE SET
      answered = laniakea_question_stats.answered + 1,
      wrong = laniakea_question_stats.wrong + EXCLUDED.wrong,
      picks[${at}::int] = laniakea_question_stats.picks[${at}::int] + 1`;
}

export interface QuestionStatRow {
  lessonSlug: string;
  questionId: string;
  answered: number;
  wrong: number;
  picks: number[];
}

// The course's questions answered at least `min` times.
export function listQuestionStats(courseKey: string, min: number): Promise<QuestionStatRow[]> {
  return prisma.laniakeaQuestionStat.findMany({
    where: { courseKey, answered: { gte: min } },
    select: { lessonSlug: true, questionId: true, answered: true, wrong: true, picks: true },
  });
}

// When each of the student's planets moved, for the activity heatmap and the streak
export async function listPasses(userId: number): Promise<Date[]> {
  const rows = await prisma.laniakeaPass.findMany({
    where: { userId },
    select: { passedAt: true },
  });
  return rows.map((r) => r.passedAt);
}

export interface RecapPlanet {
  userId: number;
  lessonSlug: string;
  level: number;
  passedAt: Date;
}

// Every planet of the course with a recap still ahead of it: conquered, not
// kept for good.
export async function listRecapPlanets(courseKey: string, below: number): Promise<RecapPlanet[]> {
  const rows = await prisma.laniakeaPlanet.findMany({
    where: { courseKey, level: { gte: 1, lt: below }, passedAt: { not: null } },
    select: { userId: true, lessonSlug: true, level: true, passedAt: true },
  });
  return rows.map((r) => ({ ...r, passedAt: r.passedAt! }));
}

export interface PlayerRow {
  userId: number;
  seenAt: Date | null;
  notifiedAt: Date | null;
}

export function listPlayers(userIds: number[]): Promise<PlayerRow[]> {
  return prisma.laniakeaPlayer.findMany({
    where: { userId: { in: userIds } },
    select: { userId: true, seenAt: true, notifiedAt: true },
  });
}

export async function markSeen(userId: number, at: Date): Promise<void> {
  await prisma.laniakeaPlayer.upsert({
    where: { userId },
    create: { userId, seenAt: at },
    update: { seenAt: at },
  });
}

export async function markNotified(userId: number, at: Date): Promise<void> {
  await prisma.laniakeaPlayer.upsert({
    where: { userId },
    create: { userId, notifiedAt: at },
    update: { notifiedAt: at },
  });
}
