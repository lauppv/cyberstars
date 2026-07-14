import fs from 'fs';
import path from 'path';
import { contentDir } from './paths.js';
import { dockerExec } from './docker-exec.js';
import { acquireForRun, releaseAfterRun, destroyOwner } from './code-container.service.js';
import { getRuntime } from '../runtimes/registry.js';
import { AppError } from '../middleware/errorHandler.js';
import { prepareC, type PrepareResult } from './c-analysis.js';
import type {
  LessonTestsSpec,
  RunTestsResponse,
  TestCaseResult,
  TestComparator,
} from '../../shared/tests.js';

// Server-side judge for lessons that ship a <slug>-tests.json. The heavy
// lifting happens inside the owner's sandbox container (same one the editor
// Run uses): a trusted per-language runner checks code structure via the
// language's own parser (Python ast / javac Compiler Tree API), injects each
// case's values into the lesson's input variables in both the user code and
// the reference solution, and runs the two programs. Outputs are compared
// HERE, on the server — expected outputs never enter the container, so user
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
  /** Per-case runner budget: 2×5s programs, plus compiles where applicable. */
  caseBudgetMs: number;
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
    caseBudgetMs: 11_000,
    baseTimeoutMs: 15_000,
  },
  java: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.java'),
    containerFile: '/work/Runner.java',
    runCmd: ['sh', '-c', JAVA_BOOT],
    // Each case may compile user + solution in-process on top of the two runs;
    // the base covers the one-time runner bootstrap compile on a cold container.
    caseBudgetMs: 16_000,
    baseTimeoutMs: 30_000,
  },
  c: {
    runnerPath: path.join(SERVICES_DIR, 'lesson-tests.runner.c.py'),
    containerFile: '/work/_runner.py',
    runCmd: ['python3', '/work/_runner.py', '/work/_payload.json'],
    // Per case: up to 2 gcc compiles + 2×5s runs; the source cache makes
    // identical stdin-only sources compile once. gcc is heavier than a python
    // parse, lighter than javac+JVM.
    caseBudgetMs: 8_000,
    baseTimeoutMs: 20_000,
    prepare: prepareC,
  },
};

// Same ro/-subfolder localization convention as lesson markdown / terminal
// -setup.json — but the tests spec and the solution are a UNIT (the spec's
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
  if (!dir) throw new AppError(500, 'Test run failed — please try again');
  const md = fs.readFileSync(path.join(dir, `${lessonSlug}-solution.md`), 'utf8');
  const fenced = md.match(/```[\w-]*\n([\s\S]*?)```/);
  if (!fenced) throw new AppError(500, 'Test run failed — please try again');
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

// Compare outputs as a multiset of lines — thread/process lessons whose line
// order varies between runs still match when the set of lines is identical.
function sortLines(output: string): string {
  return output.split('\n').sort().join('\n');
}

interface RunnerProgram {
  stdout: string;
  stderr: string;
  exit: number;
  timedOut: boolean;
}

interface RunnerVerdict {
  syntaxError: string | null;
  structureFailures: RunTestsResponse['structureFailures'];
  cases: { user?: RunnerProgram; solution?: RunnerProgram; injectError?: boolean }[];
}

function buildResponse(spec: LessonTestsSpec, verdict: RunnerVerdict): RunTestsResponse {
  if (verdict.syntaxError) {
    return { status: 'failed', syntaxError: verdict.syntaxError, structureFailures: [], cases: [] };
  }

  const comparator = spec.comparator ?? 'trimmed';
  const cases: TestCaseResult[] = verdict.cases.map((c, index) => {
    const specCase = spec.cases[index];
    const visible = specCase?.visible ?? false;
    const base: TestCaseResult = { index, visible, passed: false };
    if (specCase?.inject) base.inject = specCase.inject;
    if (specCase?.stdin !== undefined) base.stdin = specCase.stdin;

    // A broken reference solution is our bug, not the student's.
    if (!c.user || !c.solution || c.injectError || c.solution.timedOut || c.solution.exit !== 0) {
      throw new AppError(500, 'Test run failed — please try again');
    }
    if (c.user.timedOut) return { ...base, error: 'timeout' };
    if (c.user.exit !== 0)
      return { ...base, error: c.user.stderr || 'error', actual: c.user.stdout };

    if (compareOutputs(c.solution.stdout, c.user.stdout, comparator)) {
      return { ...base, passed: true };
    }
    return {
      ...base,
      actual: normalize(c.user.stdout),
      ...(visible ? { expected: normalize(c.solution.stdout) } : {}),
    };
  });

  const passed = verdict.structureFailures.length === 0 && cases.every((c) => c.passed);
  return {
    status: passed ? 'passed' : 'failed',
    structureFailures: verdict.structureFailures,
    cases,
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
  if (prepared?.syntaxError) {
    return buildResponse(spec, {
      syntaxError: prepared.syntaxError,
      structureFailures: [],
      cases: [],
    });
  }

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
    const raw = await dockerExec(
      ['exec', containerId, ...judge.runCmd],
      judge.baseTimeoutMs + spec.cases.length * judge.caseBudgetMs,
    );
    const runnerOut = JSON.parse(raw) as RunnerVerdict;
    // Server-prepped runs carry structure failures from the server (the thin
    // runner only reports gcc syntax errors + per-case program results).
    const verdict: RunnerVerdict = prepared
      ? {
          syntaxError: runnerOut.syntaxError,
          structureFailures: prepared.structureFailures,
          cases: runnerOut.cases,
        }
      : runnerOut;
    return buildResponse(spec, verdict);
  } catch (err) {
    // Anything that breaks the run (stuck exec, bad container state) — drop the
    // container so the next attempt starts clean.
    keep = false;
    throw err instanceof AppError ? err : new AppError(500, 'Test run failed — please try again');
  } finally {
    if (keep) releaseAfterRun(ownerKey);
    else void destroyOwner(ownerKey);
  }
}
