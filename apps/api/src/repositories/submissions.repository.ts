import { Prisma } from '@prisma/client';
import type { LessonSubmission } from '@prisma/client';
import { prisma } from '../config/db.js';

export interface CreateSubmissionInput {
  userId: number;
  courseKey: string;
  lessonSlug: string;
  status: string;
  passedCount: number;
  total: number;
  runtimeMs: number | null;
  referenceMs: number | null;
  lang: string;
  language: string;
  code: string;
  syntaxError: string | null;
  structureFailures: Prisma.InputJsonValue;
  failedCase: Prisma.InputJsonValue | null;
}

// Everything the history list shows; the code and the failure details stay
// out until one attempt is opened.
const summarySelect = {
  id: true,
  status: true,
  passedCount: true,
  total: true,
  runtimeMs: true,
  referenceMs: true,
  lang: true,
  language: true,
  createdAt: true,
} satisfies Prisma.LessonSubmissionSelect;

export type SubmissionSummaryRow = Prisma.LessonSubmissionGetPayload<{
  select: typeof summarySelect;
}>;

// Insert the attempt and drop this user's attempts on the lesson beyond the
// newest `cap`, in one transaction so the history never outgrows the cap.
// Newest is the highest id, which is monotonic with insertion order. With
// `keepPassed` the newest passing attempt stays however old it is, one past
// the cap (a web lesson's next lesson starts from it, CYB-119).
export function createAndPrune(
  input: CreateSubmissionInput,
  cap: number,
  keepPassed = false,
): Promise<LessonSubmission> {
  const { userId, courseKey, lessonSlug } = input;
  return prisma.$transaction(async (tx) => {
    const row = await tx.lessonSubmission.create({
      data: { ...input, failedCase: input.failedCase ?? Prisma.JsonNull },
    });
    const boundary = await tx.lessonSubmission.findMany({
      where: { userId, courseKey, lessonSlug },
      orderBy: { id: 'desc' },
      skip: cap,
      take: 1,
      select: { id: true },
    });
    if (boundary.length > 0) {
      const passed = keepPassed
        ? await tx.lessonSubmission.findFirst({
            where: { userId, courseKey, lessonSlug, status: 'passed' },
            orderBy: { id: 'desc' },
            select: { id: true },
          })
        : null;
      await tx.lessonSubmission.deleteMany({
        where: {
          userId,
          courseKey,
          lessonSlug,
          id: passed ? { lte: boundary[0].id, not: passed.id } : { lte: boundary[0].id },
        },
      });
    }
    return row;
  });
}

// The code of the student's newest passing attempt on a lesson, or null.
export async function findNewestPassedCode(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<string | null> {
  const row = await prisma.lessonSubmission.findFirst({
    where: { userId, courseKey, lessonSlug, status: 'passed' },
    orderBy: { id: 'desc' },
    select: { code: true },
  });
  return row?.code ?? null;
}

export function listForLesson(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<SubmissionSummaryRow[]> {
  return prisma.lessonSubmission.findMany({
    where: { userId, courseKey, lessonSlug },
    orderBy: { id: 'desc' },
    select: summarySelect,
  });
}

// Scoped by userId, so another student's attempt reads exactly like a missing one.
export function findOwned(userId: number, id: number): Promise<LessonSubmission | null> {
  return prisma.lessonSubmission.findFirst({ where: { id, userId } });
}
