import { FEATURES, featureId } from './featureList';

// Every chapter of the page, by the id of where it starts and its heading
export const CHAPTERS: [string, string][] = [
  ['how', 'landing.how.title'],
  ['loops', 'landing.loops.title'],
  ...FEATURES.map(([key]): [string, string] => [featureId(key), `landing.features.${key}.title`]),
  ['free', 'landing.free.title'],
  ['faq', 'landing.faq.title'],
  ['start', 'landing.cta.final.title'],
];

// The chapter being read: the last one whose start has passed 40% of the
// window's height, or none above the first. A part of What's inside counts
// only once its picture is the one on screen: its words start rising a while
// before, and the chapter would name it next to the picture before it. At the
// very bottom it is the last one, which sits too low on the page to ever reach
// that line.
export function currentChapter(ids: string[], viewport: number): string | null {
  const page = document.documentElement;
  if (ids.length && window.scrollY + viewport >= page.scrollHeight - 2) return ids[ids.length - 1];
  let current: string | null = null;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el || el.hasAttribute('data-waiting')) continue;
    if (el.getBoundingClientRect().top <= viewport * 0.4) current = id;
  }
  return current;
}
