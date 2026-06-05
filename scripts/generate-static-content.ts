// Build-time generator for the static lesson content the client fetches directly
// (no API/DB round-trip). Mirrors the almanac approach: emit plain files under
// public/ that nginx (prod) and Vite's publicDir (dev) serve as-is.
//
//   public/curriculum.json        — same shape/order as the old GET /api/curriculum
//   public/lessons/<courseKey>/   — lesson bodies (<slug>.md) and starter code
//                                   (<slug>-code.md), copied from the source tree
//
// Run by `predev` and `prebuild`. The output is generated, not committed.
import fs from 'fs';
import path from 'path';
import { courses, lessons } from '../prisma/curriculum.data.js';

const ROOT = process.cwd();
const LESSONS_DIR = path.join(ROOT, 'server', 'lessons');
const ALGO_DIR = path.join(ROOT, 'server', 'algorithms');
const PUBLIC_DIR = path.join(ROOT, 'public');
const LESSONS_OUT = path.join(PUBLIC_DIR, 'lessons');

// Algo course keys live under server/algorithms/<lang> (mirrors server/services/paths.ts).
const ALGO_MAP: Record<string, string> = {
  'algo-python': 'python',
  'algo-java': 'java',
  'algo-c': 'c',
};

function sourceDir(courseKey: string): string {
  const algo = ALGO_MAP[courseKey];
  return algo ? path.join(ALGO_DIR, algo) : path.join(LESSONS_DIR, courseKey);
}

// curriculum.json: courses by sortOrder, lessons by sortOrder within a course —
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
      .map((lesson) => ({ slug: lesson.slug, title: lesson.title, sortOrder: lesson.sortOrder })),
  }));

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'curriculum.json'),
  JSON.stringify(curriculum, null, 2) + '\n',
);

// Copy lesson + starter-code markdown. Only *.md is exposed: linux -setup.json
// files stay server-side (the terminal sandbox reads them on session create).
fs.rmSync(LESSONS_OUT, { recursive: true, force: true });
let copied = 0;
for (const course of curriculum) {
  const src = sourceDir(course.key);
  if (!fs.existsSync(src)) continue; // kotlin has no lesson files yet
  const dest = path.join(LESSONS_OUT, course.key);
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    if (!file.endsWith('.md')) continue;
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
    copied++;
  }
}

console.log(
  `Generated public/curriculum.json (${curriculum.length} courses) and copied ${copied} markdown files to public/lessons/.`,
);
