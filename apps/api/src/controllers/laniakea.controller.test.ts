import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';

const mockService = { getState: vi.fn(), startQuiz: vi.fn(), answerQuiz: vi.fn() };
vi.mock('../services/laniakea.service.js', () => mockService);

const { answerQuiz, getState, startQuiz } = await import('./laniakea.controller.js');

function req(params: Record<string, string> = {}, body: object = {}): Request {
  return { user: { id: 7 }, params, body } as unknown as Request;
}
function res(): Response {
  return { json: vi.fn().mockReturnThis() } as unknown as Response;
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

  it('passes every failure on', async () => {
    const boom = new Error('boom');
    mockService.getState.mockRejectedValue(boom);
    mockService.startQuiz.mockRejectedValue(boom);
    mockService.answerQuiz.mockRejectedValue(boom);
    const next = vi.fn();
    await getState(req(), res(), next);
    await startQuiz(req({ slug: 'print' }), res(), next);
    await answerQuiz(req({ slug: 'print' }, { index: 0, choice: 0 }), res(), next);
    expect(next.mock.calls).toEqual([[boom], [boom], [boom]]);
  });
});
