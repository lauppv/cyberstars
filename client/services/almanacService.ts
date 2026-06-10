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

// Translated almanac files live in a per-language subfolder (/almanac/ro/...)
// alongside the English source. English stays the source of truth; a missing
// translation falls back to it, so the almanac can be translated incrementally.
// A missing file is a 404 in prod (nginx) or the SPA index.html in dev — both
// reject here (bad status or non-JSON body), so the catch covers both.
async function getLocalizedJson<T>(relPath: string, lang: string): Promise<T> {
  const base = `/almanac/${relPath}`;
  if (lang === 'en') return getJson<T>(base);
  try {
    return await getJson<T>(`/almanac/${lang}/${relPath}`);
  } catch {
    return getJson<T>(base);
  }
}

// Slugs are language-independent (translations reuse the English slug), so this
// one stays unlocalized.
export function fetchAlmanacSlugs(): Promise<string[]> {
  return cached('almanac:slugs', () => getJson<string[]>('/almanac/slugs.json'));
}

export function fetchAlmanacIndex(lang = 'en'): Promise<AlmanacCard[]> {
  return cached(`almanac:index:${lang}`, () => getLocalizedJson<AlmanacCard[]>('index.json', lang));
}

export function fetchAlmanacArticle(slug: string, lang = 'en'): Promise<AlmanacArticle> {
  return cached(`almanac:article:${lang}:${slug}`, () =>
    getLocalizedJson<AlmanacArticle>(`articles/${slug}.json`, lang),
  );
}

export function fetchAlmanacExtras(lang = 'en'): Promise<AlmanacExtras> {
  return cached(`almanac:extras:${lang}`, () =>
    getLocalizedJson<AlmanacExtras>('extras.json', lang),
  );
}
