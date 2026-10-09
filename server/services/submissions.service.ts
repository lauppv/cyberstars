import type { LessonSubmission, Prisma } from '@prisma/client';
import * as repo from '../repositories/submissions.repository.js';
import { assertValidCourse } from './paths.js';
import { AppError } from '../middleware/errorHandler.js';
import type {
  RunTestsResponse,
  StructureFailure,
  SubmissionDetail,
  SubmissionSummary,
  TestCaseResult,
} from '../../shared/tests.js';

// Attempts kept per user and lesson; older ones are pruned on every insert so
// the table stays bounded on the 1GB VPS.
const HISTORY_CAP = 20;

function toSummary(row: repo.SubmissionSummaryRow): SubmissionSummary {
  return {
    id: row.id,
    status: row.status as SubmissionSummary['status'],
    passedCount: row.passedCount,
    total: row.total,
    runtimeMs: row.runtimeMs,
    referenceMs: row.referenceMs,
    lang: row.lang as SubmissionSummary['lang'],
    createdAt: row.createdAt.toISOString(),
  };
}

function toDetail(row: LessonSubmission): SubmissionDetail {
  return {
    ...toSummary(row),
    code: row.code,
    syntaxError: row.syntaxError,
    structureFailures: row.structureFailures as unknown as StructureFailure[],
    failedCase: row.failedCase as unknown as TestCaseResult | null,
  };
}

// Store one judge verdict in the student's history and return it as listed.
// The failed case is the one the run stopped on, kept exactly as the student
// saw it (a hidden case has no expected output to leak).
export async function record(
  userId: number,
  courseKey: string,
  lessonSlug: string,
  lang: 'en' | 'ro',
  code: string,
  result: RunTestsResponse,
): Promise<SubmissionSummary> {
  const failedCase = result.cases.find((c) => !c.passed) ?? null;
  const row = await repo.createAndPrune(
    {
      userId,
      courseKey,
      lessonSlug,
      status: result.status,
      passedCount: result.passedCount,
      total: result.total,
      runtimeMs: result.runtimeMs ?? null,
      referenceMs: result.referenceMs ?? null,
      lang,
      code,
      syntaxError: result.syntaxError ?? null,
      structureFailures: result.structureFailures as unknown as Prisma.InputJsonValue,
      failedCase: failedCase as unknown as Prisma.InputJsonValue | null,
    },
    HISTORY_CAP,
  );
  return toSummary(row);
}

// The student's attempts on one lesson, newest first.
export async function listForLesson(
  userId: number,
  courseKey: string,
  lessonSlug: string,
): Promise<SubmissionSummary[]> {
  assertValidCourse(courseKey);
  const rows = await repo.listForLesson(userId, courseKey, lessonSlug);
  return rows.map(toSummary);
}

// One attempt with its code. Someone else's attempt is a 404 like a missing
// one, so ids can't be probed for existence.
export async function getForUser(userId: number, id: number): Promise<SubmissionDetail> {
  const row = await repo.findOwned(userId, id);
  if (!row) throw new AppError(404, 'Submission not found');
  return toDetail(row);
}
