import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchAlmanacSlugs,
  fetchAlmanacIndex,
  fetchAlmanacExtras,
  fetchAlmanacArticle,
} from './almanacService';

function jsonResponse(body: unknown, ok = true) {
  return Promise.resolve({ ok, status: ok ? 200 : 404, json: () => Promise.resolve(body) });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('almanacService', () => {
  it('fetches and parses slugs', async () => {
    const fetchMock = vi.fn(() => jsonResponse(['a', 'b']));
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchAlmanacSlugs()).toEqual(['a', 'b']);
    expect(fetchMock).toHaveBeenCalledWith('/almanac/slugs.json');
  });

  it('fetches the index and extras', async () => {
    const fetchMock = vi.fn((url: string) =>
      jsonResponse(
        url.includes('index') ? [{ slug: 'x' }] : { funFacts: [], quotes: [], timeline: [] },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchAlmanacIndex()).toEqual([{ slug: 'x' }]);
    expect(await fetchAlmanacExtras()).toEqual({ funFacts: [], quotes: [], timeline: [] });
  });

  it('caches an article so it is only fetched once', async () => {
    const fetchMock = vi.fn(() => jsonResponse({ slug: 'cache-me' }));
    vi.stubGlobal('fetch', fetchMock);
    await fetchAlmanacArticle('cache-me');
    await fetchAlmanacArticle('cache-me');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/almanac/articles/cache-me.json');
  });

  it('throws on a failed response and does not poison the cache', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => jsonResponse(null, false)),
    );
    await expect(fetchAlmanacArticle('missing')).rejects.toThrow();
    // The failed key was evicted, so a retry actually re-fetches.
    const okMock = vi.fn(() => jsonResponse({ slug: 'missing' }));
    vi.stubGlobal('fetch', okMock);
    expect(await fetchAlmanacArticle('missing')).toEqual({ slug: 'missing' });
    expect(okMock).toHaveBeenCalledTimes(1);
  });
});
