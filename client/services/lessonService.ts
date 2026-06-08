import type { LessonContent, Course } from '../../shared/lesson';

// Lesson content, starter code and the curriculum are static for the lifetime of
// a deploy: generated into public/ at build time (scripts/generate-static-content.ts)
// and served as plain files by nginx (prod) / Vite's publicDir (dev) — never
// touching the API server or the DB. We fetch only what is viewed and cache each
// file for the session, so a revisit never re-fetches. Mirrors almanacService.ts.
// Curriculum is intentionally not cached here — CurriculumProvider holds it and
// exposes refresh().
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

async function getText(path: string): Promise<string> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.text();
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

// Translated lessons live in a per-language subfolder alongside the English
// source (e.g. /lessons/python/ro/print.md). English stays at the top level and
// is the source of truth; a missing translation falls back to it, so a course
// can be translated one lesson at a time.
async function getLocalizedText(
  courseKey: string,
  slug: string,
  suffix: string,
  lang: string,
): Promise<string> {
  const base = `/lessons/${courseKey}/${slug}${suffix}.md`;
  if (lang === 'en') return getText(base);
  try {
    return await getText(`/lessons/${courseKey}/${lang}/${slug}${suffix}.md`);
  } catch {
    return getText(base);
  }
}

export function fetchLesson(
  courseKey: string,
  lessonSlug: string,
  lang = 'en',
): Promise<LessonContent> {
  return cached(`lesson:${lang}:${courseKey}/${lessonSlug}`, async () => ({
    title: lessonSlug,
    content: await getLocalizedText(courseKey, lessonSlug, '', lang),
  }));
}

export function fetchLessonCode(
  courseKey: string,
  lessonSlug: string,
  lang = 'en',
): Promise<string> {
  return cached(`code:${lang}:${courseKey}/${lessonSlug}`, () =>
    getLocalizedText(courseKey, lessonSlug, '-code', lang),
  );
}

export function fetchCurriculum(): Promise<Course[]> {
  return getJson<Course[]>('/curriculum.json');
}
