import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { getUsage, revealSolution } = await import('./usageService');

beforeEach(() => vi.clearAllMocks());

describe('usageService', () => {
  it('fetches the usage summary', async () => {
    mockApi.get.mockResolvedValue({ showSolution: {}, tutorMessage: {} });
    await getUsage();
    expect(mockApi.get).toHaveBeenCalledWith('/api/usage');
  });

  it('posts the lesson and language to reveal a solution', async () => {
    mockApi.post.mockResolvedValue({});
    await revealSolution('python', 'loops', 'ro');
    expect(mockApi.post).toHaveBeenCalledWith('/api/usage/solution/python/loops', { lang: 'ro' });
  });

  it("names the language on screen to reveal a multi-language lesson's solution", async () => {
    mockApi.post.mockResolvedValue({});
    await revealSolution('trees-graphs', 'trees', 'en', 'java');
    expect(mockApi.post).toHaveBeenCalledWith('/api/usage/solution/trees-graphs/trees', {
      lang: 'en',
      language: 'java',
    });
  });
});
