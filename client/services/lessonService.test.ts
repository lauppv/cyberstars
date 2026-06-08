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

  it('fetchLesson with lang=ro fetches from the /ro/ subfolder', async () => {
    const fetchMock = vi.fn(() => textResponse('# corpo'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await lessonService.fetchLesson('python', 'vars', 'ro');
    expect(result).toEqual({ title: 'vars', content: '# corpo' });
    expect(fetchMock).toHaveBeenCalledWith('/lessons/python/ro/vars.md');
  });

  it('fetchLesson with lang=ro falls back to English when translated file is missing', async () => {
    const fetchMock = vi
      .fn()
      .mockReturnValueOnce(textResponse('', false))
      .mockReturnValueOnce(textResponse('# english fallback'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await lessonService.fetchLesson('python', 'missing-ro', 'ro');
    expect(result).toEqual({ title: 'missing-ro', content: '# english fallback' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/lessons/python/ro/missing-ro.md');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/lessons/python/missing-ro.md');
  });

  it('fetchLessonCode with lang=ro fetches from the /ro/ subfolder', async () => {
    const fetchMock = vi.fn(() => textResponse('# cod'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await lessonService.fetchLessonCode('python', 'vars', 'ro');
    expect(result).toBe('# cod');
    expect(fetchMock).toHaveBeenCalledWith('/lessons/python/ro/vars-code.md');
  });

  it('fetchLessonCode with lang=ro falls back to English when missing', async () => {
    const fetchMock = vi
      .fn()
      .mockReturnValueOnce(textResponse('', false))
      .mockReturnValueOnce(textResponse('en starter'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await lessonService.fetchLessonCode('python', 'no-ro', 'ro');
    expect(result).toBe('en starter');
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/lessons/python/ro/no-ro-code.md');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/lessons/python/no-ro-code.md');
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
