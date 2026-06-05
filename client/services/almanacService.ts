import type { AlmanacArticle, AlmanacCard, AlmanacExtras } from '../../shared/almanac';

// The almanac is static content served as plain files from /almanac/* (by nginx
// in prod, by Vite's publicDir in dev) — never bundled, never touching the API
// server. We fetch only what's viewed (the dashboard picks 3, the page lists
// cards and pulls a body on click) and cache each file for the session so a
// revisit is instant. Mirrors the in-memory cache in lessonService.ts.
const cache = new Map<string, Promise<unknown>>();

function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key) as Promise<T> | undefined;
  if (hit) return hit;
  const pending = fetcher().catch((err) => {
    cache.delete(key); // a transient failure must not poison the cache
    throw err;
  });
  cache.set(key, pending);
  return pending;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export function fetchAlmanacSlugs(): Promise<string[]> {
  return cached('almanac:slugs', () => getJson<string[]>('/almanac/slugs.json'));
}

export function fetchAlmanacIndex(): Promise<AlmanacCard[]> {
  return cached('almanac:index', () => getJson<AlmanacCard[]>('/almanac/index.json'));
}

export function fetchAlmanacArticle(slug: string): Promise<AlmanacArticle> {
  return cached(`almanac:article:${slug}`, () =>
    getJson<AlmanacArticle>(`/almanac/articles/${slug}.json`),
  );
}

export function fetchAlmanacExtras(): Promise<AlmanacExtras> {
  return cached('almanac:extras', () => getJson<AlmanacExtras>('/almanac/extras.json'));
}
