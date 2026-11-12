import fs from 'fs';
import path from 'path';
import { WEB_COURSE_KEYS, codeLanguageOf, isMultiLanguage } from '@cyberstars/shared/constants';
import { contentDir } from './paths.js';
import { dockerExec, dockerConverse, killLeftovers } from '@cyberstars-framework/sandbox/docker';
import { sandbox } from './sandbox.js';
import { getRuntime, languageOf } from '../runtimes/registry.js';
import { FAST_START, FAST_START_JAVAC } from '@cyberstars-framework/sandbox/languages';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { prepareC, type PrepareResult } from './c-analysis.js';
import { acquireJudgeSlot } from './judge-queue.js';
import { inLine } from './run-waits.js';
import { getReference, putReference, referenceKey } from './reference-cache.js';
import { readHarness, studentHarness, studentLines, wrapCode, type Harness } from './harness.js';
import { findProject } from '@cyberstars/shared/projects';
import { runWebLessonTests } from './web-tests.js';
import { PROJECTS_DIR } from '@cyberstars/content/paths';
import type {
  LessonTestsSpec,
  RunTestsResponse,
  StructureFailure,
  TestCaseResult,
  TestComparator,
} from '@cyberstars/shared/tests';

// Server-side judge for lessons that ship a <slug>-tests.json. The heavy
// lifting happens inside sandbox containers: a trusted per-language runner
// checks code structure via the language's own parser (Python ast / javac
// Compiler Tree API), injects each case's values into the lesson's input
// variables and runs the program on every case. The student's program runs in
// its owner's container (same one the editor Run uses). Our reference solution
// runs in a container of the judge's own, which no student's program ever
// enters: a program shares its container with whatever else runs there and
// can rewrite it, so nothing a student's container says about our solution
// could be believed. The solution and the expected outputs never enter a
// student's container, and outputs are compared HERE, on the server.
const SERVICES_DIR = import.meta.dirname;

const WRITE_TIMEOUT_MS = 10_000;

// The Java runner is compiled once per container into /tmp/_judge (only /work
// is wiped between runs) and recompiled when the shipped source changes (a
// deploy while the container is warm). `exec` keeps the verdict as the sole
// stdout of the docker exec. C1 only, as the programs: the full JIT kept
// compiling javac in the background, on the same half core each program then
// started on, and took 9.8 s where this takes 5.9 (12 cases, java/polymorphism).
const JAVA_BOOT =
  'cmp -s /work/Runner.java /tmp/_judge/Runner.java 2>/dev/null || ' +
  `{ mkdir -p /tmp/_judge && javac ${FAST_START_JAVAC} -d /tmp/_judge /work/Runner.java && cp /work/Runner.java /tmp/_judge/Runner.java; } && ` +
  `exec java ${FAST_START} -Xmx96m -cp /tmp/_judge Runner /work/_payload.json`;

interface JudgeRunner {
  runnerPath: string;
  /** Where the runner source is written inside the container (under /work). */
  containerFile: string;
  /** Argv executed in the container to produce the verdict JSON on stdout. */
  runCmd: string[];
  /**
   * Time the cases may take together, counted from the runner's header (after
   * boot, parse and pristine compile). Once a case finishes past it, the run
   * stops and the next case is reported as a timeout, so a slow-but-not-hung
   * submission can't hold the container for cases × 10 s.
   */
  budgetMs: number;
  /** Worst case for one case: 2×10s programs, plus compiles where applicable. */
  caseBudgetMs: number;
  /** Runner boot + parse + pristine compile, before the first case. */
  baseTimeoutMs: number;
  /**
   * Languages with no in-container parser (C) do structure checks + value
   * injection HERE on the server, then ship pre-injected sources to a thin
   * compile+run runner. When set, a truthy `syntaxError` short-circuits before
   * any container is touched (syntax gate 1); otherwise the runner receives
   * `{ pristineUser, cases }` and its verdict is merged with these structure
   * failures. py/java leave this unset (runner does structure+injection).
   */
  prepare?: (code: string, spec: LessonTestsSpec) => Promise<PrepareResult>;
}

