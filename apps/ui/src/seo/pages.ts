// Every public page the build pre-renders for search engines and link
// previews, in English and in Romanian: what each one is, what it's called and
// where its twin in the other language lives. scripts/prerender.tsx reads the
// files and writes the pages; this part only decides, so it can be tested.
import i18n from 'i18next';
import type { Course } from '@cyberstars/shared/lesson';
import type { AlmanacArticle, AlmanacCard } from '@cyberstars/shared/almanac';
import {
  ALGO_COURSE_KEYS,
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
  baseLanguage,
} from '@cyberstars/shared/constants';
import { courseLabel, courseTitle } from '../constants/courses';
import { twinPath, type Lang } from '../i18n';

export const ORIGIN = 'https://cyberstars.app';

// What the build knows about the content on disk. A missing translation is null
export interface ContentSource {
  courses: Course[];
  lesson(courseKey: string, slug: string, lang: Lang): { text: string; modified: string } | null;
  almanac(lang: Lang): AlmanacCard[];
  article(slug: string, lang: Lang): { article: AlmanacArticle; modified: string } | null;
}

export interface Link {
  path: string;
  label: string;
}

type Described = Link & { description: string };

// What a page shows, for StaticPages to draw
export type View =
  | { kind: 'landing' }
  | { kind: 'courses'; courses: Described[] }
  | { kind: 'course'; name: string; description: string; lessons: Link[] }
  | { kind: 'lesson'; title: string; text: string; previous?: Link; next?: Link }
  | { kind: 'algorithms'; courses: Described[] }
  | { kind: 'challenges'; name: string; description: string; challenges: Link[] }
  | { kind: 'almanac'; articles: Described[] }
  | { kind: 'article'; article: AlmanacArticle };

export interface Page {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  // The page's address in each language it exists in, its own included
  alternates: Partial<Record<Lang, string>>;
  breadcrumb: Link[];
  view: View;
  // YYYY-MM-DD, when the content behind the page last changed
  lastmod?: string;
  jsonLd?: object;
}

// A page and the link that leads to it from its list
interface Entry {
  page: Page;
  link: Link;
}

const LANGS: Lang[] = ['en', 'ro'];

// The first lines of a lesson or a challenge as plain text, short enough for
// a search result
export function summary(markdown: string, max = 155): string {
  const paragraph =
    markdown
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !/^(#|```|\||[-*>]\s|!\[|---|:::|\d+\.\s)/.test(p)) ?? '';
  const text = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/:green\[([^\]]*)\]/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max - 1);
  return `${text.slice(0, cut > 0 ? cut : max - 1)}…`;
}

// "Easy · Two Sum" names a challenge; the difficulty stays out of its title
function bareTitle(title: string): string {
  return title.replace(/^(Easy|Medium|Hard)\s*[·-]\s*/i, '');
}

function latest(dates: (string | undefined)[]): string | undefined {
  return dates
    .filter((d): d is string => !!d)
    .sort()
    .at(-1);
}

function breadcrumbLd(trail: Link[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((link, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: link.label,
      item: `${ORIGIN}${link.path}`,
    })),
  };
}

// The lists and the landing page are translated in full, so they exist in both
function everywhere(path: string): Page['alternates'] {
  return { en: path, ro: twinPath(path, 'ro') };
}

