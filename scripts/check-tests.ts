// Runtime check for the lesson judge's <slug>-tests.json corpus: grades every
// lesson's own reference solution through the real judge (Docker, same runner
// and containers as production) and fails unless it passes every case. Catches
// what the static validator can't: generated inputs the solution crashes or
// times out on, and nondeterministic output (the solution runs twice per case,
// once as the "student"). Also prints how long each lesson's judge run takes,
// and how much of it the programs themselves took, so bulk cases can be sized
// against the per-run budget.
//
// A lesson may also ship variants in test/lesson-variants/<course>/<slug>/:
// accept-*.<ext> are other correct solutions (other names, another approach)
// that must pass, reject-*.<ext> are cheats (hardcoded output, the wrong kind
// of loop) that must fail. They prove the spec grades the behavior and the
// concept the lesson teaches, not the reference's exact shape. English only:
// a RO spec differs from its EN twin only in the identifiers.
//
//   npx tsx scripts/check-tests.ts python                # a whole course
//   npx tsx scripts/check-tests.ts algo-c/two-sum        # one lesson
//   npx tsx scripts/check-tests.ts java --lang=ro        # only the RO specs
//   npx tsx scripts/check-tests.ts c:en python/loops     # a language per target
import fs from 'fs';
import path from 'path';
import { contentDir } from '../server/services/paths.js';
import { runLessonTests } from '../server/services/lesson-tests.service.js';
import { drainAll } from '../server/services/code-container.service.js';

const TESTS_SUFFIX = '-tests.json';
const VARIANTS_DIR = path.join(process.cwd(), 'test', 'lesson-variants');

function solutionCode(dir: string, slug: string): string {
  const md = fs.readFileSync(path.join(dir, `${slug}-solution.md`), 'utf8');
  const fenced = md.match(/```[\w-]*\n([\s\S]*?)```/);
  if (!fenced) throw new Error(`${dir}/${slug}-solution.md has no fenced block`);
  return fenced[1];
}

function slugsIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(TESTS_SUFFIX))
    .map((f) => f.slice(0, -TESTS_SUFFIX.length))
    .sort();
}

function variantsOf(courseKey: string, slug: string): string[] {
  const dir = path.join(VARIANTS_DIR, courseKey, slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^(accept|reject)-/.test(f))
    .sort()
    .map((f) => path.join(dir, f));
}

// Grades each variant and returns how many came out the wrong way.
async function checkVariants(courseKey: string, slug: string): Promise<number> {
  let wrong = 0;
  for (const file of variantsOf(courseKey, slug)) {
    const name = path.basename(file);
    const shouldPass = name.startsWith('accept-');
    let result: Awaited<ReturnType<typeof runLessonTests>>;
    try {
      result = await runLessonTests(
        `check:${courseKey}:${process.pid}`,
        courseKey,
        slug,
        fs.readFileSync(file, 'utf8'),
        'en',
      );
    } catch (err) {
      // A run that never finished proves nothing either way, and the
      // lesson's other variants still get graded.
      wrong++;
      console.log(
        `  FAIL  ${name}  run error: ${err instanceof Error ? err.message : String(err)}`,
      );
      continue;
    }
    const passed = result.status === 'passed' && result.passedCount === result.total;
    const why = result.syntaxError
      ? `syntax: ${result.syntaxError}`
      : result.structureFailures.length
        ? `structure: ${JSON.stringify(result.structureFailures)}`
        : `${result.passedCount}/${result.total}`;
    // A reject that doesn't compile is rejected for its typo, not its cheat.
    if (!shouldPass && result.syntaxError) {
      wrong++;
      console.log(`  FAIL  ${name}  should fail on its cheat, got ${why}`);
      continue;
    }
    if (passed === shouldPass) {
      console.log(`  ok    ${name}  ${passed ? 'passed' : `failed (${why})`}`);
      continue;
    }
    wrong++;
    const failed = result.cases.find((c) => !c.passed);
    console.log(
      `  FAIL  ${name}  ${shouldPass ? `should pass, got ${why}` : 'should fail, but passed'}` +
        (shouldPass && failed ? `\n        case ${failed.index}: ${JSON.stringify(failed)}` : ''),
    );
  }
  return wrong;
}

async function main() {
  const args = process.argv.slice(2);
  const langArg = args.find((a) => a.startsWith('--lang='))?.slice('--lang='.length);
  const targets = args.filter((a) => !a.startsWith('--'));
  if (targets.length === 0) {
    console.error(
      'usage: tsx scripts/check-tests.ts <course>[/<slug>][:en|:ro] ... [--lang=en|ro]',
    );
    process.exit(2);
  }

  let failures = 0;
  for (const arg of targets) {
    const [target, targetLang] = arg.split(':');
    const [courseKey, onlySlug] = target.split('/');
    const base = contentDir(courseKey);
    const onlyLang = targetLang ?? langArg;
    for (const lang of onlyLang ? [onlyLang] : ['en', 'ro']) {
      const dir = lang === 'ro' ? path.join(base, 'ro') : base;
      const slugs = onlySlug ? [onlySlug].filter((s) => slugsIn(dir).includes(s)) : slugsIn(dir);
      for (const slug of slugs) {
        const label = `${courseKey}/${lang === 'ro' ? 'ro/' : ''}${slug}`;
        const started = Date.now();
        try {
          const result = await runLessonTests(
            `check:${courseKey}:${process.pid}`,
            courseKey,
            slug,
            solutionCode(dir, slug),
            lang,
          );
          const secs = ((Date.now() - started) / 1000).toFixed(1);
          if (result.status === 'passed' && result.passedCount === result.total) {
            const timing =
              result.runtimeMs !== undefined
                ? `  (programs: ${result.runtimeMs} ms, reference ${result.referenceMs} ms)`
                : '';
            console.log(`ok    ${label}  ${result.total} cases  ${secs}s${timing}`);
            if (lang === 'en') failures += await checkVariants(courseKey, slug);
            continue;
          }
          failures++;
          const failed = result.cases.find((c) => !c.passed);
          console.log(
            `FAIL  ${label}  ${result.passedCount}/${result.total}  ${secs}s` +
              (result.syntaxError ? `  syntax: ${result.syntaxError}` : '') +
              (result.structureFailures.length
                ? `  structure: ${JSON.stringify(result.structureFailures)}`
                : '') +
              (failed ? `\n      case ${failed.index}: ${JSON.stringify(failed)}` : ''),
          );
        } catch (err) {
          failures++;
          console.log(`FAIL  ${label}  ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }
  }

  await drainAll();
  if (failures) {
    console.error(`\n${failures} lesson(s) failed`);
    process.exit(1);
  }
}

void main();
