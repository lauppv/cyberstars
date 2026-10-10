import fs from 'fs';
import path from 'path';
import { contentDir } from './paths.js';
import { dockerExec, dockerConverse } from './docker-exec.js';
import { acquireForRun, releaseAfterRun, destroyOwner } from './code-container.service.js';
import { getRuntime } from '../runtimes/registry.js';
import { AppError } from '../middleware/errorHandler.js';
import { prepareC, type PrepareResult } from './c-analysis.js';
import type {
  LessonTestsSpec,
  RunTestsResponse,
  StructureFailure,
  TestCaseResult,
  TestComparator,
} from '../../shared/tests.js';

// Server-side judge for lessons that ship a <slug>-tests.json. The heavy
// lifting happens inside the owner's sandbox container (same one the editor
// Run uses): a trusted per-language runner checks code structure via the
// language's own parser (Python ast / javac Compiler Tree API), injects each
// case's values into the lesson's input variables in both the user code and
// the reference solution, and runs the two programs. Outputs are compared
// HERE, on the server; expected outputs never enter the container, so user
// code cannot read them.
const SERVICES_DIR = path.join(process.cwd(), 'server', 'services');

const WRITE_TIMEOUT_MS = 10_000;

// The Java runner is compiled once per container into /tmp/_judge (only /work
// is wiped between runs) and recompiled when the shipped source changes (a
// deploy while the container is warm). `exec` keeps the verdict as the sole
// stdout of the docker exec.
const JAVA_BOOT =
  'cmp -s /work/Runner.java /tmp/_judge/Runner.java 2>/dev/null || ' +
  '{ mkdir -p /tmp/_judge && javac -d /tmp/_judge /work/Runner.java && cp /work/Runner.java /tmp/_judge/Runner.java; } && ' +
  'exec java -XX:+UseSerialGC -Xmx96m -cp /tmp/_judge Runner /work/_payload.json';

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
   * submission can't hold the container for cases × 5 s.
   */
  budgetMs: number;
  /** Worst case for one case: 2×5s programs, plus compiles where applicable. */
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
  prepare?: (
    userCode: string,
    solutionCode: string,
    spec: LessonTestsSpec,
  ) => Promise<PrepareResult>;
}

const RUNNERS: Record<string, JudgeRunner> = {
  python: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.py'),
    containerFile: '/work/_runner.py',
    runCmd: ['python3', '/work/_runner.py', '/work/_payload.json'],
    // ~0.1 s per case under the 0.5 CPU cap (two interpreter starts), so 50
    // cases take ~5 s.
    budgetMs: 30_000,
    caseBudgetMs: 11_000,
    baseTimeoutMs: 15_000,
  },
  java: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.java'),
    containerFile: '/work/Runner.java',
    runCmd: ['sh', '-c', JAVA_BOOT],
    // Each case may compile user + solution in-process on top of the two runs;
    // the base covers the one-time runner bootstrap compile on a cold container.
    // ~0.5 s per injected case (javac + 2 JVM starts), so 20 cases take ~10 s.
    budgetMs: 45_000,
    caseBudgetMs: 16_000,
    baseTimeoutMs: 30_000,
  },
  c: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.c.py'),
    containerFile: '/work/_runner.py',
    runCmd: ['python3', '/work/_runner.py', '/work/_payload.json'],
    // Per case: up to 2 gcc compiles + 2×5s runs; the source cache makes
    // identical stdin-only sources compile once. gcc is heavier than a python
    // parse, lighter than javac+JVM. ~80 ms per injected case, a few ms per
    // stdin-only case.
    budgetMs: 30_000,
    caseBudgetMs: 8_000,
    baseTimeoutMs: 20_000,
    prepare: prepareC,
  },
};

// Same ro/-subfolder localization convention as lesson markdown / terminal
// -setup.json, but the tests spec and the solution are a UNIT (the spec's
// inject keys reference the solution's identifiers), so the locale is decided
// once by the tests file and the solution must come from the same folder.
// Mixing locales would make injection a silent no-op and let hardcoding pass.
function testsDir(courseKey: string, lessonSlug: string, lang?: string): string | null {
  const base = contentDir(courseKey);
  if (lang === 'ro' && fs.existsSync(path.join(base, 'ro', `${lessonSlug}-tests.json`))) {
    return path.join(base, 'ro');
  }
  return fs.existsSync(path.join(base, `${lessonSlug}-tests.json`)) ? base : null;
}

