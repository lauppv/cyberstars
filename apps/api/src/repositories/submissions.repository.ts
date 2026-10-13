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
  createdAt: true,
} satisfies Prisma.LessonSubmissionSelect;

export type SubmissionSummaryRow = Prisma.LessonSubmissionGetPayload<{
  select: typeof summarySelect;
}>;

// Insert the attempt and drop this user's attempts on the lesson beyond the
// newest `cap`, in one transaction so the history never outgrows the cap.
// Newest is the highest id, which is monotonic with insertion order.
export function createAndPrune(
  input: CreateSubmissionInput,
  cap: number,
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
      await tx.lessonSubmission.deleteMany({
        where: { userId, courseKey, lessonSlug, id: { lte: boundary[0].id } },
      });
    }
    return row;
  });
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
