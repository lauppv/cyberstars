// After `vite build`: write every public page as HTML, in English and in
// Romanian, so a crawler, an AI answer engine or a link preview reads it
// without running a script. Each page gets its own title, description,
// canonical address, links to its twin in the other language and structured
// data, plus the sitemap listing them all.
//
// The landing page goes into dist/index.html (and dist/ro.html) drawn by the
// app's own LandingPage, which a visitor sees until the app draws over it.
// Every other page goes to dist/<address>.html as plain HTML (StaticPage),
// which public/boot.js hides from any browser running scripts, and the server
// sends for its address. Blocks render visible by default, which keeps the
// landing page readable here, where no script ever touches it.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import i18n from 'i18next';
import type { Course } from '@cyberstars/shared/lesson';
import type { AlmanacArticle, AlmanacCard } from '@cyberstars/shared/almanac';
import { courseDir } from '../../../packages/content/paths';
import '../src/i18n';
import type { Lang } from '../src/i18n';
import { CurriculumProvider } from '../src/context/CurriculumContext';
import { LandingPage } from '../src/pages/LandingPage';
import { buildPages, type ContentSource, type Page } from '../src/seo/pages';
import { sitemap, withHead } from '../src/seo/head';
import { StaticPage } from '../src/seo/StaticPages';

const dist = path.join(import.meta.dirname, '../dist');
const almanacDir = path.join(import.meta.dirname, '../public/almanac');

// When a file last changed, as the sitemap's lastmod: on the server a deploy's
// git pull rewrites only the files it changes
const modified = (file: string) => statSync(file).mtime.toISOString().slice(0, 10);

// English sits at the top of a course's folder, each translation in its own subfolder
const localizedFile = (dir: string, file: string, lang: Lang) =>
  lang === 'en' ? path.join(dir, file) : path.join(dir, lang, file);

const source: ContentSource = {
  courses: JSON.parse(readFileSync(path.join(dist, 'curriculum.json'), 'utf8')) as Course[],
  lesson(courseKey, slug, lang) {
    const file = localizedFile(courseDir(courseKey), `${slug}.md`, lang);
    if (!existsSync(file)) return null;
    return { text: readFileSync(file, 'utf8'), modified: modified(file) };
  },
  almanac(lang) {
    const file = localizedFile(almanacDir, 'index.json', lang);
    return JSON.parse(readFileSync(file, 'utf8')) as AlmanacCard[];
  },
  article(slug, lang) {
    const file = localizedFile(almanacDir, path.join('articles', `${slug}.json`), lang);
    if (!existsSync(file)) return null;
    const article = JSON.parse(readFileSync(file, 'utf8')) as AlmanacArticle;
    return { article, modified: modified(file) };
  },
};

function renderBody(page: Page): string {
  if (page.view.kind !== 'landing') return renderToString(<StaticPage page={page} />);
  return renderToString(
    <MemoryRouter>
      <CurriculumProvider initialCourses={source.courses}>
        <LandingPage />
      </CurriculumProvider>
    </MemoryRouter>,
  );
}

// '/' is the shell's own file; every other address its own .html beside it
function outputFile(page: Page): string {
  return page.path === '/' ? path.join(dist, 'index.html') : path.join(dist, `${page.path}.html`);
}

const shell = readFileSync(path.join(dist, 'index.html'), 'utf8');
const pages = buildPages(source);
for (const page of pages) {
  // LandingPage reads the language from i18n, like the rest of the app
  await i18n.changeLanguage(page.lang);
  const file = outputFile(page);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, withHead(shell, page, renderBody(page)));
}
writeFileSync(path.join(dist, 'sitemap.xml'), sitemap(pages));

const indexed = pages.filter((p) => !p.noindex).length;
console.log(`prerender: ${pages.length} pages written, ${indexed} in the sitemap`);
