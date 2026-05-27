import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import {
  createSessionSchema,
  execSchema,
  submitSchema,
  destroySchema,
} from '../schemas/terminal.schema.js';
import * as sessionService from '../services/terminal-session.service.js';
import { runTerminalTests } from '../services/terminal-test-runner.service.js';
import * as progressService from '../services/progress.service.js';

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSessionSchema.parse(req.body);
    const session = await sessionService.createSession(data.courseKey, data.lessonSlug);
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function exec(req: Request, res: Response, next: NextFunction) {
  try {
    const data = execSchema.parse(req.body);
    const result = await sessionService.execCommand(data.sessionId, data.command);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Session not found') {
      next(new AppError(404, 'Session not found'));
    } else {
      next(err);
    }
  }
}

export async function submit(req: Request, res: Response, next: NextFunction) {
  try {
    const data = submitSchema.parse(req.body);
    const result = await runTerminalTests(data.sessionId, data.courseKey, data.lessonSlug);

    if (result.allPassed && req.user) {
      await progressService.markComplete(req.user.id, data.courseKey, data.lessonSlug);
    }

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
    await sessionService.destroySession(sessionId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
