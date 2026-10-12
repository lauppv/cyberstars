// After `vite build`: render the landing page to HTML and put it into
// dist/index.html, so a crawler or a link preview reads the page without
// running a script. Only the home address can be indexed (the rest of the app
// lives after the #), so this is the one page worth rendering.
//
// The HTML goes to everyone on that address. The app draws over it with
// createRoot, and public/boot.js hides it first from a signed-in student and
// from a visitor reading Romanian. Blocks render visible by default, which is
// what keeps them readable here, where no script ever touches them.
import { readFileSync, writeFileSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import type { Course } from '@cyberstars/shared/lesson';
import '../src/i18n';
import { CurriculumProvider } from '../src/context/CurriculumContext';
import { LandingPage } from '../src/pages/LandingPage';

const dist = new URL('../dist/', import.meta.url);
const courses = JSON.parse(readFileSync(new URL('curriculum.json', dist), 'utf8')) as Course[];

const html = renderToString(
  <MemoryRouter>
    <CurriculumProvider initialCourses={courses}>
      <LandingPage />
    </CurriculumProvider>
  </MemoryRouter>,
);

const indexUrl = new URL('index.html', dist);
const shell = readFileSync(indexUrl, 'utf8');
const root = '<div id="root"></div>';
if (!shell.includes(root)) throw new Error(`prerender: ${root} not found in dist/index.html`);
writeFileSync(
  indexUrl,
  shell.replace(root, `<div id="root"><div data-prerender>${html}</div></div>`),
);
console.log(`prerender: landing page written into dist/index.html (${html.length} chars)`);
