import type { Request, Response, NextFunction } from 'express';
import type { TutorStreamEvent } from '@cyberstars/shared/tutor';
import { AppError } from '../middleware/errorHandler.js';
import { askTutor } from '../services/tutor.service.js';
import * as userRepo from '../repositories/user.repository.js';

// Each event goes out as soon as it is written. The headers wait for the first
// one, so a failure before any words is still a plain error response.
function send(res: Response, event: TutorStreamEvent) {
  if (!res.headersSent) {
    res.set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      // nginx would otherwise hold the pieces back and send them all at once.
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();
  }
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  // The student left mid-answer (tab closed, request cancelled): stop the model.
  const leave = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) leave.abort();
  });

  try {
    // The role decides which pages the tutor may point to, read fresh like
    // every other role check.
    const role = await userRepo.getRole(req.user!.id);
    const answer = askTutor({
      message: req.body.message,
      page: req.body.page,
      uiLang: req.body.lang === 'ro' ? 'ro' : 'en',
      role,
      isProd: process.env.NODE_ENV === 'production',
      signal: leave.signal,
    });
    for await (const event of answer) send(res, event);
    res.end();
  } catch (err) {
    if (leave.signal.aborted) return;
    if (!res.headersSent) return next(err);
    // Some words are already on screen: they stay, and the stream says it broke off.
    const message = err instanceof AppError ? err.message : 'Something went wrong';
    send(res, { type: 'error', message });
    res.end();
  }
}
