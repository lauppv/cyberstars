import { describe, it, expect, vi, afterEach } from 'vitest';
import * as lessonService from './lessonService';

function textResponse(body: string, ok = true) {
  return Promise.resolve({ ok, status: ok ? 200 : 404, text: () => Promise.resolve(body) });
}

function jsonResponse(body: unknown, ok = true) {
  return Promise.resolve({ ok, status: ok ? 200 : 404, json: () => Promise.resolve(body) });
}

afterEach(() => vi.unstubAllGlobals());

describe('lessonService cache', () => {
  it('fetchLesson caches by course+slug and wraps as {title, content}', async () => {
    const fetchMock = vi.fn(() => textResponse('# body'));
    vi.stubGlobal('fetch', fetchMock);
    const a = await lessonService.fetchLesson('python', 'vars');
    const b = await lessonService.fetchLesson('python', 'vars');
    expect(a).toBe(b);
    expect(a).toEqual({ title: 'vars', content: '# body' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/lessons/python/vars.md');
  });

  it('different lessons are fetched separately', async () => {
    const fetchMock = vi.fn(() => textResponse('x'));
    vi.stubGlobal('fetch', fetchMock);
    await lessonService.fetchLesson('python', 'loops');
    await lessonService.fetchLesson('c', 'loops');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('fetchLessonCode caches by course+slug and hits the -code.md path', async () => {
    const fetchMock = vi.fn(() => textResponse('starter'));
    vi.stubGlobal('fetch', fetchMock);
    expect(await lessonService.fetchLessonCode('java', 'arrays')).toBe('starter');
    await lessonService.fetchLessonCode('java', 'arrays');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/lessons/java/arrays-code.md');
  });

  it('a failed fetch is not cached (retries on next call)', async () => {
    const fetchMock = vi
      .fn()
      .mockReturnValueOnce(textResponse('', false))
      .mockReturnValueOnce(textResponse('ok'));
    vi.stubGlobal('fetch', fetchMock);
    await expect(lessonService.fetchLesson('python', 'retry')).rejects.toThrow();
    expect(await lessonService.fetchLesson('python', 'retry')).toEqual({
      title: 'retry',
      content: 'ok',
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('fetchCurriculum is not cached (CurriculumProvider owns refresh)', async () => {
    const fetchMock = vi.fn(() => jsonResponse([]));
    vi.stubGlobal('fetch', fetchMock);
    await lessonService.fetchCurriculum();
    await lessonService.fetchCurriculum();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith('/curriculum.json');
  });
});
