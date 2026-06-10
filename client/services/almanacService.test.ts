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

  it('fetches an article from the /ro/ subfolder when lang=ro', async () => {
    const fetchMock = vi.fn(() => jsonResponse({ slug: 'ro-art' }));
    vi.stubGlobal('fetch', fetchMock);
    await fetchAlmanacArticle('ro-art', 'ro');
    expect(fetchMock).toHaveBeenCalledWith('/almanac/ro/articles/ro-art.json');
  });

  it('falls back to English when the ro article is missing (404)', async () => {
    const fetchMock = vi.fn((url: string) =>
      url.includes('/ro/') ? jsonResponse(null, false) : jsonResponse({ slug: 'fallback' }),
    );
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchAlmanacArticle('fallback', 'ro')).toEqual({ slug: 'fallback' });
    expect(fetchMock).toHaveBeenNthCalledWith(1, '/almanac/ro/articles/fallback.json');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/almanac/articles/fallback.json');
  });

  it('falls back to English when ro returns the SPA index.html (non-JSON body)', async () => {
    const fetchMock = vi.fn((url: string) =>
      url.includes('/ro/')
        ? Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.reject(new Error('not json')),
          })
        : jsonResponse({ slug: 'spa-fallback' }),
    );
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchAlmanacArticle('spa-fallback', 'ro')).toEqual({ slug: 'spa-fallback' });
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/almanac/articles/spa-fallback.json');
  });

  it('fetches the ro index and extras from the /ro/ subfolder', async () => {
    const fetchMock = vi.fn((url: string) =>
      jsonResponse(
        url.includes('index') ? [{ slug: 'ro-x' }] : { funFacts: [], quotes: [], timeline: [] },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);
    await fetchAlmanacIndex('ro');
    await fetchAlmanacExtras('ro');
    expect(fetchMock).toHaveBeenCalledWith('/almanac/ro/index.json');
    expect(fetchMock).toHaveBeenCalledWith('/almanac/ro/extras.json');
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
