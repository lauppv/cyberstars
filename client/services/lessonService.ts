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

export function fetchLesson(courseKey: string, lessonSlug: string): Promise<LessonContent> {
  return cached(`lesson:${courseKey}/${lessonSlug}`, async () => ({
    title: lessonSlug,
    content: await getText(`/lessons/${courseKey}/${lessonSlug}.md`),
  }));
}

export function fetchLessonCode(courseKey: string, lessonSlug: string): Promise<string> {
  return cached(`code:${courseKey}/${lessonSlug}`, () =>
    getText(`/lessons/${courseKey}/${lessonSlug}-code.md`),
  );
}

export function fetchCurriculum(): Promise<Course[]> {
  return getJson<Course[]>('/curriculum.json');
}
