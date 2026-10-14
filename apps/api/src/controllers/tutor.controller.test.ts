import { EventEmitter } from 'node:events';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import type { TutorStreamEvent } from '@cyberstars/shared/tutor';
import { AppError } from '../middleware/errorHandler.js';

const mockTutor = { askTutor: vi.fn() };
vi.mock('../services/tutor.service.js', () => mockTutor);

const mockUserRepo = { getRole: vi.fn() };
vi.mock('../repositories/user.repository.js', () => mockUserRepo);

const { chat } = await import('./tutor.controller.js');

function mockReq(body: Record<string, unknown> = {}): Request {
  return {
    body: { message: 'which lesson has loops?', page: '/courses', lang: 'ro', ...body },
    user: { id: 5 },
  } as unknown as Request;
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
});

describe('chat', () => {
  it("asks the tutor with the student's role and streams its answer", async () => {
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
    expect(mockTutor.askTutor).toHaveBeenCalledWith({
      message: 'which lesson has loops?',
      page: '/courses',
      uiLang: 'ro',
      role: 'USER',
      isProd: false,
      signal: expect.any(AbortSignal),
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
      { type: 'done', finish: 'complete' },
    ]);
    expect(res.end).toHaveBeenCalledOnce();
    expect(mockTutor.askTutor.mock.calls[0][0].signal.aborted).toBe(false);
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
      { type: 'error', message: 'The tutor could not answer right now, please try again' },
    ]);
    expect(res.end).toHaveBeenCalledOnce();
  });

  it('keeps an unexpected error message to itself', async () => {
    mockTutor.askTutor.mockReturnValue(
      failing(new Error('socket hang up at 10.0.0.3'), { type: 'text', text: 'Hi' }),
    );
    const res = mockRes();

    await chat(mockReq(), res as unknown as Response, vi.fn());

    expect(written(res).at(-1)).toEqual({ type: 'error', message: 'Something went wrong' });
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
  });
});
