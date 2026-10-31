// Plans the lesson-tests CI job: from the files a PR changes, which lessons
// check-tests has to grade again, split into shards per runtime. Each shard is
// one matrix entry (one runner, one judge image pulled); an empty plan skips
// the job.
//
// - A lesson's spec, reference solution, hidden part or variants changed:
//   that lesson, EN and RO.
// - A runtime's runner changed: every lesson of that language, EN only (the
//   variants are EN, and a RO spec differs from its twin only in names).
// - The judge engine shared by all three changed: every language.
// - Only this planner or its workflow changed: one lesson per language, so
//   the job itself is exercised without paying for a whole run.
//
// --all (the workflow's manual run) grades every lesson, EN and RO.
//
//   git diff --name-only HEAD^1 HEAD | npx tsx apps/api/scripts/changed-lessons.ts
//   npx tsx apps/api/scripts/changed-lessons.ts --all
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MULTI_LANGUAGE_COURSE_KEYS, isMultiLanguage } from '@cyberstars/shared/constants';
import { contentDir } from '../src/services/paths.js';
import { getRuntime } from '../src/runtimes/registry.js';

type Runtime = 'python' | 'c' | 'java';

// A multi-language course counts once per language, as <course>/<language>.
const multi = (runtime: Runtime) => MULTI_LANGUAGE_COURSE_KEYS.map((key) => `${key}/${runtime}`);

const COURSES: Record<Runtime, string[]> = {
  python: ['python', 'algo-python', ...multi('python')],
  c: ['c', 'algo-c', ...multi('c')],
  java: ['java', 'algo-java', ...multi('java')],
};

// For a whole language, sized on the measured judge cost (~70 ms per case for
// Python, ~120 ms for C, ~800 ms for Java, plus each lesson's variants) to
// keep a shard near 20 minutes.
const WHOLE_SHARDS: Record<Runtime, number> = { python: 2, c: 1, java: 4 };

export const RUNTIME_FILES: Record<Runtime, string[]> = {
  python: [
    'apps/api/src/services/lesson-tests.runner.py',
    'framework/sandbox/src/languages/python.ts',
  ],
  c: [
    'apps/api/src/services/lesson-tests.runner.c.py',
    'apps/api/src/services/c-analysis.ts',
    'apps/api/src/services/wasm/tree-sitter-c.wasm',
    'framework/sandbox/src/languages/c.ts',
  ],
  java: [
    'apps/api/src/services/lesson-tests.runner.java',
    'framework/sandbox/src/languages/java.ts',
  ],
};

export const ENGINE_FILES = [
  'apps/api/src/services/lesson-tests.service.ts',
  'apps/api/src/services/harness.ts',
  'apps/api/src/services/code-container.service.ts',
  'framework/sandbox/src/docker.ts',
  'apps/api/src/services/judge-queue.ts',
  'framework/sandbox/src/slots.ts',
  'apps/api/src/services/sandbox-slots.ts',
  'apps/api/src/services/guest-sandboxes.ts',
  'apps/api/src/services/reference-cache.ts',
  'apps/api/src/services/paths.ts',
  'packages/content/paths.ts',
  'apps/api/src/runtimes/registry.ts',
  'framework/sandbox/src/languages/types.ts',
  'framework/sandbox/src/languages/index.ts',
  'packages/shared/tests.ts',
  'apps/api/scripts/check-tests.ts',
];

export const SELF_FILES = [
  'apps/api/scripts/changed-lessons.ts',
  '.github/workflows/lesson-tests.yml',
];

// packages/content/lessons/java/ro/hashmap-tests.json -> java/hashmap,
// packages/content/algorithms/c/binary-search-c-solution.md -> algo-c/binary-search-c,
// packages/content/variants/python/string-reverse/reject-slice-in-helper.py -> python/string-reverse,
// and on a multi-language course, with the language after the course:
// packages/content/lessons/trees-graphs/c/trees-tests.json -> trees-graphs/c/trees,
// packages/content/algorithms/trees-graphs/c/max-depth-tests.json -> algo-trees-graphs/c/max-depth
// (its -harness.md too),
// packages/content/variants/trees-graphs/c/trees/reject-no-struct.c -> trees-graphs/c/trees.
const LESSON_FILE =
  /^packages\/content\/(lessons|algorithms)\/(python|c|java)\/(?:ro\/)?([^/]+)-(?:tests\.json|solution\.md|harness\.md)$/;
const VARIANT_FILE = /^packages\/content\/variants\/([^/]+)\/([^/]+)\/[^/]+$/;
const MULTI_LESSON_FILE =
  /^packages\/content\/(lessons|algorithms)\/([^/]+)\/(python|c|java)\/(?:ro\/)?([^/]+)-(?:tests\.json|solution\.md|harness\.md)$/;
const MULTI_VARIANT_FILE =
  /^packages\/content\/variants\/([^/]+)\/(python|c|java)\/([^/]+)\/[^/]+$/;

export interface Shard {
  name: string;
  image: string;
  targets: string;
}

function changedLesson(file: string): string | null {
  const multiLesson = MULTI_LESSON_FILE.exec(file);
  if (multiLesson) {
    const [, root, name, language, slug] = multiLesson;
    const courseKey = root === 'algorithms' ? `algo-${name}` : name;
    if (isMultiLanguage(courseKey)) return `${courseKey}/${language}/${slug}`;
  }
  const multiVariant = MULTI_VARIANT_FILE.exec(file);
  if (multiVariant && isMultiLanguage(multiVariant[1])) return multiVariant.slice(1).join('/');
  const lesson = LESSON_FILE.exec(file);
  if (lesson) {
    const [, root, lang, slug] = lesson;
    return `${root === 'algorithms' ? `algo-${lang}` : lang}/${slug}`;
  }
  const variant = VARIANT_FILE.exec(file);
  return variant ? `${variant[1]}/${variant[2]}` : null;
}

// trees-graphs/c/trees -> trees-graphs/c, java/hashmap -> java.
function courseOf(lesson: string): string {
  const [courseKey, language] = lesson.split('/');
  return isMultiLanguage(courseKey) ? `${courseKey}/${language}` : courseKey;
}

function lessonsOf(courseKey: string): string[] {
  const [key, language] = courseKey.split('/');
  return fs
    .readdirSync(contentDir(key, language))
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
      if (lesson && courses.includes(courseOf(lesson))) targets.set(lesson, null);
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
