import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import '../i18n';
import { StaticPage } from './StaticPages';
import type { Page, View } from './pages';

const draw = (view: View, extra: Partial<Page> = {}) =>
  renderToString(
    <StaticPage
      page={{
        path: '/x',
        lang: 'en',
        title: '',
        description: '',
        alternates: { en: '/x' },
        breadcrumb: [],
        view,
        ...extra,
      }}
    />,
  );

describe('the static pages', () => {
  it('draws a lesson with plain code, its trail and the lessons beside it', () => {
    const html = draw(
      {
        kind: 'lesson',
        title: 'Booleans',
        text: 'Use **True**\n\n```py\nprint(True)\n```',
        previous: { path: '/lesson/python/if', label: 'If' },
        next: { path: '/lesson/python/loops', label: 'Loops' },
      },
      {
        breadcrumb: [
          { path: '/courses', label: 'Courses' },
          { path: '/courses/python', label: 'Python' },
          { path: '/lesson/python/booleans', label: 'Booleans' },
        ],
        alternates: { en: '/lesson/python/booleans', ro: '/ro/lesson/python/booleans' },
      },
    );
    expect(html).toContain('<h1>Booleans</h1>');
    expect(html).toContain('<code class="language-py">print(True)');
    expect(html).toContain('<a href="/courses/python">Python</a>');
    expect(html).not.toContain('<a href="/lesson/python/booleans">Booleans</a>');
    expect(html).toContain('href="/lesson/python/if" rel="prev"');
    expect(html).toContain('href="/lesson/python/loops" rel="next"');
    expect(html).toContain('href="/ro/lesson/python/booleans"');
  });

  it('draws the lists as links, in the page language', () => {
    const link = { path: '/courses/python', label: 'Python', description: 'Start here' };
    expect(draw({ kind: 'courses', courses: [link] })).toContain(
      '<a href="/courses/python">Python</a><p>Start here</p>',
    );
    const ro = draw({ kind: 'algorithms', courses: [] }, { lang: 'ro' });
    expect(ro).toContain('<h1>Algoritmi</h1>');
    expect(ro).toContain('<a href="/ro/courses">');
    expect(draw({ kind: 'almanac', articles: [link] })).toContain('<h1>Almanac</h1>');
  });

  it('draws a course and a challenge list with every entry', () => {
    const lessons = [{ path: '/lesson/c/print', label: 'Print' }];
    expect(draw({ kind: 'course', name: 'C', description: 'Low level', lessons })).toContain(
      '<ol><li><a href="/lesson/c/print">Print</a></li></ol>',
    );
    expect(
      draw({ kind: 'challenges', name: 'C Algorithms', description: '', challenges: lessons }),
    ).toContain('<h1>C Algorithms</h1>');
  });

  it('draws an article paragraph by paragraph', () => {
    const html = draw({
      kind: 'article',
      article: {
        slug: 'ada',
        cat: '',
        tag: '',
        title: 'Ada',
        excerpt: '',
        fullText: 'One\n\nTwo',
        author: '',
        readTime: '',
        emoji: '',
      },
    });
    expect(html).toContain('<article><h1>Ada</h1><p>One</p><p>Two</p></article>');
  });

  it('leaves the landing page to the app', () => {
    expect(draw({ kind: 'landing' })).not.toContain('<h1>');
  });
});
