import type { Request, Response, NextFunction } from 'express';
import type { TutorAnswerEnd, TutorLessonRef, TutorStreamEvent } from '@cyberstars/shared/tutor';
import { AppError } from '../middleware/errorHandler.js';
import { askTutor } from '../services/tutor.service.js';
import * as conversations from '../services/tutor-conversations.service.js';
import * as userRepo from '../repositories/user.repository.js';
import { tutorLessonSchema, tutorPageQuerySchema } from '../schemas/tutor.schema.js';

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

  const sentAt = new Date();
  const key = conversations.conversationKey(req.user!.id, req.body.lesson);
  const question = { text: req.body.message as string, sentAt };
  let words = '';
  const written = { tokens: 0 };

  try {
    // The role decides which pages the tutor may point to, read fresh like
    // every other role check.
    const role = await userRepo.getRole(req.user!.id);
    const answer = askTutor({
      message: question.text,
      history: await conversations.recentHistory(key),
      page: req.body.page,
      uiLang: req.body.lang === 'ro' ? 'ro' : 'en',
      role,
      isProd: process.env.NODE_ENV === 'production',
      signal: leave.signal,
      written,
    });
    let finish: TutorAnswerEnd = 'complete';
    for await (const event of answer) {
      if (event.type === 'done') {
        finish = event.finish;
        continue;
      }
      if (event.type === 'text') words += event.text;
      send(res, event);
    }
    // Saved before `done`, so a chat reloaded right after shows the answer.
    await conversations.saveExchange(key, question, { text: words, finish });
    send(res, { type: 'done', finish });
    res.end();
  } catch (err) {
    // Words the student already saw are kept, marked as broken off. Before
    // any words nothing is saved, so the message can simply be sent again.
    if (words) {
      await conversations.saveExchange(key, question, { text: words, finish: 'interrupted' });
    }
    if (leave.signal.aborted) return;
    if (!res.headersSent) return next(err);
    // Some words are already on screen: they stay, and the stream says it broke off.
    const message = err instanceof AppError ? err.message : 'Something went wrong';
    send(res, { type: 'error', message });
    res.end();
  }
}

// The general conversation's routes have no lesson in their path.
function keyFor(req: Request) {
  if (req.params.courseKey === undefined) return conversations.conversationKey(req.user!.id);
  const lesson = tutorLessonSchema.safeParse(req.params);
  if (!lesson.success) throw new AppError(404, 'No such lesson');
  return conversations.conversationKey(req.user!.id, lesson.data as TutorLessonRef);
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const { before } = tutorPageQuerySchema.parse(req.query);
    res.json(await conversations.getPage(keyFor(req), before));
  } catch (err) {
    next(err);
  }
}

export async function deleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    await conversations.deleteConversation(keyFor(req));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
