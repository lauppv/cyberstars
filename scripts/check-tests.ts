// Runtime check for the lesson judge's <slug>-tests.json corpus: grades every
// lesson's own reference solution through the real judge (Docker, same runner
// and containers as production) and fails unless it passes every case. Catches
// what the static validator can't: generated inputs the solution crashes or
// times out on, and nondeterministic output (the solution runs twice per case,
// once as the "student"). Also prints how long each lesson's judge run takes,
// so bulk cases can be sized against the per-run budget.
//
//   npx tsx scripts/check-tests.ts python                # a whole course
//   npx tsx scripts/check-tests.ts algo-c/two-sum        # one lesson
//   npx tsx scripts/check-tests.ts java --lang=ro        # only the RO specs
import fs from 'fs';
import path from 'path';
import { contentDir } from '../server/services/paths.js';
import { runLessonTests } from '../server/services/lesson-tests.service.js';
import { drainAll } from '../server/services/code-container.service.js';

const TESTS_SUFFIX = '-tests.json';

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

async function main() {
  const args = process.argv.slice(2);
  const langArg = args.find((a) => a.startsWith('--lang='))?.slice('--lang='.length);
  const langs = langArg ? [langArg] : ['en', 'ro'];
  const targets = args.filter((a) => !a.startsWith('--'));
  if (targets.length === 0) {
    console.error('usage: tsx scripts/check-tests.ts <course>[/<slug>] ... [--lang=en|ro]');
    process.exit(2);
  }

  let failures = 0;
  for (const target of targets) {
    const [courseKey, onlySlug] = target.split('/');
    const base = contentDir(courseKey);
    for (const lang of langs) {
      const dir = lang === 'ro' ? path.join(base, 'ro') : base;
      const slugs = onlySlug ? [onlySlug].filter((s) => slugsIn(dir).includes(s)) : slugsIn(dir);
      for (const slug of slugs) {
        const label = `${courseKey}/${lang === 'ro' ? 'ro/' : ''}${slug}`;
        const started = Date.now();
        try {
          const result = await runLessonTests(
            `check:${courseKey}`,
            courseKey,
            slug,
            solutionCode(dir, slug),
            lang,
          );
          const secs = ((Date.now() - started) / 1000).toFixed(1);
          if (result.status === 'passed' && result.passedCount === result.total) {
            console.log(`ok    ${label}  ${result.total} cases  ${secs}s`);
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
