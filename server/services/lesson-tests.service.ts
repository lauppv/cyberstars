import fs from 'fs';
import path from 'path';
import { contentDir } from './paths.js';
import { dockerExec } from './docker-exec.js';
import { acquireForRun, releaseAfterRun, destroyOwner } from './code-container.service.js';
import { AppError } from '../middleware/errorHandler.js';
import type {
  LessonTestsSpec,
  RunTestsResponse,
  TestCaseResult,
  TestComparator,
} from '../../shared/tests.js';

// Server-side judge for lessons that ship a <slug>-tests.json. The heavy
// lifting happens inside the owner's sandbox container (same one the editor
// Run uses): a trusted Python runner checks code structure via ast, injects
// each case's values into the lesson's input variables in both the user code
// and the reference solution, and runs the two programs. Outputs are compared
// HERE, on the server — expected outputs never enter the container, so user
// code cannot read them.
const RUNNER_PATH = path.join(process.cwd(), 'server', 'services', 'lesson-tests.runner.py');

const WRITE_TIMEOUT_MS = 10_000;
// Per case the runner may spend up to 2×5s (user + solution programs).
const CASE_BUDGET_MS = 11_000;
const BASE_TIMEOUT_MS = 15_000;

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
  return normalize(expected) === normalize(actual);
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
  const solutionCode = loadSolutionCode(courseKey, lessonSlug, lang);

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
    const runner = fs.readFileSync(RUNNER_PATH, 'utf8');
    const payload = JSON.stringify({
      userCode,
      solutionCode,
      structure: spec.structure ?? {},
      cases: spec.cases,
    });
    await dockerExec(
      ['exec', '-i', containerId, 'sh', '-c', 'rm -rf /work/* && cat > /work/_runner.py'],
      WRITE_TIMEOUT_MS,
      runner,
    );
    await dockerExec(
      ['exec', '-i', containerId, 'sh', '-c', 'cat > /work/_payload.json'],
      WRITE_TIMEOUT_MS,
      payload,
    );
    const raw = await dockerExec(
      ['exec', containerId, 'python3', '/work/_runner.py', '/work/_payload.json'],
      BASE_TIMEOUT_MS + spec.cases.length * CASE_BUDGET_MS,
    );
    return buildResponse(spec, JSON.parse(raw) as RunnerVerdict);
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
