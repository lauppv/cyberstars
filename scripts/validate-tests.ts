// Build-time validator for the lesson judge's <slug>-tests.json corpus. Guards
// the two silent-failure classes that let hardcoding pass without any runtime
// error (so CI stays green while anti-cheat is quietly disabled):
//
//   1. Locale pairing — a RO lesson graded against the EN tests/solution makes
//      injection a no-op (EN identifiers never match the RO solution), so a
//      hardcoded RO answer passes. Every RO solution that belongs to a tested
//      lesson must ship its own ro/<slug>-tests.json (and vice-versa).
//   2. Dead inject keys — an inject key that doesn't resolve to a real variable
//      in the paired solution injects nothing, so the "hidden" cases all run on
//      the same values and a hardcoded output passes. Every inject key (and
//      every structure `requires` name) must appear in the paired solution.
//
// C is checked rigorously via the same tree-sitter analysis the judge uses
// (an inject key must be a real init_declarator site); Python/Java use
// identifier presence on the comment/string-stripped solution (their injectors
// run in-container, so we can't reuse them here, but a missing identifier is
// exactly the drift we need to catch). No Docker, no runtime — pure static.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { contentDir } from '../server/services/paths.js';
import { parseC, collectInjectionSites } from '../server/services/c-analysis.js';
import type { LessonTestsSpec } from '../shared/tests.js';

const CODE_JUDGE_COURSES = ['python', 'java', 'c', 'algo-python', 'algo-java', 'algo-c'];
const C_COURSES = new Set(['c', 'algo-c']);

type Lang = 'python' | 'java' | 'c';
function langOf(courseKey: string): Lang {
  if (C_COURSES.has(courseKey)) return 'c';
  return courseKey.endsWith('java') ? 'java' : 'python';
}

const TESTS_SUFFIX = '-tests.json';

function listTestedSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(TESTS_SUFFIX))
    .map((f) => f.slice(0, -TESTS_SUFFIX.length))
    .sort();
}

function readSpec(file: string): LessonTestsSpec {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as LessonTestsSpec;
}

// The single fenced block of a <slug>-solution.md, same extraction the judge
// uses (loadSolutionCode). Returns null if the file or block is missing.
function solutionCode(dir: string, slug: string): string | null {
  const file = path.join(dir, `${slug}-solution.md`);
  if (!fs.existsSync(file)) return null;
  const fenced = fs.readFileSync(file, 'utf8').match(/```[\w-]*\n([\s\S]*?)```/);
  return fenced ? fenced[1] : null;
}

// Top-level inject keys across every case (the identifiers whose values the
// judge splices into both programs). $list/$dict wrappers add no keys.
function injectKeys(spec: LessonTestsSpec): Set<string> {
  const keys = new Set<string>();
  for (const testCase of spec.cases ?? []) {
    for (const key of Object.keys(testCase.inject ?? {})) keys.add(key);
  }
  return keys;
}

// Names a solution must contain for its own structure `requires` to pass —
// a renamed contract variable/function/call would fail every honest solution.
function requireNames(spec: LessonTestsSpec): string[] {
  const names: string[] = [];
  for (const rule of spec.structure?.requires ?? []) {
    if (rule.name && ['variable', 'function', 'call'].includes(rule.kind)) names.push(rule.name);
  }
  return names;
}

function stripPython(code: string): string {
  return code
    .replace(/'''[\s\S]*?'''|"""[\s\S]*?"""/g, ' ')
    .replace(/#[^\n]*/g, ' ')
    .replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g, ' ');
}

function stripCLike(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, ' ');
}