// The times below were measured, and the budgets sized, when a case ran our
// solution next to the student's program in one container. Each container now
// runs one program per case, so they leave more room than they say.
const RUNNERS: Record<string, JudgeRunner> = {
  python: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.py'),
    containerFile: '/work/_runner.py',
    runCmd: ['python3', '/work/_runner.py', '/work/_payload.json'],
    // ~30 ms per case under the 0.5 CPU cap (two programs forked from a warm
    // interpreter), so 50 cases take ~1.5 s.
    budgetMs: 30_000,
    caseBudgetMs: 21_000,
    baseTimeoutMs: 15_000,
  },
  java: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.java'),
    containerFile: '/work/Runner.java',
    runCmd: ['sh', '-c', JAVA_BOOT],
    // Each case may compile user + solution in-process on top of the two runs;
    // the base covers the one-time runner bootstrap compile on a cold container.
    // ~0.3 s per injected case (javac + 2 JVM starts), so 20 cases take ~6 s.
    budgetMs: 45_000,
    caseBudgetMs: 26_000,
    baseTimeoutMs: 30_000,
  },
  c: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.c.py'),
    containerFile: '/work/_runner.py',
    runCmd: ['python3', '/work/_runner.py', '/work/_payload.json'],
    // Per case: up to 2 gcc compiles + 2×10s runs; the source cache makes
    // identical stdin-only sources compile once. gcc is heavier than a python
    // parse, lighter than javac+JVM. ~80 ms per injected case, a few ms per
    // stdin-only case.
    budgetMs: 30_000,
    caseBudgetMs: 18_000,
    baseTimeoutMs: 20_000,
    prepare: prepareC,
  },
};

// Same ro/-subfolder localization convention as lesson markdown / terminal
// -setup.json, but the tests spec and the solution are a UNIT (the spec's
// inject keys reference the solution's identifiers), so the locale is decided
// once by the tests file and the solution must come from the same folder.
// Mixing locales would make injection a silent no-op and let hardcoding pass.
// A multi-language course keeps each language's lesson in its own folder.
function testsDir(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
  language?: string,
): string | null {
  const base = contentDir(courseKey, language);
  if (lang === 'ro' && fs.existsSync(path.join(base, 'ro', `${lessonSlug}-tests.json`))) {
    return path.join(base, 'ro');
  }
  return fs.existsSync(path.join(base, `${lessonSlug}-tests.json`)) ? base : null;
}

