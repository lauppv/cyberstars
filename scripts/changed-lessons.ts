// Plans the lesson-tests CI job: from the files a PR changes, which lessons
// check-tests has to grade again, split into shards per runtime. Each shard is
// one matrix entry (one runner, one judge image pulled); an empty plan skips
// the job.
//
// - A lesson's spec, reference solution or variants changed: that lesson, EN
//   and RO.
// - A runtime's runner changed: every lesson of that language, EN only (the
//   variants are EN, and a RO spec differs from its twin only in names).
// - The judge engine shared by all three changed: every language.
// - Only this planner or its workflow changed: one lesson per language, so
//   the job itself is exercised without paying for a whole run.
//
// --all (the workflow's manual run) grades every lesson, EN and RO.
//
//   git diff --name-only HEAD^1 HEAD | npx tsx scripts/changed-lessons.ts
//   npx tsx scripts/changed-lessons.ts --all
import fs from 'fs';
import { fileURLToPath } from 'url';
import { contentDir } from '../server/services/paths.js';
import { getRuntime } from '../server/runtimes/registry.js';

type Runtime = 'python' | 'c' | 'java';

const COURSES: Record<Runtime, string[]> = {
  python: ['python', 'algo-python'],
  c: ['c', 'algo-c'],
  java: ['java', 'algo-java'],
};

// For a whole language, sized on the measured judge cost (~70 ms per case for
// Python, ~120 ms for C, ~800 ms for Java, plus each lesson's variants) to
// keep a shard near 20 minutes.
const WHOLE_SHARDS: Record<Runtime, number> = { python: 2, c: 1, java: 4 };

const RUNTIME_FILES: Record<Runtime, string[]> = {
  python: ['server/services/lesson-tests.runner.py', 'server/runtimes/python.ts'],
  c: [
    'server/services/lesson-tests.runner.c.py',
    'server/services/c-analysis.ts',
    'server/services/wasm/tree-sitter-c.wasm',
    'server/runtimes/c.ts',
  ],
  java: ['server/services/lesson-tests.runner.java', 'server/runtimes/java.ts'],
};

const ENGINE_FILES = [
  'server/services/lesson-tests.service.ts',
  'server/services/code-container.service.ts',
  'server/services/docker-exec.ts',
  'server/services/judge-queue.ts',
  'server/services/reference-cache.ts',
  'server/services/paths.ts',
  'server/runtimes/registry.ts',
  'server/runtimes/types.ts',
  'shared/tests.ts',
  'scripts/check-tests.ts',
];

const SELF_FILES = ['scripts/changed-lessons.ts', '.github/workflows/lesson-tests.yml'];

// server/lessons/java/ro/hashmap-tests.json -> java/hashmap,
// server/algorithms/c/binary-search-c-solution.md -> algo-c/binary-search-c,
// test/lesson-variants/python/string-reverse/reject-slice-in-helper.py -> python/string-reverse.
const LESSON_FILE =
  /^server\/(lessons|algorithms)\/(python|c|java)\/(?:ro\/)?([^/]+)-(?:tests\.json|solution\.md)$/;
const VARIANT_FILE = /^test\/lesson-variants\/([^/]+)\/([^/]+)\/[^/]+$/;

export interface Shard {
  name: string;
  image: string;
  targets: string;
}

function changedLesson(file: string): string | null {
  const lesson = LESSON_FILE.exec(file);
  if (lesson) {
    const [, root, lang, slug] = lesson;
    return `${root === 'algorithms' ? `algo-${lang}` : lang}/${slug}`;
  }
  const variant = VARIANT_FILE.exec(file);
  return variant ? `${variant[1]}/${variant[2]}` : null;
}

function lessonsOf(courseKey: string): string[] {
  return fs
    .readdirSync(contentDir(courseKey))
    .filter((f) => f.endsWith('-tests.json'))
    .map((f) => `${courseKey}/${f.slice(0, -'-tests.json'.length)}`)
    .sort();
}

export function planChecks(changed: string[], all = false): Shard[] {
  const touched = (files: string[]) => changed.some((f) => files.includes(f));
  const engine = touched(ENGINE_FILES);
  const self = touched(SELF_FILES);
  const shards: Shard[] = [];
  for (const runtime of Object.keys(COURSES) as Runtime[]) {
    const courses = COURSES[runtime];
    const whole = all || engine || touched(RUNTIME_FILES[runtime]);
    // lesson -> the one language to grade, or null for EN and RO.
    const targets = new Map<string, 'en' | null>();
    if (whole) {
      for (const lesson of courses.flatMap(lessonsOf)) targets.set(lesson, all ? null : 'en');
    } else if (self) {
      targets.set(lessonsOf(courses[0])[0], 'en');
    }
    for (const lesson of changed.map(changedLesson)) {
      if (lesson && courses.includes(lesson.split('/')[0])) targets.set(lesson, null);
    }
    if (targets.size === 0) continue;

    const args = [...targets].sort().map(([lesson, lang]) => (lang ? `${lesson}:${lang}` : lesson));
    const count = Math.min(whole ? WHOLE_SHARDS[runtime] : 1, args.length);
    const image = getRuntime(runtime)!.image;
    for (let i = 0; i < count; i++) {
      shards.push({
        name: count > 1 ? `${runtime} ${i + 1}/${count}` : runtime,
        image,
        targets: args.filter((_, j) => j % count === i).join(' '),
      });
    }
  }
  return shards;
}

/* v8 ignore start */
// Run as a CLI (the workflow's plan step) but stay importable by the unit test.
const invokedPath = process.argv[1] ? fs.realpathSync(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const all = process.argv.includes('--all');
  const changed = all ? [] : fs.readFileSync(0, 'utf8').split('\n').filter(Boolean);
  const shards = planChecks(changed, all);
  for (const s of shards) console.error(`${s.name}: ${s.targets.split(' ').length} target(s)`);
  console.log(JSON.stringify({ include: shards }));
}
/* v8 ignore stop */