export function loadTestsSpec(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
): LessonTestsSpec | null {
  const dir = testsDir(courseKey, lessonSlug, lang);
  if (!dir) return null;
  const file = path.join(dir, `${lessonSlug}-tests.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8')) as LessonTestsSpec;
}

function loadSolutionCode(courseKey: string, lessonSlug: string, lang?: string): string {
  const dir = testsDir(courseKey, lessonSlug, lang);
  if (!dir) throw new AppError(500, 'Test run failed, please try again');
  const md = fs.readFileSync(path.join(dir, `${lessonSlug}-solution.md`), 'utf8');
  const fenced = md.match(/```[\w-]*\n([\s\S]*?)```/);
  if (!fenced) throw new AppError(500, 'Test run failed, please try again');
  return fenced[1];
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

// Timings travel to the client in ms rounded to the microsecond (a small
// program's code runs in well under a millisecond); sums are rounded again so
// float noise never shows up as 0.30000000000000004.
function roundMs(ms: number): number {
  return Math.round(ms * 1000) / 1000;
}

// runtimeMs / referenceMs: sums over the cases timed on BOTH sides, so the two
// totals always cover the same cases and stay comparable.
function timingTotals(
  cases: TestCaseResult[],
): Pick<RunTestsResponse, 'runtimeMs' | 'referenceMs'> {
  const timed = cases.filter((c) => c.userMs !== undefined && c.solutionMs !== undefined);
  if (timed.length === 0) return {};
  return {
    runtimeMs: roundMs(timed.reduce((sum, c) => sum + c.userMs!, 0)),
    referenceMs: roundMs(timed.reduce((sum, c) => sum + c.solutionMs!, 0)),
  };
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

interface RunnerCase {
  user?: RunnerProgram;
  solution?: RunnerProgram;
  injectError?: boolean;
}

function failRun(): never {
  throw new AppError(500, 'Test run failed, please try again');
}

function caseBase(spec: LessonTestsSpec, index: number): TestCaseResult {
  const specCase = spec.cases[index];
  const base: TestCaseResult = { index, visible: specCase.visible ?? false, passed: false };
  if (specCase.inject) base.inject = specCase.inject;
  if (specCase.stdin !== undefined) base.stdin = specCase.stdin;
  if (specCase.generated) base.generated = true;
  return base;
}

function judgeCase(spec: LessonTestsSpec, index: number, c: RunnerCase): TestCaseResult {
  const base = caseBase(spec, index);

  if (!c.user || c.injectError) failRun();
  // A broken reference solution is our bug, not the student's.
  if (!c.solution || c.solution.timedOut || c.solution.exit !== 0) failRun();
  const expected = c.solution.stdout;
  if (c.solution.ms !== undefined) base.solutionMs = roundMs(c.solution.ms);
  if (c.user.ms !== undefined) base.userMs = roundMs(c.user.ms);
  if (c.user.timedOut) return { ...base, error: 'timeout' };
  if (c.user.exit !== 0) return { ...base, error: c.user.stderr || 'error', actual: c.user.stdout };

  // A passed case shows both outputs: the student already produced the expected
  // one, so revealing it gives nothing away, even on a hidden case.
  if (compareOutputs(expected, c.user.stdout, spec.comparator ?? 'trimmed')) {
    return {
      ...base,
      passed: true,
      expected: normalize(expected),
      actual: normalize(c.user.stdout),
    };
  }
  return {
    ...base,
    actual: normalize(c.user.stdout),
    ...(base.visible ? { expected: normalize(expected) } : {}),
  };
}

function syntaxErrorResponse(spec: LessonTestsSpec, syntaxError: string): RunTestsResponse {
  return {
    status: 'failed',
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
    structureFailures,
    cases,
    total: spec.cases.length,
    passedCount,
    ...timingTotals(cases),
  };
}

export async function runLessonTests(
  ownerKey: string,
  courseKey: string,
  lessonSlug: string,
  userCode: string,
  lang?: string,
): Promise<RunTestsResponse> {
  const spec = loadTestsSpec(courseKey, lessonSlug, lang);
  if (!spec) throw new AppError(404, 'This lesson has no tests');
  const judge = RUNNERS[getRuntime(courseKey)?.name ?? ''];
  if (!judge) throw new AppError(404, 'This lesson has no tests');
  const solutionCode = loadSolutionCode(courseKey, lessonSlug, lang);

  // Server-side prep (C): structure + injection happen here; a syntax error in
  // the pristine user code is caught before any container is touched (gate 1).
  const prepared = judge.prepare ? await judge.prepare(userCode, solutionCode, spec) : null;
  if (prepared?.syntaxError) return syntaxErrorResponse(spec, prepared.syntaxError);

  let containerId: string;
  try {
    containerId = await acquireForRun(ownerKey, courseKey);
  } catch (err) {
    if (err instanceof Error && err.message === 'A run is already in progress') {
      throw new AppError(409, 'A run is already in progress');
    }
    throw new AppError(500, 'Could not start the runner. Please try again.');
  }

  let keep = true;
  try {
    const runner = fs.readFileSync(judge.runnerPath, 'utf8');
    // The C runner receives pre-injected sources; py/java runners inject in the
    // container from the raw code + spec.
    const payload = prepared
      ? JSON.stringify({ pristineUser: userCode, cases: prepared.cases })
      : JSON.stringify({
          userCode,
          solutionCode,
          structure: spec.structure ?? {},
          cases: spec.cases,
        });
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
    let deadline = Infinity;
    const cases: TestCaseResult[] = [];
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
          deadline = Date.now() + judge.budgetMs;
          return null;
        }
        const index = cases.length;
        if (index >= spec.cases.length) failRun();
        const result = judgeCase(spec, index, message as RunnerCase);
        cases.push(result);
        if (!result.passed) return 'stop';
        // Out of time with cases left: the next one is the case that timed out.
        if (index + 1 < spec.cases.length && Date.now() > deadline) {
          cases.push({ ...caseBase(spec, index + 1), error: 'timeout' });
          return 'stop';
        }
        return 'next';
      },
    );

    const { syntaxError, structureFailures = [] } = (header as RunnerHeader | null) ?? failRun();
    if (syntaxError) return syntaxErrorResponse(spec, syntaxError);
    // A runner that quits before the last case without a failing one broke.
    if (cases.length < spec.cases.length && cases.every((c) => c.passed)) failRun();
    // Server-prepped runs carry structure failures from the server (the thin
    // runner only reports gcc syntax errors + per-case program results).
    return finalResponse(spec, prepared ? prepared.structureFailures : structureFailures, cases);
  } catch (err) {
    // Anything that breaks the run (stuck exec, bad container state), drop the
    // container so the next attempt starts clean.
    keep = false;
    throw err instanceof AppError ? err : new AppError(500, 'Test run failed, please try again');
  } finally {
    if (keep) releaseAfterRun(ownerKey);
    else void destroyOwner(ownerKey);
  }
}
