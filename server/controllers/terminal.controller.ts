import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../middleware/errorHandler.js';
import { destroySchema } from '../schemas/terminal.schema.js';
import * as sessionService from '../services/terminal-session.service.js';

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseKey, lessonSlug } = req.body;
    const session = await sessionService.createSession(courseKey, lessonSlug, req.user!.id);
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function exec(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, command } = req.body;
    const result = await sessionService.execCommand(sessionId, command, req.user!.id);
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
    await sessionService.destroySession(sessionId, req.user!.id);
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      next(new AppError(400, 'Invalid session ID'));
    } else {
      next(err);
    }
  }
}
