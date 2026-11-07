import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockApi = { get: vi.fn(), put: vi.fn() };
vi.mock('./apiClient', () => ({ api: mockApi }));

const { getChecks, setCheck, getProjectText } = await import('./projectsService');

function answer(body: string, init: { status?: number; type?: string } = {}) {
  return {
    ok: (init.status ?? 200) < 400,
    status: init.status ?? 200,
    headers: new Headers({ 'content-type': init.type ?? 'text/markdown' }),
    text: () => Promise.resolve(body),
  } as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('projectsService', () => {
  it('reads the ticks', async () => {
    mockApi.get.mockResolvedValue([{ stepId: 'catalog' }]);
    expect(await getChecks()).toEqual([{ stepId: 'catalog' }]);
    expect(mockApi.get).toHaveBeenCalledWith('/api/projects/checks');
  });

  it('ticks and unticks a step', async () => {
    await setCheck('python', 'library-desk', 'list', false);
    expect(mockApi.put).toHaveBeenCalledWith('/api/projects/python/library-desk/steps/list', {
      checked: false,
    });
  });

  it('fetches a project’s text once a visit', async () => {
    const fetch = vi.fn().mockResolvedValue(answer('# text'));
    vi.stubGlobal('fetch', fetch);
    expect(await getProjectText('python', 'once')).toBe('# text');
    expect(await getProjectText('python', 'once')).toBe('# text');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/projects/python/once.md');
  });

  it('fails on a missing file, or the app page answered in its place, and tries again next time', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(answer('', { status: 404 }))
      .mockResolvedValueOnce(answer('<html>', { type: 'text/html' }))
      .mockResolvedValueOnce(answer('# text'));
    vi.stubGlobal('fetch', fetch);
    await expect(getProjectText('python', 'retry')).rejects.toThrow('404');
    await expect(getProjectText('python', 'retry')).rejects.toThrow();
    expect(await getProjectText('python', 'retry')).toBe('# text');
  });
});
