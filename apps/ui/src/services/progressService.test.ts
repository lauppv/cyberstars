import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), put: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { getSavedCode, saveCode } = await import('./progressService');

beforeEach(() => vi.clearAllMocks());

describe('progressService saved code', () => {
  it("reads and saves a one-language course's code by lesson alone", async () => {
    await getSavedCode('python', 'loops');
    await saveCode('python', 'loops', 'x = 1');
    expect(mockApi.get).toHaveBeenCalledWith('/api/progress/python/loops/code');
    expect(mockApi.put).toHaveBeenCalledWith('/api/progress/python/loops/code', { code: 'x = 1' });
  });

  it("reads and saves a multi-language lesson's code in its language", async () => {
    await getSavedCode('trees-graphs', 'trees', 'c');
    await saveCode('trees-graphs', 'trees', 'int x;', 'c');
    expect(mockApi.get).toHaveBeenCalledWith('/api/progress/trees-graphs/trees/code?language=c');
    expect(mockApi.put).toHaveBeenCalledWith('/api/progress/trees-graphs/trees/code', {
      code: 'int x;',
      language: 'c',
    });
  });
});