export function loadTestsSpec(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
  language?: string,
): LessonTestsSpec | null {
  const dir = testsDir(courseKey, lessonSlug, lang, language);
  if (!dir) return null;
  const file = path.join(dir, `${lessonSlug}-tests.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8')) as LessonTestsSpec;
}

function loadSolutionCode(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
  language?: string,
): string {
  const dir = testsDir(courseKey, lessonSlug, lang, language);
  if (!dir) throw new AppError(500, 'Test run failed, please try again');
  const md = fs.readFileSync(path.join(dir, `${lessonSlug}-solution.md`), 'utf8');
  const fenced = md.match(/```[\w-]*\n([\s\S]*?)```/);
  if (!fenced) throw new AppError(500, 'Test run failed, please try again');
  // The solution of a challenge with a hidden part is only the function, in
  // the names of its own folder's hidden part.
  return wrapCode(readHarness(dir, lessonSlug), fenced[1]);
}

function normalize(output: string): string {
  const lines = output.replace(/\r\n/g, '\n').split('\n');
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  return lines.map((line) => line.replace(/\s+$/, '')).join('\n');
}

export function compareOutputs(
  expected: string,
  actual: string,
  comparator: TestComparator,
): boolean {
  if (comparator === 'exact') return expected === actual;
  if (comparator === 'masked') return maskInts(normalize(expected)) === maskInts(normalize(actual));
  if (comparator === 'unordered')
    return sortLines(normalize(expected)) === sortLines(normalize(actual));
  return normalize(expected) === normalize(actual);
}

// Collapse every run of digits to a single token so nondeterministic values
// (PIDs printed by fork/getpid lessons) don't break an otherwise-fixed output.
function maskInts(output: string): string {
  return output.replace(/\d+/g, '#');
}

// Compare outputs as a multiset of lines, so thread/process lessons whose line
// order varies between runs still match when the set of lines is identical.
function sortLines(output: string): string {
  return output.split('\n').sort().join('\n');
}

interface RunnerProgram {
  stdout: string;
  stderr: string;
  exit: number;
  timedOut: boolean;
  /**
   * How long the program's own code ran, startup and compile excluded,
   * measured inside the program; absent when it crashed or skipped its exit.
   */
  ms?: number;
}

// Timings travel to the client in ms rounded to the microsecond: a small
// program's code runs in well under a millisecond.
function roundMs(ms: number): number {
  return Math.round(ms * 1000) / 1000;
}

// runtimeMs / referenceMs: the load test's two times, once the student's
// program passed it with both sides timed. Small inputs run in hundredths of a
// millisecond, so only the load test says anything about speed; a lesson
// without one reports no runtime.
function timingTotals(
  cases: TestCaseResult[],
): Pick<RunTestsResponse, 'runtimeMs' | 'referenceMs'> {
  const load = cases.find((c) => c.load);
  if (!load?.passed || load.userMs === undefined || load.solutionMs === undefined) return {};
  return { runtimeMs: load.userMs, referenceMs: load.solutionMs };
}

// The runners stream their verdict as JSON lines: a header, then one line per
// case. After each case line the server compares the outputs and answers
// "next" or "stop" on the runner's stdin, so a run stops at the first failing
// case without paying for the cases after it. This lockstep costs ~0.1 ms per
// case (measured round trip through `docker exec -i`), where re-entering the
// container in chunks would cost a fresh docker exec + runner start per chunk:
// ~0.2 s for Python and C, ~1.1 s for Java (runner JVM boot + recompiling the
// pristine user code).
interface RunnerHeader {
  syntaxError: string | null;
  /** py/java only; C structure failures come from the server-side prep. */
  structureFailures?: StructureFailure[];
}

// `user` is the program the runner judged: the student's in their container,
// our solution in the judge's.
interface RunnerCase {
  user?: RunnerProgram;
  injectError?: boolean;
}

// What our solution printed on a case, from the cache or from a run in the
// judge's container; `ms` only from a run made for this judge run.
interface Reference {
  stdout: string;
  ms?: number;
}

function failRun(): never {
  throw new AppError(500, 'Test run failed, please try again');
}

function caseBase(spec: LessonTestsSpec, index: number): TestCaseResult {
  const specCase = spec.cases[index];
  const base: TestCaseResult = { index, visible: specCase.visible ?? false, passed: false };
  // The load test's input is too large to send back; it goes by its name alone.
  if (specCase.load) return { ...base, load: true };
  if (specCase.inject) base.inject = specCase.inject;
  if (specCase.stdin !== undefined) base.stdin = specCase.stdin;
  if (specCase.generated) base.generated = true;
  return base;
}

// The verdict on one case of the student's program. A program that timed out
// or crashed needs no reference to fail; any other is compared with ours.
function judgeCase(
  spec: LessonTestsSpec,
  index: number,
  user: RunnerProgram,
  reference: Reference | undefined,
): TestCaseResult {
  const base = caseBase(spec, index);
  if (reference?.ms !== undefined) base.solutionMs = roundMs(reference.ms);
  if (user.ms !== undefined) base.userMs = roundMs(user.ms);
  if (user.timedOut) return { ...base, error: 'timeout' };
  // The load test's outputs are as large as its input: only the verdict goes back.
  if (user.exit !== 0) {
    const error = user.stderr || 'error';
    return base.load ? { ...base, error } : { ...base, error, actual: user.stdout };
  }
  if (!reference) failRun();
  const passed = compareOutputs(reference.stdout, user.stdout, spec.comparator ?? 'trimmed');
  if (base.load) return { ...base, passed };

  // A passed case shows both outputs: the student already produced the expected
  // one, so revealing it gives nothing away, even on a hidden case.
  if (passed) {
    return {
      ...base,
      passed: true,
      expected: normalize(reference.stdout),
      actual: normalize(user.stdout),
    };
  }
  return {
    ...base,
    actual: normalize(user.stdout),
    ...(base.visible ? { expected: normalize(reference.stdout) } : {}),
  };
}

// Cache keys for the cases whose reference output may be reused: every case
// but the load test, whose runtime needs our solution timed live, on a lesson
// whose output is deterministic (masked/unordered lessons print differently
// from run to run).
function referenceKeys(
  spec: LessonTestsSpec,
  courseKey: string,
  lessonSlug: string,
  lang: string | undefined,
  solutionCode: string,
): (string | null)[] {
  const comparator = spec.comparator ?? 'trimmed';
  const deterministic = comparator === 'trimmed' || comparator === 'exact';
  return spec.cases.map((testCase) =>
    deterministic && !testCase.load
      ? referenceKey({
          courseKey,
          lang: lang ?? 'en',
          slug: lessonSlug,
          solutionCode,
          testCase,
          comparator,
        })
      : null,
  );
}

function syntaxErrorResponse(spec: LessonTestsSpec, syntaxError: string): RunTestsResponse {
  return {
    status: 'failed',
    comparator: spec.comparator ?? 'trimmed',
    syntaxError,
    structureFailures: [],
    cases: [],
    total: spec.cases.length,
    passedCount: 0,
  };
}

// `cases` holds every passed case plus at most one failed case, last. Structure
// failures fail the run but never stop the cases, so X / Y still reflects them.
function finalResponse(
  spec: LessonTestsSpec,
  structureFailures: StructureFailure[],
  cases: TestCaseResult[],
): RunTestsResponse {
  const passedCount = cases.filter((c) => c.passed).length;
  return {
    status:
      structureFailures.length === 0 && passedCount === spec.cases.length ? 'passed' : 'failed',
    comparator: spec.comparator ?? 'trimmed',
    structureFailures,
    cases,
    total: spec.cases.length,
    passedCount,
    ...timingTotals(cases),
  };
}

// The runtime a run goes to: the course's own, or on a multi-language course
// the language picked. It keys the reference cache, and its language
// (languageOf) names the owner's container, so a run shares the container of
// the editor's runs in that language, an algorithm challenge's too.
function runtimeKey(courseKey: string, language?: string): string {
  return isMultiLanguage(courseKey) ? codeLanguageOf(courseKey, language) : courseKey;
}

export async function runLessonTests(
  ownerKey: string,
  courseKey: string,
  lessonSlug: string,
  userCode: string,
  lang?: string,
  language?: string,
  // A guest's network, which a new container counts against (guest-sandboxes.ts)
  guestIp?: string,
  // Where the run counts as waiting while it's in a line (run-waits.ts)
  waitKey: string | null = null,
): Promise<RunTestsResponse> {
  // A web lesson's site is graded in a browser (web-tests.ts)
  if (WEB_COURSE_KEYS.includes(courseKey)) {
    return runWebLessonTests(ownerKey, courseKey, lessonSlug, userCode, lang, guestIp, waitKey);
  }
  const spec = loadTestsSpec(courseKey, lessonSlug, lang, language);
  if (!spec) throw new AppError(404, 'This lesson has no tests');
  const runtime = runtimeKey(courseKey, language);
  // On a challenge with a hidden part the student wrote only the function, so
  // their program is it wrapped in that part.
  const harness = studentHarness(courseKey, lessonSlug, lang, language, userCode);
  return judgeProgram({
    ownerKey,
    guestIp,
    waitKey,
    spec,
    runtime,
    // A multi-language course's lesson is one per language.
    cacheCourse: runtime === courseKey ? courseKey : `${courseKey}/${runtime}`,
    slug: lessonSlug,
    lang,
    solutionCode: loadSolutionCode(courseKey, lessonSlug, lang, language),
    program: wrapCode(harness, userCode),
    harness,
  });
}

// A project's tests and reference solution sit beside its steps
// (packages/content/projects/<language>/<slug>-tests.json and -solution.md),
// English only, and stay on the server like a lesson's. The whole program is
// the student's: no hidden part, and only stdin goes in.
export async function runProjectTests(
  ownerKey: string,
  language: string,
  slug: string,
  userCode: string,
  guestIp?: string,
  waitKey: string | null = null,
): Promise<RunTestsResponse> {
  const project = findProject(language, slug);
  const dir = path.join(PROJECTS_DIR, language);
  const specFile = path.join(dir, `${slug}-tests.json`);
  if (!project || project.language === 'linux' || !fs.existsSync(specFile)) {
    throw new AppError(404, 'This project has no tests');
  }
  const md = fs.readFileSync(path.join(dir, `${slug}-solution.md`), 'utf8');
  const solutionCode = md.match(/```[\w-]*\n([\s\S]*?)```/)?.[1];
  if (!solutionCode) throw new AppError(500, 'Test run failed, please try again');
  return judgeProgram({
    ownerKey,
    guestIp,
    waitKey,
    spec: JSON.parse(fs.readFileSync(specFile, 'utf8')) as LessonTestsSpec,
    runtime: language,
    cacheCourse: `project/${language}`,
    slug,
    lang: 'en',
    solutionCode,
    program: userCode,
    harness: null,
  });
}

interface JudgeRequest {
  ownerKey: string;
  guestIp?: string;
  waitKey: string | null;
  spec: LessonTestsSpec;
  // The runtime the program runs in, which picks the runner and the container
  runtime: string;
  // What keys the reference cache, with the slug and lang
  cacheCourse: string;
  slug: string;
  lang?: string;
  solutionCode: string;
  program: string;
  // The hidden part the program sits in, whose lines an error mustn't name
  harness: Harness | null;
}

async function judgeProgram({
  ownerKey,
  guestIp,
  waitKey,
  spec,
  runtime,
  cacheCourse,
  slug,
  lang,
  solutionCode,
  program,
  harness,
}: JudgeRequest): Promise<RunTestsResponse> {
  const judge = RUNNERS[getRuntime(runtime)?.name ?? ''];
  if (!judge) throw new AppError(404, 'This lesson has no tests');

  // Server-side prep (C): structure + injection happen here; a syntax error in
  // the pristine user code is caught before any container is touched (gate 1).
  const prepared = judge.prepare ? await judge.prepare(program, spec) : null;
  if (prepared?.syntaxError) {
    return syntaxErrorResponse(spec, studentLines(prepared.syntaxError, harness));
  }

  // Refused at once rather than after waiting in line for a slot
  if (sandbox.isRunning(ownerKey)) throw new AppError(409, 'A run is already in progress');
  const releaseSlot = await inLine(waitKey, (onWait) => acquireJudgeSlot({ onWait }));
  try {
    // A judge run is a busy sandbox too, so it also takes one of the slots
    // editor runs and terminal commands share. Our solution's container and
    // the student's take turns under it, never busy at once.
    const releaseSandbox = await inLine(waitKey, (onWait) => sandbox.acquireSlot({ onWait }));
    try {
      const result = await runInContainer(ownerKey, guestIp, program, prepared, {
        language: languageOf(runtime),
        judge,
        spec,
        solutionCode,
        keys: referenceKeys(spec, cacheCourse, slug, lang, solutionCode),
      });
      if (!result.syntaxError) return result;
      return { ...result, syntaxError: studentLines(result.syntaxError, harness) };
    } finally {
      releaseSandbox();
    }
  } finally {
    releaseSlot();
  }
}

// What a judge run and its reference runs share
interface JudgeRun {
  // The sandbox language, which names the containers
  language: string;
  judge: JudgeRunner;
  spec: LessonTestsSpec;
  solutionCode: string;
  // The cache key of each case's reference output, null for one never reused
  keys: (string | null)[];
}

// What a runner gets: the program and the cases to run it on. The C runner
// receives pre-injected sources; py/java runners inject in the container from
// the raw code + spec.
function runnerPayload(
  code: string,
  spec: Pick<LessonTestsSpec, 'structure' | 'cases'>,
  prepared: PrepareResult | null,
): string {
  return prepared
    ? JSON.stringify({ pristineUser: code, cases: prepared.cases })
    : JSON.stringify({ userCode: code, structure: spec.structure ?? {}, cases: spec.cases });
}

// Reserves the owner's container for the length of `work`. Anything that
// breaks it (stuck exec, bad container state) drops the container, so the
// next attempt starts clean.
async function withContainer<T>(
  ownerKey: string,
  language: string,
  guestIp: string | undefined,
  work: (containerId: string) => Promise<T>,
): Promise<T> {
  let containerId: string;
  try {
    containerId = await sandbox.acquireForRun(ownerKey, language, guestIp);
  } catch (err) {
    // The guest's network holds as many sandboxes as it may, all busy
    if (err instanceof AppError) throw err;
    if (err instanceof Error && err.message === 'A run is already in progress') {
      throw new AppError(409, 'A run is already in progress');
    }
    throw new AppError(500, 'Could not start the runner. Please try again.');
  }

  let keep = true;
  try {
    return await work(containerId);
  } catch (err) {
    keep = false;
    throw err instanceof AppError ? err : new AppError(500, 'Test run failed, please try again');
  } finally {
    if (keep) {
      // Nothing the program started outlives the run
      await killLeftovers(containerId);
      sandbox.releaseAfterRun(ownerKey);
    } else void sandbox.destroyOwner(ownerKey);
  }
}

// One run of a runner in a container: writes the runner and its payload,
// then hands over each case line, whose answer ('next' or 'stop') goes back
// to the runner. Returns the runner's header.
async function converse(
  containerId: string,
  judge: JudgeRunner,
  payload: string,
  onCase: (runnerCase: RunnerCase, index: number) => 'next' | 'stop',
  onHeader: () => void = () => {},
): Promise<RunnerHeader> {
  const runner = fs.readFileSync(judge.runnerPath, 'utf8');
  await dockerExec(
    ['exec', '-i', containerId, 'sh', '-c', `rm -rf /work/* && cat > ${judge.containerFile}`],
    WRITE_TIMEOUT_MS,
    runner,
  );
  await dockerExec(
    ['exec', '-i', containerId, 'sh', '-c', 'cat > /work/_payload.json'],
    WRITE_TIMEOUT_MS,
    payload,
  );

  let header: RunnerHeader | null = null;
  let index = 0;
  // Hard ceiling for the exec, independent of the case count: boot, the case
  // budget, and one case that started just before the budget ran out. Past
  // it the runner is stuck, and the container is dropped.
  await dockerConverse(
    ['exec', '-i', containerId, ...judge.runCmd],
    judge.baseTimeoutMs + judge.budgetMs + judge.caseBudgetMs,
    (line) => {
      const message = JSON.parse(line) as RunnerHeader | RunnerCase;
      if (!header) {
        header = message as RunnerHeader;
        onHeader();
        return null;
      }
      return onCase(message as RunnerCase, index++);
    },
  );
  return (header as RunnerHeader | null) ?? failRun();
}

// The judge's own containers, one per language: the only place our solution
// runs. No student's program ever enters one and no owner of a student's
// (`user:`, `guest:`) can be named like it, so what comes out is ours.
function referenceOwner(language: string): string {
  return `judge:reference:${language}`;
}

// A container serves one run at a time, so the reference runs of a language
// take turns.
const referenceTurns = new Map<string, Promise<void>>();

function inTurn<T>(language: string, work: () => Promise<T>): Promise<T> {
  const turn = (referenceTurns.get(language) ?? Promise.resolve()).then(work);
  referenceTurns.set(
    language,
    turn.then(
      () => {},
      () => {},
    ),
  );
  return turn;
}

// Runs our solution on the given cases in the judge's container, through the
// same runner as a student's program, and returns what it printed on each. A
// solution that doesn't compile, crashes or times out is our bug, not the
// student's.
async function runReference(
  { language, judge, spec, solutionCode }: JudgeRun,
  indexes: number[],
): Promise<Reference[]> {
  // No structure rules: they are for the student's program
  const cases = { cases: indexes.map((index) => spec.cases[index]) };
  const prepared = judge.prepare ? await judge.prepare(solutionCode, cases) : null;
  if (prepared?.syntaxError) failRun();

  return withContainer(referenceOwner(language), language, undefined, async (containerId) => {
    const runs: Reference[] = [];
    const header = await converse(
      containerId,
      judge,
      runnerPayload(solutionCode, cases, prepared),
      ({ user, injectError }) => {
        if (!user || injectError || user.timedOut || user.exit !== 0) failRun();
        runs.push({ stdout: user.stdout, ms: user.ms });
        return 'next';
      },
    );
    if (header.syntaxError || runs.length !== indexes.length) failRun();
    return runs;
  });
}

// Each case's reference output before the student's program runs: from the
// cache, and for the cases missing there from a run of our solution in the
// judge's container, the only thing that fills the cache. `later` is a case
// left for after (the load test), -1 for none.
async function referencesBefore(run: JudgeRun, later: number): Promise<(Reference | undefined)[]> {
  const cached = (): (Reference | undefined)[] =>
    run.keys.map((key) => {
      const stdout = key ? getReference(key) : undefined;
      return stdout === undefined ? undefined : { stdout };
    });
  const missing = (references: (Reference | undefined)[]): number[] =>
    references.flatMap((reference, index) => (reference || index === later ? [] : [index]));

  const held = cached();
  if (missing(held).length === 0) return held;
  return inTurn(run.language, async () => {
    // A run ahead of this one in line may have filled the cache
    const references = cached();
    const indexes = missing(references);
    if (indexes.length === 0) return references;
    const runs = await runReference(run, indexes);
    indexes.forEach((index, at) => {
      references[index] = runs[at];
      const key = run.keys[index];
      if (key) putReference(key, runs[at].stdout);
    });
    return references;
  });
}

async function runInContainer(
  ownerKey: string,
  guestIp: string | undefined,
  userCode: string,
  prepared: PrepareResult | null,
  run: JudgeRun,
): Promise<RunTestsResponse> {
  const { judge, spec } = run;
  // The student's container is theirs from here on, so a second run of theirs
  // is refused while this one gets our solution's outputs.
  return withContainer(ownerKey, run.language, guestIp, async (containerId) => {
    // The load test, always last, runs our solution every time, for the
    // runtime shown next to the student's. It waits until the student's
    // program got through the test: most runs stop before it.
    const last = spec.cases.length - 1;
    const loadTest = spec.cases[last]?.load ? last : -1;
    const references = await referencesBefore(run, loadTest);

    let deadline = Infinity;
    const cases: TestCaseResult[] = [];
    const waiting: { load?: RunnerProgram } = {};
    const header = await converse(
      containerId,
      judge,
      runnerPayload(userCode, spec, prepared),
      ({ user, injectError }, index) => {
        if (index >= spec.cases.length || !user || injectError) failRun();
        if (index === loadTest && !user.timedOut && user.exit === 0) {
          waiting.load = user;
          return 'stop';
        }
        const result = judgeCase(spec, index, user, references[index]);
        cases.push(result);
        if (!result.passed) return 'stop';
        // Out of time with cases left: the next one is the case that timed out.
        if (index + 1 < spec.cases.length && Date.now() > deadline) {
          cases.push({ ...caseBase(spec, index + 1), error: 'timeout' });
          return 'stop';
        }
        return 'next';
      },
      () => {
        deadline = Date.now() + judge.budgetMs;
      },
    );

    if (header.syntaxError) return syntaxErrorResponse(spec, header.syntaxError);
    if (waiting.load) {
      const [reference] = await inTurn(run.language, () => runReference(run, [loadTest]));
      cases.push(judgeCase(spec, loadTest, waiting.load, reference));
    }
    // A runner that quits before the last case without a failing one broke.
    if (cases.length < spec.cases.length && cases.every((c) => c.passed)) failRun();
    // Server-prepped runs carry structure failures from the server (the thin
    // runner only reports gcc syntax errors + per-case program results).
    return finalResponse(
      spec,
      prepared ? prepared.structureFailures : (header.structureFailures ?? []),
      cases,
    );
  });
}
