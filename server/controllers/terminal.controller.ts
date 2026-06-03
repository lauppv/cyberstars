import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import { destroySchema } from '../schemas/terminal.schema.js';
import * as sessionService from '../services/terminal-session.service.js';

export function resolveOwnerKey(req: Request): string | null {
  if (req.user?.id) return `user:${req.user.id}`;
  return req.cookies?.guestId ?? null;
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseKey, lessonSlug } = req.body;
    const session = await sessionService.createSession(
      courseKey,
      lessonSlug,
      resolveOwnerKey(req)!,
    );
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function exec(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, command } = req.body;
    const result = await sessionService.execCommand(sessionId, command, resolveOwnerKey(req)!);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Session not found') {
      next(new AppError(404, 'Session not found'));
    } else {
      next(err);
    }
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
