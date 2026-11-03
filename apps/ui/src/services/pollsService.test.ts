import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), post: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { getPoll, vote } = await import('./pollsService');

beforeEach(() => vi.clearAllMocks());

describe('pollsService', () => {
  it('reads one poll', async () => {
    mockApi.get.mockResolvedValue({ id: 3 });
    expect(await getPoll(3)).toEqual({ id: 3 });
    expect(mockApi.get).toHaveBeenCalledWith('/api/polls/3');
  });

  it('votes with the options picked', async () => {
    mockApi.post.mockResolvedValue('');
    await vote(3, [7, 9]);
    expect(mockApi.post).toHaveBeenCalledWith('/api/polls/3/vote', { optionIds: [7, 9] });
  });
});
