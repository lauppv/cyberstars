import { EventEmitter } from 'node:events';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import type { TutorStreamEvent } from '@cyberstars/shared/tutor';
import { AppError } from '../middleware/errorHandler.js';

const mockTutor = { askTutor: vi.fn() };
vi.mock('../services/tutor.service.js', () => mockTutor);

const mockUserRepo = { getRole: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const mockStudent = { readStudent: vi.fn() };
vi.mock('../services/tutor-student.service.js', () => mockStudent);

const mockConversations = {
  listConversations: vi.fn(),
  findConversation: vi.fn(),
  recentHistory: vi.fn(),
  saveExchange: vi.fn(),
  getPage: vi.fn(),
  deleteConversation: vi.fn(),
};
vi.mock('../services/tutor-conversations.service.js', () => mockConversations);

const mockUsage = { hold: vi.fn(), release: vi.fn() };
vi.mock('../services/usage.service.js', () => mockUsage);

const mockSubmissions = { findForLesson: vi.fn() };
vi.mock('../services/submissions.service.js', () => mockSubmissions);

const { chat, getConversation, deleteConversation, listConversations } =
  await import('./tutor.controller.js');

// The id a new conversation gets when its first exchange is saved.
const NEW_ID = 21;
const held = { userId: 5, action: 'tutorMessage', windowStart: new Date(0), units: 2 };
const history = [{ role: 'student', text: 'what is a loop?' }];

function mockReq(body: Record<string, unknown> = {}): Request {
  return {
    body: { message: 'which lesson has loops?', page: '/courses', lang: 'ro', ...body },
    user: { id: 5 },
  } as unknown as Request;
}

// What was saved for the exchange, if anything.
function saved() {
  return mockConversations.saveExchange.mock.calls.map(([userId, to, question, answer]) => {
    expect(userId).toBe(5);
    return { to, question: question.text, answer };
  });
}

// A response that records what was written and closes like Node's: `close`
// after end(), or on its own when the client goes away.
function mockRes() {
  const res = Object.assign(new EventEmitter(), {
    headersSent: false,
    writableFinished: false,
    set: vi.fn(),
    flushHeaders: vi.fn(() => {
      res.headersSent = true;
    }),
    write: vi.fn(),
    end: vi.fn(() => {
      res.writableFinished = true;
      res.emit('close');
    }),
  });
  return res;
}

function written(res: ReturnType<typeof mockRes>): TutorStreamEvent[] {
  return res.write.mock.calls.map(([chunk]) => {
    expect(chunk).toMatch(/^data: .*\n\n$/);
    return JSON.parse(String(chunk).slice(6));
  });
}

async function* answer(...events: TutorStreamEvent[]) {
  for (const event of events) yield event;
}
async function* failing(err: Error, ...events: TutorStreamEvent[]) {
  yield* answer(...events);
  throw err;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUserRepo.getRole.mockResolvedValue('USER');
  mockStudent.readStudent.mockResolvedValue(null);
  mockConversations.recentHistory.mockResolvedValue(history);
  mockConversations.saveExchange.mockResolvedValue(NEW_ID);
  mockUsage.hold.mockResolvedValue(held);
});

