import { courses, lessons } from '@cyberstars/content/curriculum';
import { isAdmin, type UserRole } from '@cyberstars/shared/auth';
import { canAccessFeature, type FeatureKey } from '@cyberstars/shared/features';
import { contentDir, readLocalized } from './paths.js';

// What the tutor can look up while it answers: the lessons and algorithm
// challenges (their statements only, never a solution or a test) and the app's
// pages. The model asks for these through tool calls; tutor.service runs them.

type Lang = 'en' | 'ro';

// Kotlin is badged "Coming Soon" in the UI, so the tutor sends no one there.
const HIDDEN_COURSES = new Set(['kotlin']);

const SEARCH_RESULTS = 6;

// Little words that sit in every statement and would rank lessons at random.
const STOP_WORDS = new Set([
  'the',
  'and',
  'of',
  'to',
  'in',
  'is',
  'how',
  'what',
  'which',
  'do',
  'does',
  'de',
  'la',
  'si',
  'sau',
  'cu',
  'pe',
  'din',
  'un',
  'ce',
  'care',
  'cum',
  'este',
]);
const STATEMENT_MAX_CHARS = 8_000;

interface CatalogEntry {
  courseKey: string;
  slug: string;
  title: string;
  course: string;
  kind: 'lesson' | 'challenge';
  link: string;
  titleWords: string[];
  // How often each word appears in the statement, English and Romanian together,
  // so a search finds a lesson whichever language the model searches in.
  textWords: Map<string, number>;
}

// Lower case without diacritics, so "buclă" finds "bucla" and the other way.
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function words(text: string): string[] {
  return normalize(text).match(/[\p{L}\p{N}_]+/gu) ?? [];
}

let catalog: CatalogEntry[] | null = null;

function getCatalog(): CatalogEntry[] {
  if (catalog) return catalog;
  const courseTitles = new Map(courses.map((c) => [c.key, c.title]));
  catalog = lessons
    .filter((l) => !HIDDEN_COURSES.has(l.courseKey))
    .map((l) => {
      const dir = contentDir(l.courseKey);
      const statement = [
        readLocalized(dir, `${l.slug}.md`, 'en'),
        readLocalized(dir, `${l.slug}.md`, 'ro'),
      ].join('\n');
      const textWords = new Map<string, number>();
      for (const w of words(statement)) textWords.set(w, (textWords.get(w) ?? 0) + 1);
      const course = courseTitles.get(l.courseKey) ?? l.courseKey;
      return {
        courseKey: l.courseKey,
        slug: l.slug,
        title: l.title,
        course,
        kind: l.courseKey.startsWith('algo-') ? 'challenge' : 'lesson',
        link: `/lesson/${l.courseKey}/${l.slug}`,
        titleWords: words(`${l.title} ${l.slug} ${course}`),
        textWords,
      };
    });
  return catalog;
}

interface LessonHit {
  title: string;
  course: string;
  kind: 'lesson' | 'challenge';
  link: string;
}

function hit(entry: CatalogEntry): LessonHit {
  return { title: entry.title, course: entry.course, kind: entry.kind, link: entry.link };
}

// A word in the title counts far more than one in the text. A query word matches
// any word it starts, so "loop" finds "loops" and "recurs" finds "recursion".
export function searchLessons(query: string): LessonHit[] {
  const terms = [...new Set(words(query).filter((w) => w.length >= 2 && !STOP_WORDS.has(w)))];
  if (terms.length === 0) return [];
  const scored = getCatalog().map((entry) => {
    let score = 0;
    for (const term of terms) {
      if (entry.titleWords.some((w) => w.startsWith(term))) score += 5;
      let inText = 0;
      for (const [w, n] of entry.textWords) if (w.startsWith(term)) inText += n;
      score += Math.min(inText, 5);
    }
    return { entry, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, SEARCH_RESULTS)
    .map((s) => hit(s.entry));
}

interface LessonStatement extends LessonHit {
  statement: string;
}

// Only a lesson the curriculum lists can be read, so a made-up slug never
// reaches the disk. Reads <slug>.md alone: no solution, no tests.
export function readLesson(courseKey: string, slug: string, lang: Lang): LessonStatement | null {
  const entry = getCatalog().find((e) => e.courseKey === courseKey && e.slug === slug);
  if (!entry) return null;
  const statement = readLocalized(contentDir(courseKey), `${slug}.md`, lang);
  return { ...hit(entry), statement: statement.slice(0, STATEMENT_MAX_CHARS) };
}

interface PageInfo {
  link: string;
  name: string;
  about: string;
}

const PAGES: (PageInfo & { feature?: FeatureKey; adminOnly?: boolean })[] = [
  { link: '/', name: 'Dashboard', about: "the student's home: progress and today's picks" },
  { link: '/courses', name: 'Courses', about: 'every course and its lessons' },
  { link: '/algorithms', name: 'Algorithms', about: 'algorithm challenges in Python, Java and C' },
  { link: '/almanac', name: 'Almanac', about: 'short reads on the history of computing' },
  { link: '/forum', name: 'Forum', about: 'ask and answer questions with other students' },
  {
    link: '/messages',
    name: 'Messages',
    about: 'direct messages with other students',
    feature: 'messaging',
  },
  {
    link: '/connections',
    name: 'Connections',
    about: 'the people the student is connected with',
    feature: 'connections',
  },
  {
    link: '/leaderboard',
    name: 'Leaderboard',
    about: 'students ranked by XP',
    feature: 'leaderboard',
  },
  { link: '/profile', name: 'Profile', about: 'level, XP, badges and activity' },
  {
    link: '/settings',
    name: 'Settings',
    about: 'profile details, password, language and privacy',
  },
  { link: '/usage', name: 'Usage', about: 'how many Show Solution reveals are left' },
  { link: '/rules', name: 'Rules', about: 'community rules and how the app uses data' },
  { link: '/support', name: 'Support', about: 'open a ticket to get help from the team' },
  { link: '/admin', name: 'Admin', about: 'platform statistics', adminOnly: true },
];

interface AppMap {
  pages: PageInfo[];
  courses: { title: string; link: string }[];
}

// Pages this student can open, the same rules the sidebar uses: a preview page
// only for those let in, the Admin page only for admins. The space explorer is
// left out, as everywhere in the UI.
export function listPages(role: UserRole | undefined, isProd: boolean): AppMap {
  const pages = PAGES.filter(
    (p) =>
      (!p.feature || canAccessFeature(p.feature, role, isProd)) && (!p.adminOnly || isAdmin(role)),
  ).map(({ link, name, about }) => ({ link, name, about }));
  const courseLinks = courses
    .filter((c) => !HIDDEN_COURSES.has(c.key))
    .map((c) => ({
      title: c.title,
      link: c.key.startsWith('algo-')
        ? `/algorithms/${c.key.replace('algo-', '')}`
        : `/courses/${c.key}`,
    }));
  return { pages, courses: courseLinks };
}
