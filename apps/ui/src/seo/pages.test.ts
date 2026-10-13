import { describe, it, expect } from 'vitest';
import '../i18n';
import type { Course } from '@cyberstars/shared/lesson';
import type { AlmanacArticle } from '@cyberstars/shared/almanac';
import { buildPages, summary, type ContentSource, type Page } from './pages';

const course = (key: string, title: string, slugs: string[]): Course => ({
  key,
  title,
  description: `About ${key}`,
  lessons: slugs.map((slug, i) => ({
    slug,
    title: slug === 'gpa' ? 'Easy · Student GPA' : slug,
    sortOrder: i + 1,
  })),
});

const article: AlmanacArticle = {
  slug: 'ada',
  cat: 'legends',
  tag: 'LEGENDS',
  title: 'Ada Lovelace',
  excerpt: 'The first programmer',
  fullText: 'One\n\nTwo',
  author: 'Editorial Team',
  readTime: '3 min',
  emoji: '',
  year: '1843',
};

// Python has two lessons, "loops" only in English; Java one challenge; Kotlin is still to come
const source: ContentSource = {
  courses: [
    course('python', 'Python', ['print', 'loops']),
    course('kotlin', 'Kotlin', ['hello']),
    course('algo-java', 'Java Algorithms', ['gpa']),
  ],
  lesson(courseKey, slug, lang) {
    if (lang === 'ro' && slug === 'loops') return null;
    const day = slug === 'loops' ? '2026-10-02' : '2026-10-01';
    return { text: `**${slug}** in ${lang}\n\nMore`, modified: day };
  },
  almanac: () => [{ ...article, fullText: undefined } as unknown as AlmanacArticle],
  article: (slug, lang) => (lang === 'en' ? { article, modified: '2026-09-30' } : null),
};

const pages = buildPages(source);
const page = (path: string) => pages.find((p) => p.path === path) as Page;

describe('the pre-rendered pages', () => {
  it('names a lesson from a template, in each language', () => {
    expect(page('/lesson/python/print').title).toBe(
      'print in Python, free interactive lesson | CyberStars',
    );
    expect(page('/ro/lesson/python/print').title).toBe(
      'print în Python, lecție interactivă gratuită | CyberStars',
    );
    expect(page('/lesson/python/print').description).toBe('print in en');
  });

  it('leaves the difficulty out of a challenge and files it under its language', () => {
    const gpa = page('/lesson/algo-java/gpa');
    expect(gpa.title).toBe('Student GPA in Java, coding challenge | CyberStars');
    expect(gpa.breadcrumb.map((l) => l.path)).toEqual([
      '/algorithms',
      '/algorithms/java',
      '/lesson/algo-java/gpa',
    ]);
    expect(page('/algorithms/java').view).toMatchObject({
      kind: 'challenges',
      challenges: [{ path: '/lesson/algo-java/gpa', label: 'Student GPA' }],
    });
  });

  it('gives a page without a translation no Romanian twin', () => {
    expect(page('/lesson/python/loops').alternates).toEqual({ en: '/lesson/python/loops' });
    expect(page('/ro/lesson/python/loops')).toBeUndefined();
    expect(page('/lesson/python/print').alternates).toEqual({
      en: '/lesson/python/print',
      ro: '/ro/lesson/python/print',
    });
  });

  it('links each lesson to the ones beside it, in its own language', () => {
    expect(page('/lesson/python/print').view).toMatchObject({
      next: { path: '/lesson/python/loops' },
    });
    expect(page('/lesson/python/loops').view).toMatchObject({
      previous: { path: '/lesson/python/print' },
    });
    expect(page('/ro/lesson/python/print').view).not.toHaveProperty('next.path');
  });

  it('lists every lesson on its course page, dated by the newest one', () => {
    const python = page('/courses/python');
    expect(python.view).toMatchObject({
      kind: 'course',
      lessons: [{ path: '/lesson/python/print' }, { path: '/lesson/python/loops' }],
    });
    expect(python.lastmod).toBe('2026-10-02');
    expect(python.jsonLd).toMatchObject({ '@type': 'Course', name: 'Python', inLanguage: 'en' });
  });

  it('keeps a course still to come out of the index and off the course list', () => {
    expect(page('/courses/kotlin').noindex).toBe(true);
    expect(page('/lesson/kotlin/hello').noindex).toBe(true);
    expect(page('/courses').view).toMatchObject({ courses: [{ path: '/courses/python' }] });
  });

  it('writes the landing page and the lists in both languages', () => {
    for (const path of ['/', '/courses', '/algorithms', '/almanac']) {
      const ro = path === '/' ? '/ro' : `/ro${path}`;
      expect(page(path).alternates).toEqual({ en: path, ro });
      expect(page(ro).lang).toBe('ro');
    }
    expect(page('/ro').title).toBe('CyberStars: învață programare gratis, direct în browser');
  });

  it('gives each Almanac article its own page, only where it is translated', () => {
    expect(page('/almanac/ada')).toMatchObject({
      title: 'Ada Lovelace | CyberStars Almanac',
      description: 'The first programmer',
      lastmod: '2026-09-30',
      alternates: { en: '/almanac/ada' },
    });
    expect(page('/ro/almanac/ada')).toBeUndefined();
    expect(page('/ro/almanac').view).toMatchObject({ articles: [] });
  });

  it('carries a breadcrumb trail as structured data', () => {
    expect(page('/lesson/python/print').jsonLd).toMatchObject({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, item: 'https://cyberstars.app/courses' },
        { position: 2, item: 'https://cyberstars.app/courses/python' },
        { position: 3, name: 'print', item: 'https://cyberstars.app/lesson/python/print' },
      ],
    });
  });
});

describe('summary', () => {
  it('takes the first paragraph of prose as plain text', () => {
    const md = '## Title\n\n```py\nprint(1)\n```\n\nThe **first** [real](x) :green[line]';
    expect(summary(md)).toBe('The first real line');
  });

  it('cuts a long paragraph at a word', () => {
    expect(summary('one two three four', 12)).toBe('one two…');
    expect(summary('abcdefghijklmnop', 6)).toBe('abcde…');
  });

  it('is empty when there is no prose', () => {
    expect(summary('```c\nint x;\n```')).toBe('');
  });
});
