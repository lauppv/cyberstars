// Build-time generator for the static lesson content the client fetches directly
// (no API/DB round-trip). Mirrors the almanac approach: emit plain files under
// the app's static files folder that the server (prod) and Vite's publicDir (dev)
// serve as-is.
//
//   <public>/curriculum.json      : same shape/order as the old GET /api/curriculum
//   <public>/lessons/<courseKey>/ : lesson bodies (<slug>.md) and starter code
//                                   (<slug>-code.md), copied from the source tree
//                                   (solutions and hidden parts are not: they
//                                   stay server-side);
//                                   a multi-language course has one folder per
//                                   language, <courseKey>/<language>/, each with
//                                   the course's visuals put into its lessons
//                                   (see visuals.ts)
//
// The app names its static files folder; the UI runs it before dev and build:
//
//   tsx packages/content/scripts/generate-static-content.ts apps/ui/public
//
// The output is generated, not committed.
import fs from 'fs';
import path from 'path';
import { CODE_LANGUAGES, isMultiLanguage } from '@cyberstars/shared/constants';
import { courses, lessons } from '../curriculum.js';
import { lessonTitlesRo } from '../curriculum-ro.js';
import { courseDir } from '../paths.js';
import { visualFiller } from '../visuals.js';

const [outDir] = process.argv.slice(2);
if (!outDir) {
  console.error('Usage: generate-static-content.ts <public dir>');
  process.exit(1);
}
const PUBLIC_DIR = path.resolve(outDir);
const LESSONS_OUT = path.join(PUBLIC_DIR, 'lessons');

// A multi-language course teaches every lesson in each language, so the
// build stops on a lesson missing one, or missing the starter, tests,
// solution or hidden part its Python twin has (`hasTests` and `hasSolution`
// are read from Python).
const missing: string[] = [];
for (const lesson of lessons.filter((l) => isMultiLanguage(l.courseKey))) {
  const has = (language: string, suffix: string) =>
    fs.existsSync(path.join(courseDir(lesson.courseKey, language), `${lesson.slug}${suffix}`));
  for (const language of CODE_LANGUAGES) {
    for (const suffix of ['.md', '-code.md', '-tests.json', '-solution.md', '-harness.md']) {
      if ((suffix === '.md' || has('python', suffix)) && !has(language, suffix)) {
        missing.push(`${lesson.courseKey}/${language}/${lesson.slug}${suffix}`);
      }
    }
  }
}
if (missing.length) {
  console.error(`A multi-language lesson is missing a language:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}

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
        ...(lessonTitlesRo[course.key]?.[lesson.slug]
          ? { titleRo: lessonTitlesRo[course.key][lesson.slug] }
          : {}),
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
// get them through the metered reveal endpoint. So does -harness.md, the part
// of a challenge's program the student doesn't see, which only the server runs.
// Lessons whose visuals couldn't be put in; the build stops on them once every file is through
const broken: string[] = [];

// `fill` rewrites a file's text on the way, as a multi-language course does to put its visuals in.
function copyMarkdown(srcDir: string, destDir: string, fill?: (text: string) => string): number {
  if (!fs.existsSync(srcDir)) return 0;
  fs.mkdirSync(destDir, { recursive: true });
  let n = 0;
  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith('.md')) continue; // skips locale subdirs (they're not *.md)
    if (file.endsWith('-solution.md') || file.endsWith('-harness.md')) continue;
    const src = path.join(srcDir, file);
    if (fill) {
      try {
        fs.writeFileSync(path.join(destDir, file), fill(fs.readFileSync(src, 'utf8')));
      } catch (err) {
        broken.push(
          `${path.relative(path.dirname(import.meta.dirname), src)}: ${(err as Error).message}`,
        );
      }
    } else {
      fs.copyFileSync(src, path.join(destDir, file));
    }
    n++;
  }
  return n;
}

fs.rmSync(LESSONS_OUT, { recursive: true, force: true });
let copied = 0;
for (const course of curriculum) {
  const folders = isMultiLanguage(course.key)
    ? CODE_LANGUAGES.map((language) => ({
        src: courseDir(course.key, language),
        dest: path.join(LESSONS_OUT, course.key, language),
        language,
      }))
    : [{ src: courseDir(course.key), dest: path.join(LESSONS_OUT, course.key), language: null }];
  for (const { src, dest, language } of folders) {
    copied += copyMarkdown(src, dest, language ? visualFiller(course.key, language) : undefined);
    for (const locale of LOCALE_DIRS) {
      copied += copyMarkdown(
        path.join(src, locale),
        path.join(dest, locale),
        language ? visualFiller(course.key, language, locale) : undefined,
      );
    }
  }
}
if (broken.length) {
  console.error(`A lesson names a visual that can't be put in:\n  ${broken.join('\n  ')}`);
  process.exit(1);
}

console.log(
  `Generated public/curriculum.json (${curriculum.length} courses) and copied ${copied} markdown files to public/lessons/.`,
);
