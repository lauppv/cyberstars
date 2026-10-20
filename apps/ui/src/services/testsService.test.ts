import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { runTests } = await import('./testsService');

beforeEach(() => vi.clearAllMocks());

describe('runTests', () => {
  it('sends the code and the site language', async () => {
    await runTests('python', 'loops', 'x = 1', 'ro');
    expect(mockApi.post).toHaveBeenCalledWith(
      '/api/tests/python/loops/run',
      {
        code: 'x = 1',
        lang: 'ro',
      },
      undefined,
    );
  });

  it('names the language on screen on a multi-language lesson', async () => {
    await runTests('trees-graphs', 'trees', 'int x;', 'en', 'c');
    expect(mockApi.post).toHaveBeenCalledWith(
      '/api/tests/trees-graphs/trees/run',
      {
        code: 'int x;',
        lang: 'en',
        language: 'c',
      },
      undefined,
    );
  });
});
