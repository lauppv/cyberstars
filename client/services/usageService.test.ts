import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { getUsage, consumeSolution } = await import('./usageService');

beforeEach(() => vi.clearAllMocks());

describe('usageService', () => {
  it('fetches the usage summary', async () => {
    mockApi.get.mockResolvedValue({ showSolution: {}, getHint: {} });
    await getUsage();
    expect(mockApi.get).toHaveBeenCalledWith('/api/usage');
  });

  it('posts to consume a solution reveal', async () => {
    mockApi.post.mockResolvedValue({});
    await consumeSolution();
    expect(mockApi.post).toHaveBeenCalledWith('/api/usage/solution');
  });
});