describe('chat', () => {
  it("asks the tutor with the student's role and streams its answer into a new conversation", async () => {
    mockTutor.askTutor.mockReturnValue(
      answer(
        { type: 'text', text: 'Try the ' },
        { type: 'text', text: 'For lesson.' },
        { type: 'done', finish: 'complete' },
      ),
    );
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(mockUserRepo.getRole).toHaveBeenCalledWith(5);
    expect(mockConversations.findConversation).not.toHaveBeenCalled();
    expect(mockConversations.recentHistory).not.toHaveBeenCalled();
    expect(mockTutor.askTutor).toHaveBeenCalledWith({
      message: 'which lesson has loops?',
      history: [],
      page: '/courses',
      uiLang: 'ro',
      about: null,
      role: 'USER',
      isProd: false,
      signal: expect.any(AbortSignal),
      written: { tokens: 0 },
    });
    expect(res.set).toHaveBeenCalledOnce();
    expect(res.set).toHaveBeenCalledWith({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    });
    expect(res.flushHeaders).toHaveBeenCalledOnce();
    expect(written(res)).toEqual([
      { type: 'text', text: 'Try the ' },
      { type: 'text', text: 'For lesson.' },
      { type: 'done', finish: 'complete', conversationId: NEW_ID },
    ]);
    expect(res.end).toHaveBeenCalledOnce();
    expect(mockTutor.askTutor.mock.calls[0][0].signal.aborted).toBe(false);
    expect(saved()).toEqual([
      {
        to: { lesson: null },
        question: 'which lesson has loops?',
        answer: { text: 'Try the For lesson.', finish: 'complete' },
      },
    ]);
  });

  it('tells the tutor what it knows about the student, read for this message', async () => {
    const about = { level: 'advanced', interests: ['c'], courses: [], unfinished: null };
    mockStudent.readStudent.mockResolvedValue(about);
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'complete' }));

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockStudent.readStudent).toHaveBeenCalledWith(5);
    expect(mockTutor.askTutor).toHaveBeenCalledWith(expect.objectContaining({ about }));
  });

  it('continues a conversation of the student’s with its history', async () => {
    mockConversations.findConversation.mockResolvedValue({ id: 9, lesson: null });
    mockConversations.saveExchange.mockResolvedValue(9);
    mockTutor.askTutor.mockReturnValue(
      answer({ type: 'text', text: 'Yes.' }, { type: 'done', finish: 'complete' }),
    );
    const res = mockRes();

    await chat(mockReq({ conversationId: 9 }), res as unknown as Response, vi.fn());

    expect(mockConversations.findConversation).toHaveBeenCalledWith(5, 9);
    expect(mockConversations.recentHistory).toHaveBeenCalledWith(9);
    expect(mockTutor.askTutor.mock.calls[0][0].history).toBe(history);
    expect(saved()[0].to).toBe(9);
    expect(written(res).at(-1)).toEqual({ type: 'done', finish: 'complete', conversationId: 9 });
  });

  it.each([
    ['is not the student’s', null, undefined],
    [
      'is about another lesson',
      { id: 9, lesson: { courseKey: 'python', lessonSlug: 'while' } },
      { courseKey: 'python', lessonSlug: 'for' },
    ],
    [
      'is about a lesson but the message is general',
      { id: 9, lesson: { courseKey: 'python', lessonSlug: 'for' } },
      undefined,
    ],
    [
      'is general but the message is about a lesson',
      { id: 9, lesson: null },
      { courseKey: 'python', lessonSlug: 'for' },
    ],
  ])('answers 404 before any model call when the conversation %s', async (_, found, lesson) => {
    mockConversations.findConversation.mockResolvedValue(found);
    const next = vi.fn();

    await chat(mockReq({ conversationId: 9, lesson }), mockRes() as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    expect(mockUsage.hold).not.toHaveBeenCalled();
    expect(mockTutor.askTutor).not.toHaveBeenCalled();
  });

  it('leaves the id out of `done` when the exchange could not be saved', async () => {
    mockConversations.saveExchange.mockResolvedValue(null);
    mockTutor.askTutor.mockReturnValue(
      answer({ type: 'text', text: 'Hi' }, { type: 'done', finish: 'complete' }),
    );
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(written(res).at(-1)).toEqual({ type: 'done', finish: 'complete' });
  });

  it("saves the exchange before saying it's done", async () => {
    mockTutor.askTutor.mockReturnValue(
      answer({ type: 'text', text: 'Hi' }, { type: 'done', finish: 'cut' }),
    );
    const res = mockRes();
    mockConversations.saveExchange.mockImplementationOnce(async () => {
      expect(res.write).toHaveBeenCalledTimes(1);
      return NEW_ID;
    });

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(saved()[0].answer).toEqual({ text: 'Hi', finish: 'cut' });
    expect(written(res).at(-1)).toEqual({ type: 'done', finish: 'cut', conversationId: NEW_ID });
  });

  it('starts a new conversation about the lesson a first lesson message is about', async () => {
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));
    const lesson = { courseKey: 'algo-python', lessonSlug: 'anagram-check' };

    await chat(mockReq({ lesson }), mockRes() as unknown as Response, vi.fn());

    expect(saved()).toEqual([
      {
        to: { lesson },
        question: 'which lesson has loops?',
        answer: { text: '', finish: 'blocked' },
      },
    ]);
  });

  it("continues a lesson's conversation when the message is about that lesson", async () => {
    const lesson = { courseKey: 'python', lessonSlug: 'for' };
    mockConversations.findConversation.mockResolvedValue({ id: 9, lesson });
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));

    await chat(mockReq({ lesson, conversationId: 9 }), mockRes() as unknown as Response, vi.fn());

    expect(mockConversations.recentHistory).toHaveBeenCalledWith(9);
    expect(saved()[0].to).toBe(9);
  });

  it("gives the tutor the student's work, with the verdict read from their attempt", async () => {
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));
    const verdict = { id: 7, status: 'failed', failedCase: { index: 1, visible: false } };
    mockSubmissions.findForLesson.mockResolvedValue(verdict);
    const lesson = { courseKey: 'python', lessonSlug: 'for' };
    const work = { code: 'for i in x:', runOutput: 'oops', submissionId: 7 };

    await chat(mockReq({ lesson, work }), mockRes() as unknown as Response, vi.fn());

    expect(mockSubmissions.findForLesson).toHaveBeenCalledWith(5, 7, 'python', 'for');
    expect(mockTutor.askTutor).toHaveBeenCalledWith(
      expect.objectContaining({
        lesson: { ...lesson, code: 'for i in x:', runOutput: 'oops', verdict },
      }),
    );
  });

  it("gives no verdict when no attempt is on screen or it is not the lesson's", async () => {
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));
    const lesson = { courseKey: 'python', lessonSlug: 'for' };

    await chat(
      mockReq({ lesson, work: { code: 'x', runOutput: '' } }),
      mockRes() as unknown as Response,
      vi.fn(),
    );
    expect(mockSubmissions.findForLesson).not.toHaveBeenCalled();
    expect(mockTutor.askTutor.mock.calls[0][0].lesson).toEqual({
      ...lesson,
      code: 'x',
      runOutput: '',
      verdict: null,
    });

    mockSubmissions.findForLesson.mockResolvedValue(null);
    await chat(
      mockReq({ lesson, work: { code: 'x', runOutput: '', submissionId: 99 } }),
      mockRes() as unknown as Response,
      vi.fn(),
    );
    expect(mockTutor.askTutor.mock.calls[1][0].lesson.verdict).toBeNull();
  });

  it("passes on the checks of a Linux lesson's last Run Tests", async () => {
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));
    const lesson = { courseKey: 'linux', lessonSlug: 'chmod-numeric' };
    const checks = [{ passed: false, text: 'notes.txt can be read' }];

    await chat(
      mockReq({ lesson, work: { code: '', runOutput: '$ ls', checks } }),
      mockRes() as unknown as Response,
      vi.fn(),
    );

    expect(mockTutor.askTutor.mock.calls[0][0].lesson).toEqual({
      ...lesson,
      code: '',
      runOutput: '$ ls',
      verdict: null,
      checks,
    });
  });

  it('sends no lesson work in the general conversation', async () => {
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockTutor.askTutor.mock.calls[0][0]).not.toHaveProperty('lesson');
  });

  it('falls back to English when the client sends no language', async () => {
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));

    await chat(mockReq({ lang: undefined }), mockRes() as unknown as Response, vi.fn());

    expect(mockTutor.askTutor).toHaveBeenCalledWith(expect.objectContaining({ uiLang: 'en' }));
  });

  it('tells the tutor it runs on prod when it does', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    mockTutor.askTutor.mockReturnValue(answer({ type: 'done', finish: 'blocked' }));

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockTutor.askTutor).toHaveBeenCalledWith(expect.objectContaining({ isProd: true }));
    vi.unstubAllEnvs();
  });

  it('passes an error before any words on to the error handler', async () => {
    const err = new AppError(502, 'The tutor could not answer right now, please try again');
    mockTutor.askTutor.mockReturnValue(failing(err));
    const next = vi.fn();
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.flushHeaders).not.toHaveBeenCalled();
    expect(res.write).not.toHaveBeenCalled();
    expect(mockConversations.saveExchange).not.toHaveBeenCalled();
  });

  it('ends the stream with an error event when it breaks after some words', async () => {
    mockTutor.askTutor.mockReturnValue(
      failing(new AppError(502, 'The tutor could not answer right now, please try again'), {
        type: 'text',
        text: 'Recursion is',
      }),
    );
    const next = vi.fn();
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(written(res)).toEqual([
      { type: 'text', text: 'Recursion is' },
      {
        type: 'error',
        message: 'The tutor could not answer right now, please try again',
        conversationId: NEW_ID,
      },
    ]);
    expect(res.end).toHaveBeenCalledOnce();
    expect(saved()[0].answer).toEqual({ text: 'Recursion is', finish: 'interrupted' });
  });

  it('ends the stream with an error event, saving and charging nothing, when it breaks after a lookup', async () => {
    mockTutor.askTutor.mockReturnValue(
      failing(new AppError(502, 'The tutor could not answer right now, please try again'), {
        type: 'status',
        lookup: 'search',
      }),
    );
    const next = vi.fn();
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(written(res)).toEqual([
      { type: 'status', lookup: 'search' },
      { type: 'error', message: 'The tutor could not answer right now, please try again' },
    ]);
    expect(mockConversations.saveExchange).not.toHaveBeenCalled();
    expect(mockUsage.release).toHaveBeenCalledWith(held, 2);
  });

  it('saves only the words written after a restart', async () => {
    mockTutor.askTutor.mockReturnValue(
      answer(
        { type: 'text', text: 'Almanahul ori' },
        { type: 'restart' },
        { type: 'text', text: 'Almanahul are lecturi scurte.' },
        { type: 'done', finish: 'complete' },
      ),
    );
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(written(res)).toEqual([
      { type: 'text', text: 'Almanahul ori' },
      { type: 'restart' },
      { type: 'text', text: 'Almanahul are lecturi scurte.' },
      { type: 'done', finish: 'complete', conversationId: NEW_ID },
    ]);
    expect(saved()[0].answer).toEqual({
      text: 'Almanahul are lecturi scurte.',
      finish: 'complete',
    });
  });

  it('keeps an unexpected error message to itself', async () => {
    mockTutor.askTutor.mockReturnValue(
      failing(new Error('socket hang up at 10.0.0.3'), { type: 'text', text: 'Hi' }),
    );
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(written(res).at(-1)).toEqual({
      type: 'error',
      message: 'Something went wrong',
      conversationId: NEW_ID,
    });
  });

  it('stops the tutor when the student leaves mid-answer, and writes nothing more', async () => {
    const res = mockRes();
    const next = vi.fn();
    mockTutor.askTutor.mockImplementation(async function* (opts: { signal: AbortSignal }) {
      yield { type: 'text', text: 'Recursion is' };
      // The tab closes while the model is still writing.
      res.emit('close');
      expect(opts.signal.aborted).toBe(true);
      throw opts.signal.reason;
    });

    await chat(mockReq(), res as unknown as Response, next);

    expect(written(res)).toEqual([{ type: 'text', text: 'Recursion is' }]);
    expect(res.end).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(saved()[0].answer).toEqual({ text: 'Recursion is', finish: 'interrupted' });
  });

  it('saves nothing when the student leaves before any words', async () => {
    const res = mockRes();
    const next = vi.fn();
    mockTutor.askTutor.mockImplementation(async function* (opts: { signal: AbortSignal }) {
      yield* answer();
      res.emit('close');
      throw opts.signal.reason;
    });

    await chat(mockReq(), res as unknown as Response, next);

    expect(mockConversations.saveExchange).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});

