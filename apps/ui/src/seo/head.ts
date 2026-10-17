// Turns the page shell Vite builds (index.html, written for the landing page)
// into one page's HTML, and lists every indexable page in the sitemap.
import i18n from 'i18next';
import { ORIGIN, type Page } from './pages';

const OG_LOCALE = { en: 'en_US', ro: 'ro_RO' } as const;

function escape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// A JSON-LD block is data inside a <script>: only "</" could end it early
function jsonLdScript(data: object): string {
  const json = JSON.stringify(data).replace(/<\//g, '<\\/');
  return `<script type="application/ld+json">${json}</script>`;
}

function hreflangLinks(page: Page): string[] {
  const links = Object.entries(page.alternates).map(
    ([lang, path]) => `<link rel="alternate" hreflang="${lang}" href="${ORIGIN}${path}" />`,
  );
  if (page.alternates.en) {
    links.push(
      `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${page.alternates.en}" />`,
    );
  }
  return links;
}

// Replaces one tag of the shell, and fails the build if the shell changed
// shape, so a page never ships with the landing page's title by mistake
function swap(html: string, pattern: RegExp, replacement: string): string {
  if (!pattern.test(html)) throw new Error(`prerender: ${pattern} not found in the page shell`);
  return html.replace(pattern, replacement);
}

const meta = (attr: string, name: string) =>
  new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"\\s*/>`);

export function withHead(shell: string, page: Page, body: string): string {
  const url = `${ORIGIN}${page.path}`;
  const title = escape(page.title);
  const description = escape(page.description);
  let html = shell;
  html = swap(html, /<html lang="[^"]*">/, `<html lang="${page.lang}">`);
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = swap(
    html,
    meta('name', 'description'),
    `<meta name="description" content="${description}" />`,
  );
  html = swap(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`,
  );
  html = swap(html, meta('property', 'og:url'), `<meta property="og:url" content="${url}" />`);
  html = swap(
    html,
    meta('property', 'og:title'),
    `<meta property="og:title" content="${title}" />`,
  );
  html = swap(
    html,
    meta('property', 'og:description'),
    `<meta property="og:description" content="${description}" />`,
  );
  html = swap(
    html,
    meta('property', 'og:image:alt'),
    `<meta property="og:image:alt" content="${escape(i18n.getFixedT(page.lang)('seo.imageAlt'))}" />`,
  );
  const locales = Object.keys(page.alternates)
    .filter((lang) => lang !== page.lang)
    .map(
      (lang) =>
        `<meta property="og:locale:alternate" content="${OG_LOCALE[lang as Page['lang']]}" />`,
    );
  const extra = [
    `<meta property="og:locale" content="${OG_LOCALE[page.lang]}" />`,
    ...locales,
    ...hreflangLinks(page),
    ...(page.jsonLd ? [jsonLdScript(page.jsonLd)] : []),
  ];
  html = swap(html, /<\/head>/, `${extra.join('\n    ')}\n  </head>`);
  return swap(
    html,
    /<div id="root"><\/div>/,
    `<div id="root"><div data-prerender>${body}</div></div>`,
  );
}

// Every page, each with its twins in the other language
export function sitemap(pages: Page[]): string {
  const entries = pages.map((page) => {
    const lines = [`    <loc>${ORIGIN}${page.path}</loc>`];
    if (page.lastmod) lines.push(`    <lastmod>${page.lastmod}</lastmod>`);
    for (const link of hreflangLinks(page)) {
      lines.push(`    ${link.replace(/^<link /, '<xhtml:link ')}`);
    }
    return `  <url>\n${lines.join('\n')}\n  </url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}
