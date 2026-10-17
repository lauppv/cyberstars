import { describe, it, expect } from 'vitest';
import { sitemap, withHead } from './head';
import type { Page } from './pages';

// The tags of apps/ui/index.html that each page rewrites
const shell = `<!doctype html>
<html lang="en">
  <head>
    <title>Landing</title>
    <meta
      name="description"
      content="Landing description"
    />
    <link rel="canonical" href="https://cyberstars.app/" />
    <meta property="og:url" content="https://cyberstars.app/" />
    <meta property="og:title" content="Landing" />
    <meta
      property="og:description"
      content="Landing description"
    />
    <meta
      property="og:image:alt"
      content="The landing picture"
    />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

const page: Page = {
  path: '/ro/lesson/python/print',
  lang: 'ro',
  title: 'Print în Python & "ghilimele"',
  description: 'Prima lecție <b>',
  alternates: { en: '/lesson/python/print', ro: '/ro/lesson/python/print' },
  breadcrumb: [],
  view: { kind: 'lesson', title: 'Print', text: '' },
  lastmod: '2026-10-13',
  jsonLd: { name: '</script><script>alert(1)' },
};

describe('withHead', () => {
  const html = withHead(shell, page, '<h1>Print</h1>');

  it('names the page in its own language, at its own address', () => {
    expect(html).toContain('<html lang="ro">');
    expect(html).toContain('<title>Print în Python &amp; &quot;ghilimele&quot;</title>');
    expect(html).toContain('<meta name="description" content="Prima lecție &lt;b&gt;" />');
    expect(html).toContain(
      '<link rel="canonical" href="https://cyberstars.app/ro/lesson/python/print" />',
    );
    expect(html).toContain(
      '<meta property="og:url" content="https://cyberstars.app/ro/lesson/python/print" />',
    );
    expect(html).not.toContain('Landing');
    expect(html).not.toContain('The landing picture');
    expect(html).toContain('<meta property="og:image:alt" content="CyberStars: învață');
    expect(html).toContain('<meta property="og:locale" content="ro_RO" />');
    expect(html).toContain('<meta property="og:locale:alternate" content="en_US" />');
  });

  it('points to its twin, with English as the default', () => {
    expect(html).toContain(
      '<link rel="alternate" hreflang="en" href="https://cyberstars.app/lesson/python/print" />',
    );
    expect(html).toContain(
      '<link rel="alternate" hreflang="x-default" href="https://cyberstars.app/lesson/python/print" />',
    );
  });

  it('puts the content in the root and keeps structured data from closing its script', () => {
    expect(html).toContain('<div id="root"><div data-prerender><h1>Print</h1></div></div>');
    expect(html).toContain('<\\/script><script>alert(1)');
  });

  it('fails the build when the shell lost a tag it rewrites', () => {
    expect(() => withHead(shell.replace(/<title>.*<\/title>/, ''), page, '')).toThrow(
      /not found in the page shell/,
    );
  });
});

describe('sitemap', () => {
  it('lists every page with its date and twins', () => {
    const xml = sitemap([
      page,
      { ...page, path: '/ro', lastmod: undefined, alternates: { ro: '/ro' } },
    ]);
    expect(xml).toContain('<loc>https://cyberstars.app/ro/lesson/python/print</loc>');
    expect(xml).toContain('<lastmod>2026-10-13</lastmod>');
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="x-default" href="https://cyberstars.app/lesson/python/print" />',
    );
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml).toMatch(/<loc>https:\/\/cyberstars.app\/ro<\/loc>\n {4}<xhtml:link/);
  });
});