// An answer of `tokens` tokens: the tutor counts them as it writes.
function answerOf(tokens: number, ...events: TutorStreamEvent[]) {
  return (opts: { written: { tokens: number } }) => {
    opts.written.tokens = tokens;
    return answer(...events);
  };
}

describe('chat: the tutor session', () => {
  it('holds 2 units before asking the model, and gives 1 back for a short answer', async () => {
    mockTutor.askTutor.mockImplementation(
      answerOf(80, { type: 'text', text: 'Loops repeat.' }, { type: 'done', finish: 'complete' }),
    );
    const res = mockRes();
    mockUsage.release.mockImplementationOnce(async () => {
      // Paid for before `done`, so the usage read right after counts it.
      expect(written(res).map((e) => e.type)).toEqual(['text']);
    });

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(mockUsage.hold).toHaveBeenCalledWith(5, 'tutorMessage', false, 2);
    expect(mockUsage.hold.mock.invocationCallOrder[0]).toBeLessThan(
      mockTutor.askTutor.mock.invocationCallOrder[0],
    );
    expect(mockUsage.release).toHaveBeenCalledWith(held, 1);
  });

  it('keeps both units for a long answer', async () => {
    mockTutor.askTutor.mockImplementation(
      answerOf(301, { type: 'text', text: 'Recursion...' }, { type: 'done', finish: 'complete' }),
    );

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockUsage.release).toHaveBeenCalledWith(held, 0);
  });

  it('charges an answer cut by the length limit as long', async () => {
    mockTutor.askTutor.mockImplementation(
      answerOf(600, { type: 'text', text: 'Once upon' }, { type: 'done', finish: 'cut' }),
    );

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockUsage.release).toHaveBeenCalledWith(held, 0);
  });

  it('charges 1 for an answer blocked before any words', async () => {
    mockTutor.askTutor.mockImplementation(answerOf(0, { type: 'done', finish: 'blocked' }));

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockUsage.release).toHaveBeenCalledWith(held, 1);
  });

  it('gives both units back when the model fails before any words', async () => {
    mockTutor.askTutor.mockReturnValue(failing(new AppError(502, 'busy')));
    const next = vi.fn();

    await chat(mockReq(), mockRes() as unknown as Response, next);

    expect(mockUsage.release).toHaveBeenCalledWith(held, 2);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 502 }));
  });

  it('charges an answer broken off after some words by what it had written', async () => {
    mockTutor.askTutor.mockImplementation((opts: { written: { tokens: number } }) => {
      opts.written.tokens = 350;
      return failing(new AppError(502, 'busy'), { type: 'text', text: 'A long start' });
    });

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockUsage.release).toHaveBeenCalledWith(held, 0);
  });

  it('charges 1 when the student leaves a short answer midway', async () => {
    const res = mockRes();
    mockTutor.askTutor.mockImplementation(async function* (opts: {
      signal: AbortSignal;
      written: { tokens: number };
    }) {
      opts.written.tokens = 12;
      yield { type: 'text', text: 'Recursion is' };
      res.emit('close');
      throw opts.signal.reason;
    });

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(mockUsage.release).toHaveBeenCalledWith(held, 1);
  });

  it('answers the limit with its 429 before asking the model', async () => {
    mockUsage.hold.mockRejectedValue(new AppError(429, 'Limit reached. It refills at 2026'));
    const next = vi.fn();
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, next);

    expect(mockTutor.askTutor).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 429 }));
    expect(res.write).not.toHaveBeenCalled();
    expect(mockUsage.release).not.toHaveBeenCalled();
  });

  it('holds nothing for an admin', async () => {
    mockUserRepo.getRole.mockResolvedValue('ADMIN');
    mockUsage.hold.mockResolvedValue(null);
    mockTutor.askTutor.mockReturnValue(
      answer({ type: 'text', text: 'Hi' }, { type: 'done', finish: 'complete' }),
    );

    await chat(mockReq(), mockRes() as unknown as Response, vi.fn());

    expect(mockUsage.hold).toHaveBeenCalledWith(5, 'tutorMessage', true, 2);
    expect(mockUsage.release).not.toHaveBeenCalled();
  });

  it('still says the answer is done when the units cannot be given back', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUsage.release.mockRejectedValue(new Error('db down'));
    mockTutor.askTutor.mockReturnValue(
      answer({ type: 'text', text: 'Hi' }, { type: 'done', finish: 'complete' }),
    );
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(written(res).at(-1)).toEqual({
      type: 'done',
      finish: 'complete',
      conversationId: NEW_ID,
    });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});