function hasIdentifier(stripped: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`).test(stripped);
}

interface Problem {
  courseKey: string;
  slug: string;
  message: string;
}

// Pure checker (no file IO): given a solution's source and its spec, return the
// human-readable problems. Exported so the unit test can drive it with synthetic
// inputs (dead inject key, renamed contract var) and prove the gate bites.
export async function auditSolution(
  lang: Lang,
  code: string,
  spec: LessonTestsSpec,
): Promise<string[]> {
  const messages: string[] = [];
  const injected = injectKeys(spec);
  const names = [...injected, ...requireNames(spec)];
  if (names.length === 0) return messages;

  if (lang === 'c') {
    let siteNames: Set<string>;
    try {
      siteNames = new Set(collectInjectionSites(await parseC(code)).map((s) => s.name));
    } catch {
      return ['solution failed to parse (C)'];
    }
    for (const key of injected) {
      if (!siteNames.has(key)) {
        messages.push(
          `inject key "${key}" is not an initializer in the solution — injection no-ops, hardcoding passes`,
        );
      }
    }
    const stripped = stripCLike(code);
    for (const name of requireNames(spec)) {
      if (!hasIdentifier(stripped, name)) {
        messages.push(`structure requires "${name}" but the solution never uses it`);
      }
    }
    return messages;
  }

  const stripped = lang === 'java' ? stripCLike(code) : stripPython(code);
  for (const name of names) {
    if (!hasIdentifier(stripped, name)) {
      messages.push(
        `"${name}" (inject key or required structure) is absent from the solution — injection/structure no-ops`,
      );
    }
  }
  return messages;
}

async function checkPaired(
  courseKey: string,
  dir: string,
  slug: string,
  locale: 'en' | 'ro',
  problems: Problem[],
): Promise<void> {
  const spec = readSpec(path.join(dir, `${slug}${TESTS_SUFFIX}`));
  const code = solutionCode(dir, slug);
  const tag = locale === 'ro' ? `ro/${slug}` : slug;
  if (code === null) {
    problems.push({ courseKey, slug, message: `${tag}: tests file has no readable -solution.md` });
    return;
  }
  for (const message of await auditSolution(langOf(courseKey), code, spec)) {
    problems.push({ courseKey, slug, message: `${tag}: ${message}` });
  }
}

export async function collectProblems(): Promise<Problem[]> {
  const problems: Problem[] = [];

  for (const courseKey of CODE_JUDGE_COURSES) {
    const baseDir = contentDir(courseKey);
    const roDir = path.join(baseDir, 'ro');
    const baseSlugs = listTestedSlugs(baseDir);
    const roSlugs = new Set(listTestedSlugs(roDir));

    for (const slug of baseSlugs) {
      // A base tests file must have a base solution (else the judge 500s).
      if (!fs.existsSync(path.join(baseDir, `${slug}-solution.md`))) {
        problems.push({ courseKey, slug, message: `${slug}: tests file has no -solution.md` });
        continue;
      }
      // If a translated (RO solution exists) lesson uses INJECTION, it MUST ship
      // a RO tests file — otherwise the RO run falls back to the EN tests +
      // EN solution, and the EN inject keys never match the RO identifiers, so
      // injection silently no-ops and a hardcoded RO answer passes. Stdin-only
      // lessons (no inject — the whole algo set) deliberately share the EN tests
      // file when the RO output is identical; enforcing a pair there would just
      // duplicate an identical file, so we skip them.
      const usesInjection =
        injectKeys(readSpec(path.join(baseDir, `${slug}${TESTS_SUFFIX}`))).size > 0;
      if (
        usesInjection &&
        fs.existsSync(path.join(roDir, `${slug}-solution.md`)) &&
        !roSlugs.has(slug)
      ) {
        problems.push({
          courseKey,
          slug,
          message: `${slug}: injection lesson has ro/${slug}-solution.md but no ro/${slug}-tests.json — RO grading falls back to EN, injection no-ops`,
        });
      }
      await checkPaired(courseKey, baseDir, slug, 'en', problems);
    }

    for (const slug of roSlugs) {
      if (!fs.existsSync(path.join(roDir, `${slug}-solution.md`))) {
        problems.push({
          courseKey,
          slug,
          message: `ro/${slug}: tests file has no ro/${slug}-solution.md`,
        });
        continue;
      }
      await checkPaired(courseKey, roDir, slug, 'ro', problems);
    }
  }

  return problems;
}

/* v8 ignore start -- CLI wiring; the pure checks are unit-tested via collectProblems/auditSolution. */
async function main(): Promise<void> {
  const problems = await collectProblems();
  if (problems.length === 0) {
    const count = CODE_JUDGE_COURSES.length;
    console.log(
      `validate-tests: OK — all inject keys resolve and locales are paired (${count} courses).`,
    );
    return;
  }
  console.error(`validate-tests: ${problems.length} problem(s) found:\n`);
  for (const p of problems) console.error(`  [${p.courseKey}] ${p.message}`);
  process.exitCode = 1;
}

// Run as a CLI (npm run validate:tests) but stay importable by the unit test.
const invokedPath = process.argv[1] ? fs.realpathSync(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  void main();
}
/* v8 ignore stop */
