import type { Request, Response, NextFunction } from 'express';
import { runLessonTests } from '../services/lesson-tests.service.js';
import * as progressService from '../services/progress.service.js';
import * as submissionsService from '../services/submissions.service.js';
import { AppError } from '../middleware/errorHandler.js';

// Same owner keyspace as the editor's WebSocket runs (ws-run.ts), so a test run
// reuses the owner's warm container instead of starting a second one.
export function resolveOwnerKey(req: Request): string | null {
  if (req.user?.id) return `user:${req.user.id}`;
  const guestId = req.cookies?.guestId;
  return guestId ? `guest:${guestId}` : null;
}

export async function runTests(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseKey, lessonSlug } = req.params;
    const result = await runLessonTests(
      resolveOwnerKey(req)!,
      courseKey,
      lessonSlug,
      req.body.code,
      req.body.lang,
    );
    // Completion is server-authoritative: only a judge-confirmed pass marks the
    // lesson complete, and only for a logged-in user (guests have no progress).
    // There is no client-writable completion endpoint, so this can't be spoofed.
    if (result.status === 'passed' && req.user?.id) {
      try {
        await progressService.markComplete(req.user.id, courseKey, lessonSlug);
      } catch (err) {
        // Don't turn a passing verdict into a 500; the student's next passing
        // run (or refresh-triggered progress fetch) will reconcile.
        console.error(
          `[tests] failed to persist completion for user ${req.user.id} on ${courseKey}/${lessonSlug}:`,
          err,
        );
      }
    }
    // Every verdict of a logged-in student goes into the lesson's history
    // (guests keep none). Like completion, a storage failure must not cost the
    // student the verdict: log it and answer without `submission`.
    if (req.user?.id) {
      try {
        result.submission = await submissionsService.record(
          req.user.id,
          courseKey,
          lessonSlug,
          req.body.lang === 'ro' ? 'ro' : 'en',
          req.body.code,
          result,
        );
      } catch (err) {
        console.error(
          `[tests] failed to record the submission for user ${req.user.id} on ${courseKey}/${lessonSlug}:`,
          err,
        );
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function listSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseKey, lessonSlug } = req.params;
    res.json(await submissionsService.listForLesson(req.user!.id, courseKey, lessonSlug));
  } catch (err) {
    next(err);
  }
}

export async function getSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    // Capped at Postgres INT so an oversized id is a 400, not a driver error.
    if (!Number.isInteger(id) || id <= 0 || id > 2_147_483_647) {
      throw new AppError(400, 'Invalid submission id');
    }
    res.json(await submissionsService.getForUser(req.user!.id, id));
  } catch (err) {
    next(err);
  }
}
