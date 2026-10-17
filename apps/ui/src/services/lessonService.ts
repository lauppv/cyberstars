import type { LessonContent, Course } from '@cyberstars/shared/lesson';
import type { CodeLanguage } from '@cyberstars/shared/constants';

// Lesson content, starter code and the curriculum are static for the lifetime of
// a deploy: generated into public/ at build time (scripts/generate-static-content.ts)
// and served as plain files by nginx (prod) / Vite's publicDir (dev), never
// touching the API server or the DB. We fetch only what is viewed and cache each
// file for the session, so a revisit never re-fetches. Mirrors almanacService.ts.
// Curriculum is intentionally not cached here; CurriculumProvider holds it and
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
  // Vite's dev server answers a missing static file with the SPA index.html
  // (200, text/html) instead of a 404, so a missing translation can't be
  // detected by status alone. Lessons are always markdown, so an HTML body means
  // the file isn't there, so treat it as a load failure (getLocalizedText then
  // falls back to English). In prod nginx serves real .md and 404s the rest.
  if (res.headers?.get('content-type')?.includes('text/html')) {
    throw new Error(`Failed to load ${path}: got SPA fallback (not markdown)`);
  }
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
  folder: string,
  slug: string,
  suffix: string,
  lang: string,
): Promise<string> {
  const base = `/lessons/${folder}/${slug}${suffix}.md`;
  if (lang === 'en') return getText(base);
  try {
    return await getText(`/lessons/${folder}/${lang}/${slug}${suffix}.md`);
  } catch {
    return getText(base);
  }
}

// A multi-language course keeps each language's lessons in a folder of its own
// (/lessons/trees-graphs/java/), which `language` names.
function folderOf(courseKey: string, language?: CodeLanguage): string {
  return language ? `${courseKey}/${language}` : courseKey;
}

export function fetchLesson(
  courseKey: string,
  lessonSlug: string,
  lang = 'en',
  language?: CodeLanguage,
): Promise<LessonContent> {
  const folder = folderOf(courseKey, language);
  return cached(`lesson:${lang}:${folder}/${lessonSlug}`, async () => ({
    title: lessonSlug,
    content: await getLocalizedText(folder, lessonSlug, '', lang),
  }));
}

export function fetchLessonCode(
  courseKey: string,
  lessonSlug: string,
  lang = 'en',
  language?: CodeLanguage,
): Promise<string> {
  const folder = folderOf(courseKey, language);
  return cached(`code:${lang}:${folder}/${lessonSlug}`, () =>
    getLocalizedText(folder, lessonSlug, '-code', lang),
  );
}

export function fetchCurriculum(): Promise<Course[]> {
  return getJson<Course[]>('/curriculum.json');
}
