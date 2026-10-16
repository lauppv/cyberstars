// Build-time generator for the static lesson content the client fetches directly
// (no API/DB round-trip). Mirrors the almanac approach: emit plain files under
// the app's static files folder that nginx (prod) and Vite's publicDir (dev)
// serve as-is.
//
//   <public>/curriculum.json      : same shape/order as the old GET /api/curriculum
//   <public>/lessons/<courseKey>/ : lesson bodies (<slug>.md) and starter code
//                                   (<slug>-code.md), copied from the source tree
//                                   (solutions are not: they stay server-side)
//
// The app names its static files folder; the UI runs it before dev and build:
//
//   tsx packages/content/scripts/generate-static-content.ts apps/ui/public
//
// The output is generated, not committed.
import fs from 'fs';
import path from 'path';
import { courses, lessons } from '../curriculum.js';
import { courseDir } from '../paths.js';

const [outDir] = process.argv.slice(2);
if (!outDir) {
  console.error('Usage: generate-static-content.ts <public dir>');
  process.exit(1);
}
const PUBLIC_DIR = path.resolve(outDir);
const LESSONS_OUT = path.join(PUBLIC_DIR, 'lessons');

// curriculum.json: courses by sortOrder, lessons by sortOrder within a course,
// identical to what curriculum.repository + lesson.service used to return.
const curriculum = [...courses]
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((course) => ({
    key: course.key,
    title: course.title,
    description: course.description,
    lessons: lessons
      .filter((lesson) => lesson.courseKey === course.key)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        sortOrder: lesson.sortOrder,
        // Lessons with a <slug>-tests.json are validated by the server judge;
        // the client uses this flag to show the Run Tests button.
        ...(fs.existsSync(path.join(courseDir(course.key), `${lesson.slug}-tests.json`))
          ? { hasTests: true }
          : {}),
        // Solutions are served only through POST /api/usage/solution (signed-in,
        // metered), so the client learns whether one exists from this flag.
        ...(fs.existsSync(path.join(courseDir(course.key), `${lesson.slug}-solution.md`))
          ? { hasSolution: true }
          : {}),
      })),
  }));

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'curriculum.json'),
  JSON.stringify(curriculum, null, 2) + '\n',
);

// Translation subfolders that sit alongside the English source (e.g.
// lessons/python/ro/) and are mirrored into public/lessons/<key>/<lang>/.
const LOCALE_DIRS = ['ro'];

// Copy every *.md from srcDir into destDir. Only *.md is exposed: linux
// -setup.json files stay server-side (the terminal sandbox reads them on session
// create), and locale subdirectories are handled separately below. -solution.md
// stays server-side too: guests must not read solutions, and signed-in students
// get them through the metered reveal endpoint.
function copyMarkdown(srcDir: string, destDir: string): number {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  let n = 0;
  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith('.md')) continue; // skips locale subdirs (they're not *.md)
    if (file.endsWith('-solution.md')) continue;
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    n++;
  }
  return n;
}

fs.rmSync(LESSONS_OUT, { recursive: true, force: true });
let copied = 0;
for (const course of curriculum) {
  const src = courseDir(course.key);
  const dest = path.join(LESSONS_OUT, course.key);
  copied += copyMarkdown(src, dest);
  for (const locale of LOCALE_DIRS) {
    copied += copyMarkdown(path.join(src, locale), path.join(dest, locale));
  }
}

console.log(
  `Generated public/curriculum.json (${curriculum.length} courses) and copied ${copied} markdown files to public/lessons/.`,
);
