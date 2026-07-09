import type { Request, Response, NextFunction } from 'express';
import { runLessonTests } from '../services/lesson-tests.service.js';

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
    res.json(result);
  } catch (err) {
    next(err);
  }
}
