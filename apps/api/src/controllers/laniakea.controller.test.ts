import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = {
  getState: vi.fn(),
  startQuiz: vi.fn(),
  answerQuiz: vi.fn(),
  missedQuestions: vi.fn(),
};
const mockRecaps = { markSeen: vi.fn() };
vi.mock('../services/laniakea.service.js', () => mockService);
vi.mock('../services/laniakea-recaps.service.js', () => mockRecaps);

const { answerQuiz, getMissedQuestions, getState, markSeen, startQuiz } =
  await import('./laniakea.controller.js');

function req(params: Record<string, string> = {}, body: object = {}, query = {}): Request {
  return { user: { id: 7 }, params, body, query } as unknown as Request;
}
function res(): Response {
  return {
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    end: vi.fn(),
  } as unknown as Response;
}

beforeEach(() => vi.clearAllMocks());

describe('laniakea controller', () => {
  it("hands back the student's planets", async () => {
    mockService.getState.mockResolvedValue({ unlocked: true });
    const r = res();
    await getState(req(), r, vi.fn());
    expect(mockService.getState).toHaveBeenCalledWith(7);
    expect(r.json).toHaveBeenCalledWith({ unlocked: true });
  });

  it('opens a test in the page language, English unless it is Romanian', async () => {
    mockService.startQuiz.mockResolvedValue({ slug: 'print' });
    await startQuiz(req({ slug: 'print' }, { lang: 'ro' }), res(), vi.fn());
    await startQuiz(req({ slug: 'print' }, {}), res(), vi.fn());
    expect(mockService.startQuiz.mock.calls).toEqual([
      [7, 'print', 'ro'],
      [7, 'print', 'en'],
    ]);
  });

  it('answers a question', async () => {
    mockService.answerQuiz.mockResolvedValue({ correct: true });
    const r = res();
    await answerQuiz(req({ slug: 'print' }, { index: 2, choice: 1 }), r, vi.fn());
    expect(mockService.answerQuiz).toHaveBeenCalledWith(7, 'print', 2, 1);
    expect(r.json).toHaveBeenCalledWith({ correct: true });
  });

  it('marks the recaps seen with no body back', async () => {
    mockRecaps.markSeen.mockResolvedValue(undefined);
    const r = res();
    await markSeen(req(), r, vi.fn());
    expect(mockRecaps.markSeen).toHaveBeenCalledWith(7);
    expect(r.status).toHaveBeenCalledWith(204);
    expect(r.end).toHaveBeenCalled();
  });

  it('lists the most missed questions in the page language, English unless it is Romanian', async () => {
    mockService.missedQuestions.mockResolvedValue([{ id: 'q1' }]);
    const r = res();
    await getMissedQuestions(req({}, {}, { lang: 'ro' }), r, vi.fn());
    await getMissedQuestions(req({}, {}, { lang: 'fr' }), res(), vi.fn());
    expect(mockService.missedQuestions.mock.calls).toEqual([['ro'], ['en']]);
    expect(r.json).toHaveBeenCalledWith([{ id: 'q1' }]);
  });

  it('passes every failure on', async () => {
    const boom = new Error('boom');
    mockService.getState.mockRejectedValue(boom);
    mockService.startQuiz.mockRejectedValue(boom);
    mockService.answerQuiz.mockRejectedValue(boom);
    mockRecaps.markSeen.mockRejectedValue(boom);
    mockService.missedQuestions.mockRejectedValue(boom);
    const next = vi.fn();
    await getState(req(), res(), next);
    await startQuiz(req({ slug: 'print' }), res(), next);
    await answerQuiz(req({ slug: 'print' }, { index: 0, choice: 0 }), res(), next);
    await markSeen(req(), res(), next);
    await getMissedQuestions(req(), res(), next);
    expect(next.mock.calls).toEqual([[boom], [boom], [boom], [boom], [boom]]);
  });
});