export function buildPages(source: ContentSource): Page[] {
  const byKey = new Map(source.courses.map((c) => [c.key, c]));
  const courseKeys = [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS].filter((k) => byKey.has(k));
  const algoKeys = ALGO_COURSE_KEYS.filter((k) => byKey.has(k));

  // Where a lesson or an article lives in each language its text exists in
  const wherever = (path: string, exists: (lang: Lang) => boolean) => {
    const alternates: Page['alternates'] = {};
    for (const lang of LANGS) if (exists(lang)) alternates[lang] = twinPath(path, lang);
    return alternates;
  };

  // A course's lessons, or a language's challenges, that exist in this language
  const lessonEntries = (courseKey: string, lang: Lang, trail: Link[]): Entry[] => {
    const t = i18n.getFixedT(lang);
    const challenge = courseKey.startsWith('algo-');
    const label = courseLabel(courseKey, t);
    const lessons = byKey
      .get(courseKey)!
      .lessons.filter((l) => source.lesson(courseKey, l.slug, lang))
      .map((l) => ({
        slug: l.slug,
        link: {
          path: twinPath(`/lesson/${courseKey}/${l.slug}`, lang),
          label: bareTitle(l.title),
        },
      }));
    return lessons.map(({ slug, link }, i) => {
      const content = source.lesson(courseKey, slug, lang)!;
      const breadcrumb = [...trail, link];
      const page: Page = {
        path: link.path,
        lang,
        title: t(challenge ? 'seo.challengeTitle' : 'seo.lessonTitle', {
          lesson: link.label,
          course: label,
        }),
        description: summary(content.text),
        alternates: wherever(`/lesson/${courseKey}/${slug}`, (l) =>
          Boolean(source.lesson(courseKey, slug, l)),
        ),
        breadcrumb,
        view: {
          kind: 'lesson',
          title: link.label,
          text: content.text,
          previous: lessons[i - 1]?.link,
          next: lessons[i + 1]?.link,
        },
        lastmod: content.modified,
        jsonLd: breadcrumbLd(breadcrumb),
      };
      return { page, link };
    });
  };

  const pages: Page[] = [];
  for (const lang of LANGS) {
    const t = i18n.getFixedT(lang);
    const coursesLink = { path: twinPath('/courses', lang), label: t('nav.courses') };
    const algorithmsLink = { path: twinPath('/algorithms', lang), label: t('nav.algorithms') };
    const almanacLink = { path: twinPath('/almanac', lang), label: t('nav.almanac') };

    pages.push({
      path: twinPath('/', lang),
      lang,
      title: t('seo.landingTitle'),
      description: t('seo.landingDescription'),
      alternates: everywhere('/'),
      breadcrumb: [],
      view: { kind: 'landing' },
    });

    const courses = courseKeys.map((key) => {
      const name = courseLabel(key, t);
      const description = t(`courses.descriptions.${key}`, {
        defaultValue: byKey.get(key)!.description,
      });
      const link = { path: twinPath(`/courses/${key}`, lang), label: name };
      const lessons = lessonEntries(key, lang, [coursesLink, link]);
      const page: Page = {
        path: link.path,
        lang,
        title: t('seo.courseTitle', { course: name }),
        description,
        alternates: everywhere(`/courses/${key}`),
        breadcrumb: [coursesLink, link],
        view: { kind: 'course', name, description, lessons: lessons.map((l) => l.link) },
        lastmod: latest(lessons.map((l) => l.page.lastmod)),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name,
          description,
          url: `${ORIGIN}${link.path}`,
          inLanguage: lang,
          isAccessibleForFree: true,
          provider: { '@id': `${ORIGIN}/#organization` },
        },
      };
      return { page, link, lessons };
    });
    pages.push({
      path: coursesLink.path,
      lang,
      title: t('seo.coursesTitle'),
      description: t('seo.coursesDescription'),
      alternates: everywhere('/courses'),
      breadcrumb: [coursesLink],
      view: {
        kind: 'courses',
        courses: courses.map((c) => ({ ...c.link, description: c.page.description })),
      },
      lastmod: latest(courses.map((c) => c.page.lastmod)),
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: courses.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${ORIGIN}${c.link.path}`,
        })),
      },
    });
    for (const c of courses) pages.push(c.page, ...c.lessons.map((l) => l.page));

    const algorithms = algoKeys.map((key) => {
      const name = courseTitle(key, t);
      const description = t(`algorithms.desc.${key}`, {
        defaultValue: byKey.get(key)!.description,
      });
      const link = { path: twinPath(`/algorithms/${baseLanguage(key)}`, lang), label: name };
      const challenges = lessonEntries(key, lang, [algorithmsLink, link]);
      const page: Page = {
        path: link.path,
        lang,
        title: t('seo.algorithmListTitle', { course: courseLabel(key, t) }),
        description,
        alternates: everywhere(`/algorithms/${baseLanguage(key)}`),
        breadcrumb: [algorithmsLink, link],
        view: { kind: 'challenges', name, description, challenges: challenges.map((c) => c.link) },
        lastmod: latest(challenges.map((c) => c.page.lastmod)),
      };
      return { page, link, challenges };
    });
    pages.push({
      path: algorithmsLink.path,
      lang,
      title: t('seo.algorithmsTitle'),
      description: t('seo.algorithmsDescription'),
      alternates: everywhere('/algorithms'),
      breadcrumb: [algorithmsLink],
      view: {
        kind: 'algorithms',
        courses: algorithms.map((a) => ({ ...a.link, description: a.page.description })),
      },
      lastmod: latest(algorithms.map((a) => a.page.lastmod)),
    });
    for (const a of algorithms) pages.push(a.page, ...a.challenges.map((c) => c.page));

    const articles = source.almanac(lang).flatMap((card): Entry[] => {
      const found = source.article(card.slug, lang);
      if (!found) return [];
      const link = { path: twinPath(`/almanac/${card.slug}`, lang), label: found.article.title };
      const breadcrumb = [almanacLink, link];
      const page: Page = {
        path: link.path,
        lang,
        title: t('seo.articleTitle', { title: found.article.title }),
        description: summary(found.article.excerpt),
        alternates: wherever(`/almanac/${card.slug}`, (l) => Boolean(source.article(card.slug, l))),
        breadcrumb,
        view: { kind: 'article', article: found.article },
        lastmod: found.modified,
        jsonLd: breadcrumbLd(breadcrumb),
      };
      return [{ page, link }];
    });
    pages.push({
      path: almanacLink.path,
      lang,
      title: t('seo.almanacTitle'),
      description: t('seo.almanacDescription'),
      alternates: everywhere('/almanac'),
      breadcrumb: [almanacLink],
      view: {
        kind: 'almanac',
        articles: articles.map((a) => ({ ...a.link, description: a.page.description })),
      },
      lastmod: latest(articles.map((a) => a.page.lastmod)),
    });
    pages.push(...articles.map((a) => a.page));
  }
  return pages;
}
