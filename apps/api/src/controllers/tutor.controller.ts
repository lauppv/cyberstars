import type { Request, Response, NextFunction } from 'express';
import type {
  TutorAnswerEnd,
  TutorLessonRef,
  TutorLessonWork,
  TutorStreamEvent,
} from '@cyberstars/shared/tutor';
import { AppError } from '../middleware/errorHandler.js';
import { askTutor, type LessonWork } from '../services/tutor.service.js';
import * as submissions from '../services/submissions.service.js';
import * as conversations from '../services/tutor-conversations.service.js';
import * as userRepo from '../repositories/user.repository.js';
import * as usage from '../services/usage.service.js';
import { isAdmin } from '@cyberstars/shared/auth';
import { tutorConversationParamsSchema, tutorPageQuerySchema } from '../schemas/tutor.schema.js';

// Each event goes out as soon as it is written. The headers wait for the first
// one, so a failure before any event is still a plain error response.
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

// An answer longer than this, in tokens, costs 2 units of the tutor session
// instead of 1. A short answer of two to five sentences is well under it.
const LONG_ANSWER_TOKENS = 300;

// What a message costs once its answer has ended: nothing when it failed before
// any words, 1 when it was blocked before any, and otherwise 1 or 2 by what the
// model had written by then, also when it broke off.
function costOf(words: string, tokens: number, finish: TutorAnswerEnd | null): number {
  if (!words) return finish === 'blocked' ? 1 : 0;
  return tokens > LONG_ANSWER_TOKENS ? 2 : 1;
}

// The student's work on the lesson as the model gets it. The verdict is read
// from the stored attempt the student has on screen, so what the model sees of
// a test run is what the judge showed them, never what the client claims.
async function lessonWork(
  userId: number,
  lesson: TutorLessonRef,
  work: TutorLessonWork | undefined,
): Promise<LessonWork> {
  const verdict = work?.submissionId
    ? await submissions.findForLesson(
        userId,
        work.submissionId,
        lesson.courseKey,
        lesson.lessonSlug,
      )
    : null;
  return {
    ...lesson,
    code: work?.code ?? '',
    runOutput: work?.runOutput ?? '',
    verdict,
    ...(work?.checks && { checks: work.checks }),
  };
}

function sameLesson(a: TutorLessonRef | null, b: TutorLessonRef | undefined): boolean {
  return a?.courseKey === b?.courseKey && a?.lessonSlug === b?.lessonSlug;
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  // The student left mid-answer (tab closed, request cancelled): stop the model.
  const leave = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished) leave.abort();
  });

  const sentAt = new Date();
  const userId = req.user!.id;
  const lesson: TutorLessonRef | undefined = req.body.lesson;
  // The conversation the message continues; without one it starts a new one.
  let conversationId: number | undefined = req.body.conversationId;
  const question = { text: req.body.message as string, sentAt };
  let words = '';
  const written = { tokens: 0 };
  let finish: TutorAnswerEnd | null = null;
  // The units taken for this message before the model is called: what the
  // longest answer costs, or the last one left.
  let held: usage.UsageHold | null = null;

  // Gives back what the message didn't cost. A storage failure only costs the
  // student the units held.
  async function settle() {
    if (!held) return;
    try {
      await usage.release(held, held.units - costOf(words, written.tokens, finish));
    } catch (err) {
      console.error('[tutor] Could not give back tutor units:', err);
    }
  }

  // Saved into the conversation, or a new one about the lesson; the new one's
  // id is what the client keeps sending.
  async function save(answer: { text: string; finish: TutorAnswerEnd }) {
    const saved = await conversations.saveExchange(
      userId,
      conversationId ?? { lesson: lesson ?? null },
      question,
      answer,
    );
    if (saved !== null) conversationId = saved;
    return saved === null ? {} : { conversationId: saved };
  }

  try {
    // A conversation is only continued by its own student, about its own lesson.
    if (conversationId !== undefined) {
      const found = await conversations.findConversation(userId, conversationId);
      if (!found || !sameLesson(found.lesson, lesson)) {
        throw new AppError(404, 'No such conversation');
      }
    }
    // The role decides which pages the tutor may point to, read fresh like
    // every other role check.
    const role = await userRepo.getRole(userId);
    held = await usage.hold(userId, 'tutorMessage', isAdmin(role), 2);
    const answer = askTutor({
      message: question.text,
      history:
        conversationId === undefined ? [] : await conversations.recentHistory(conversationId),
      ...(lesson && { lesson: await lessonWork(userId, lesson, req.body.work) }),
      page: req.body.page,
      uiLang: req.body.lang === 'ro' ? 'ro' : 'en',
      role,
      isProd: process.env.NODE_ENV === 'production',
      signal: leave.signal,
      written,
    });
    for await (const event of answer) {
      if (event.type === 'done') {
        finish = event.finish;
        continue;
      }
      if (event.type === 'text') words += event.text;
      send(res, event);
    }
    finish ??= 'complete';
    // Saved and paid for before `done`, so a chat reloaded right after shows
    // the answer, and the usage read right after counts it.
    const saved = await save({ text: words, finish });
    await settle();
    send(res, { type: 'done', finish, ...saved });
    res.end();
  } catch (err) {
    // Words the student already saw are kept, marked as broken off. Before
    // any words nothing is saved, so the message can simply be sent again.
    const saved = words ? await save({ text: words, finish: 'interrupted' }) : {};
    await settle();
    if (leave.signal.aborted) return;
    if (!res.headersSent) return next(err);
    // Some words are already on screen: they stay, and the stream says it broke off.
    const message = err instanceof AppError ? err.message : 'Something went wrong';
    send(res, { type: 'error', message, ...saved });
    res.end();
  }
}

// The conversation in the path, as a number; anything else is no conversation.
function conversationIdOf(req: Request): number {
  const params = tutorConversationParamsSchema.safeParse(req.params);
  if (!params.success) throw new AppError(404, 'No such conversation');
  return params.data.id;
}

export async function listConversations(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await conversations.listConversations(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function getConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const { before } = tutorPageQuerySchema.parse(req.query);
    const page = await conversations.getPage(req.user!.id, conversationIdOf(req), before);
    if (!page) throw new AppError(404, 'No such conversation');
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function deleteConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await conversations.deleteConversation(req.user!.id, conversationIdOf(req));
    if (!deleted) throw new AppError(404, 'No such conversation');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