describe('conversations', () => {
  function req(params: Record<string, string> = {}, query: Record<string, string> = {}) {
    return { params, query, user: { id: 5 } } as unknown as Request;
  }
  function res() {
    const r = { json: vi.fn(), status: vi.fn(), end: vi.fn() };
    r.status.mockReturnValue(r);
    return r;
  }
  const page = { messages: [], hasMore: false };

  it("lists the student's conversations", async () => {
    const list = [{ id: 9, title: 'hi', lesson: null, updatedAt: '2026-10-14T10:00:00.000Z' }];
    mockConversations.listConversations.mockResolvedValue(list);
    const r = res();

    await listConversations(req(), r as unknown as Response, vi.fn());

    expect(mockConversations.listConversations).toHaveBeenCalledWith(5);
    expect(r.json).toHaveBeenCalledWith(list);
  });

  it('passes a list failure on to the error handler', async () => {
    const next = vi.fn();
    const err = new Error('db down');
    mockConversations.listConversations.mockRejectedValue(err);

    await listConversations(req(), res() as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it('reads a page of a conversation', async () => {
    mockConversations.getPage.mockResolvedValue(page);
    const r = res();

    await getConversation(req({ id: '9' }, { before: '40' }), r as unknown as Response, vi.fn());

    expect(mockConversations.getPage).toHaveBeenCalledWith(5, 9, 40);
    expect(r.json).toHaveBeenCalledWith(page);
  });

  it('ignores a bad cursor', async () => {
    mockConversations.getPage.mockResolvedValue(page);

    await getConversation(req({ id: '9' }, { before: 'x' }), res() as unknown as Response, vi.fn());

    expect(mockConversations.getPage).toHaveBeenCalledWith(5, 9, undefined);
  });

  it.each(['abc', '0', '-3', '1.5'])('answers 404 for a conversation id like %s', async (id) => {
    const next = vi.fn();

    await getConversation(req({ id }), res() as unknown as Response, next);
    await deleteConversation(req({ id }), res() as unknown as Response, next);

    expect(next.mock.calls).toEqual([
      [expect.objectContaining({ statusCode: 404 })],
      [expect.objectContaining({ statusCode: 404 })],
    ]);
    expect(mockConversations.getPage).not.toHaveBeenCalled();
    expect(mockConversations.deleteConversation).not.toHaveBeenCalled();
  });

  it("answers 404 for a conversation that isn't the student's", async () => {
    mockConversations.getPage.mockResolvedValue(null);
    mockConversations.deleteConversation.mockResolvedValue(false);
    const next = vi.fn();

    await getConversation(req({ id: '9' }), res() as unknown as Response, next);
    await deleteConversation(req({ id: '9' }), res() as unknown as Response, next);

    expect(next.mock.calls).toEqual([
      [expect.objectContaining({ statusCode: 404 })],
      [expect.objectContaining({ statusCode: 404 })],
    ]);
  });

  it('deletes a conversation', async () => {
    mockConversations.deleteConversation.mockResolvedValue(true);
    const r = res();

    await deleteConversation(req({ id: '9' }), r as unknown as Response, vi.fn());

    expect(mockConversations.deleteConversation).toHaveBeenCalledWith(5, 9);
    expect(r.status).toHaveBeenCalledWith(204);
    expect(r.end).toHaveBeenCalled();
  });

  it('passes a delete failure on to the error handler', async () => {
    const next = vi.fn();
    const err = new Error('db down');
    mockConversations.deleteConversation.mockRejectedValue(err);

    await deleteConversation(req({ id: '9' }), res() as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
