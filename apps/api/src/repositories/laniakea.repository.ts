import { Prisma } from '@prisma/client';
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
// what to change, if anything, and what to hand back; it throws to change
// nothing.
export function withPlanet<T>(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  decide: (row: PlanetRow) => { change: PlanetChange | null; result: T },
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
    const { change, result } = decide({
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
    return result;
  });
}

export interface RecapPlanet {
  userId: number;
  level: number;
  passedAt: Date;
}

// Every planet of the course with a recap still ahead of it: conquered, not
// kept for good.
export async function listRecapPlanets(courseKey: string, below: number): Promise<RecapPlanet[]> {
  const rows = await prisma.laniakeaPlanet.findMany({
    where: { courseKey, level: { gte: 1, lt: below }, passedAt: { not: null } },
    select: { userId: true, level: true, passedAt: true },
  });
  return rows.map((r) => ({ userId: r.userId, level: r.level, passedAt: r.passedAt! }));
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
