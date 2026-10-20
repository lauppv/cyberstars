import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ipKeyGenerator } from 'express-rate-limit';
import { AppError } from '../middleware/errorHandler.js';
import { destroySchema } from '../schemas/terminal.schema.js';
import * as sessionService from '../services/terminal-session.service.js';
import { runTerminalTests } from '../services/terminal-tests.service.js';
import * as progressService from '../services/progress.service.js';
import { requestWaitKey } from './runs.controller.js';

export function resolveOwnerKey(req: Request): string | null {
  if (req.user?.id) return `user:${req.user.id}`;
  return req.cookies?.guestId ?? null;
}

// A guest's network, which their sandboxes count against (guest-sandboxes.ts),
// keyed like the per-IP rate limits: an IPv6 address counts as its /56 block.
export function guestIpOf(req: Request): string | undefined {
  return req.user ? undefined : ipKeyGenerator(req.ip ?? '');
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseKey, lessonSlug, lang } = req.body;
    const session = await sessionService.createSession(
      courseKey,
      lessonSlug,
      resolveOwnerKey(req)!,
      lang,
      guestIpOf(req),
    );
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function exec(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, command } = req.body;
    const result = await sessionService.execCommand(
      sessionId,
      command,
      resolveOwnerKey(req)!,
      requestWaitKey(req),
    );
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Session not found') {
      next(new AppError(404, 'Session not found'));
    } else {
      next(err);
    }
  }
}

export async function checkTests(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, courseKey, lessonSlug, lang } = req.body;
    const result = await runTerminalTests(
      resolveOwnerKey(req)!,
      sessionId,
      courseKey,
      lessonSlug,
      lang,
    );
    // Server-authoritative completion: only a judge-confirmed pass marks the
    // lesson complete, and only for a logged-in user (guests have no progress).
    if (result.status === 'passed' && req.user?.id) {
      try {
        await progressService.markComplete(req.user.id, courseKey, lessonSlug);
      } catch (err) {
        console.error(
          `[terminal-tests] failed to persist completion for user ${req.user.id} on ${courseKey}/${lessonSlug}:`,
          err,
        );
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId } = destroySchema.parse({ sessionId: req.params.sessionId });
    await sessionService.destroySession(sessionId, resolveOwnerKey(req)!);
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      next(new AppError(400, 'Invalid session ID'));
    } else {
      next(err);
    }
  }
}
