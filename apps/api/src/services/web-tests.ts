import fs from 'fs';
import path from 'path';
import { dockerConverse, dockerExec, killLeftovers } from '@cyberstars-framework/sandbox/docker';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { isImagePath, isValidWebPath, parseWebFiles } from '@cyberstars/shared/webFiles';
import {
  WEB_DEFAULT_WIDTH,
  WEB_HEIGHT,
  type WebBox,
  type WebCheck,
  type WebFailure,
  type WebObservation,
  type WebStep,
  type WebTestCase,
  type WebTestsSpec,
} from '@cyberstars/shared/webTests';
import type { RunTestsResponse, TestCaseResult } from '@cyberstars/shared/tests';
import { contentDir } from './paths.js';
import { sandbox } from './sandbox.js';
import { acquireJudgeSlot } from './judge-queue.js';
import { inLine } from './run-waits.js';
import { WEB_LANGUAGE } from '../runtimes/registry.js';

// The web judge (CYB-110). A web lesson's Run Tests loads the student's whole
// site in a headless Chromium in the owner's web sandbox. The trusted runner
// (lesson-tests.runner.web.cjs) walks each case's steps and reports what the
// page had; the verdict is decided HERE, so the expected values never enter
// the sandbox, as with the other judges. Like them it runs the cases in
// lockstep and stops at the first one that fails.

const RUNNER_PATH = path.join(import.meta.dirname, 'lesson-tests.runner.web.cjs');
const WRITE_TIMEOUT_MS = 10_000;
// One step (a load, an action, a look) may take this long; past it the page
// counts as stuck, like a program past its time
const STEP_MS = 5_000;
// The cases share this, counted from the browser being up
const BUDGET_MS = 30_000;
// Browser start, before the first case
const BASE_TIMEOUT_MS = 20_000;
// The longest one case may take, its steps and its fresh page
const CASE_BUDGET_MS = 20_000;
// The page's own JavaScript heap: past it the page crashes, reported as using
// too much memory, long before the container's cap
const PAGE_HEAP_MB = 128;

// The lesson's spec in the student's language when it has one: its labels
// are in that language, and so is what a failed check says
function webSpecFile(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
): { file: string; lang: 'en' | 'ro' } | null {
  const base = contentDir(courseKey);
  const localized = path.join(base, 'ro', `${lessonSlug}-tests.json`);
  if (lang === 'ro' && fs.existsSync(localized)) return { file: localized, lang: 'ro' };
  const file = path.join(base, `${lessonSlug}-tests.json`);
  return fs.existsSync(file) ? { file, lang: 'en' } : null;
}

export function loadWebTestsSpec(
  courseKey: string,
  lessonSlug: string,
  lang?: string,
): WebTestsSpec | null {
  const found = webSpecFile(courseKey, lessonSlug, lang);
  return found ? (JSON.parse(fs.readFileSync(found.file, 'utf8')) as WebTestsSpec) : null;
}

type SiteFile = string | { base64: string };

// The site as the runner serves it: the student's files, and each image the
// site names read from the course's assets/ folder
function siteFiles(courseKey: string, code: string): Record<string, SiteFile> {
  const assets = path.join(contentDir(courseKey), 'assets');
  const files: Record<string, SiteFile> = {};
  for (const file of parseWebFiles(code)) {
    if (!isValidWebPath(file.path)) continue;
    if (file.image) {
      const asset = path.join(assets, file.path);
      if (isImagePath(file.path) && fs.existsSync(asset)) {
        files[file.path] = { base64: fs.readFileSync(asset).toString('base64') };
      }
    } else files[file.path] = file.content;
  }
  return files;
}

// ── Judging what the page had ───────────────────────────────────────────────

const collapse = (text: string) => text.replace(/\s+/g, ' ').trim();

function arrangement(boxes: WebBox[]): 'row' | 'column' | 'mixed' | 'one' {
  if (boxes.length < 2) return 'one';
  const pairs = boxes.slice(1).map((next, i) => [boxes[i], next] as const);
  // Half a pixel either way is rounding, not a gap
  const row = pairs.every(
    ([a, b]) => b.x >= a.x + a.width - 0.5 && b.y < a.y + a.height && a.y < b.y + b.height,
  );
  if (row) return 'row';
  const column = pairs.every(
    ([a, b]) => b.y >= a.y + a.height - 0.5 && b.x < a.x + a.width && a.x < b.x + b.width,
  );
  return column ? 'column' : 'mixed';
}

const BOUNDS = ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'] as const;

function sizeFailure(
  step: Extract<WebCheck, { size: string }>,
  box: WebBox,
): Pick<WebFailure, 'detail' | 'expected' | 'found'> | null {
  for (const bound of BOUNDS) {
    const limit = step[bound];
    if (limit === undefined) continue;
    const value = bound.endsWith('Width') ? box.width : box.height;
    const ok = bound.startsWith('min') ? value >= limit - 0.5 : value <= limit + 0.5;
    if (!ok) return { detail: bound, expected: String(limit), found: String(Math.round(value)) };
  }
  return null;
}

// Why the step failed, or null when the page is as the mission asks
export function judgeStep(step: WebStep, seen: WebObservation, width: number): WebFailure | null {
  if ('click' in step || 'hover' in step || 'fill' in step || 'submit' in step || 'press' in step) {
    if (seen.ok !== false) return null;
    return { kind: 'missing', label: step.label ?? ('on' in step ? step.on : undefined) };
  }
  if ('open' in step || 'wait' in step) return null;
  if ('fits' in step) {
    const scroll = seen.scrollWidth ?? 0;
    return scroll <= width + 1 ? null : { kind: 'fits', found: String(scroll), width };
  }
  if ('logged' in step) {
    const logs = seen.logs ?? [];
    if (logs.some((line) => line.trim() === step.logged.trim())) return null;
    return { kind: 'logged', expected: step.logged, found: logs.at(-1) ?? null };
  }
  if ('noErrors' in step) {
    const errors = seen.errors ?? [];
    return errors.length === 0 ? null : { kind: 'errors', found: errors[0] };
  }
  if ('at' in step) {
    return seen.page === step.at ? null : { kind: 'at', expected: step.at, found: seen.page };
  }

  const label = step.label;
  const count = seen.count ?? 0;
  if ('count' in step) {
    if (step.equals !== undefined && count !== step.equals) {
      return {
        kind: 'count',
        label,
        detail: 'equals',
        expected: String(step.equals),
        found: String(count),
      };
    }
    if (step.atLeast !== undefined && count < step.atLeast) {
      return {
        kind: 'count',
        label,
        detail: 'atLeast',
        expected: String(step.atLeast),
        found: String(count),
      };
    }
    return null;
  }
  if (count === 0) return { kind: 'missing', label };
  if ('exists' in step) return null;

  const values = seen.values ?? [];
  if ('text' in step) {
    const texts = values.map((v) => collapse(v ?? ''));
    if (step.nonEmpty) {
      return texts.some((t) => t !== '')
        ? null
        : { kind: 'text', label, detail: 'nonEmpty', found: '' };
    }
    if (step.contains !== undefined) {
      const want = collapse(step.contains);
      return texts.some((t) => t.includes(want))
        ? null
        : { kind: 'text', label, detail: 'contains', expected: want, found: texts[0] };
    }
    const want = collapse(step.equals ?? '');
    return texts.some((t) => t === want)
      ? null
      : { kind: 'text', label, detail: 'equals', expected: want, found: texts[0] };
  }
  if ('attr' in step) {
    const value = values[0] ?? null;
    if (step.equals === undefined) {
      return value !== null
        ? null
        : { kind: 'attr', label, detail: step.name, expected: '', found: null };
    }
    const same =
      value !== null &&
      (step.ignoreCase ? value.toLowerCase() === step.equals.toLowerCase() : value === step.equals);
    return same
      ? null
      : { kind: 'attr', label, detail: step.name, expected: step.equals, found: value };
  }
  if ('style' in step) {
    const value = (values[0] ?? '').trim();
    return value === step.equals
      ? null
      : { kind: 'style', label, detail: step.prop, expected: step.equals, found: value };
  }
  const boxes = seen.boxes ?? [];
  if ('layout' in step) {
    const found = arrangement(boxes);
    return found === step.arrange
      ? null
      : { kind: 'layout', label, expected: step.arrange, found, width };
  }
  const failed = boxes[0] ? sizeFailure(step, boxes[0]) : null;
  return failed ? { kind: 'size', label, width, ...failed } : null;
}

// A hidden case tells only what the page had
function hide(failure: WebFailure): WebFailure {
  const { expected: _expected, ...rest } = failure;
  return { ...rest, hidden: true };
}

interface RunnerCase {
  steps: WebObservation[];
  timedOut?: boolean;
  crashed?: boolean;
}

function caseBase(testCase: WebTestCase, index: number): TestCaseResult {
  return { index, name: testCase.name, visible: testCase.visible ?? false, passed: false };
}

// `pages`: the pages the case's site has, so a missing one is said as such.
// `lang`: the spec's, whose labels a failure carries; a Romanian one says so
export function judgeWebCase(
  testCase: WebTestCase,
  index: number,
  ran: RunnerCase,
  pages: ReadonlySet<string>,
  lang: 'en' | 'ro' = 'en',
): TestCaseResult {
  const base = caseBase(testCase, index);
  const told = (failure: WebFailure): TestCaseResult => ({
    ...base,
    web: lang === 'ro' ? { ...failure, lang } : failure,
  });
  const page = testCase.page ?? 'index.html';
  if (!pages.has(page)) return told({ kind: 'missing', label: page });
  const width = testCase.width ?? WEB_DEFAULT_WIDTH;
  for (const [i, step] of testCase.steps.entries()) {
    const seen = ran.steps[i];
    if (!seen) break;
    const failure = judgeStep(step, seen, width);
    if (failure) return told(base.visible ? failure : hide(failure));
  }
  if (ran.crashed) return told({ kind: 'memory' });
  if (ran.timedOut) return { ...base, error: 'timeout' };
  // A runner that stopped short without a reason broke
  if (ran.steps.length < testCase.steps.length) failRun();
  return { ...base, passed: true };
}

function failRun(): never {
  throw new AppError(500, 'Test run failed, please try again');
}

function respond(spec: WebTestsSpec, cases: TestCaseResult[]): RunTestsResponse {
  const passedCount = cases.filter((c) => c.passed).length;
  return {
    status: passedCount === spec.cases.length ? 'passed' : 'failed',
    comparator: 'exact',
    structureFailures: [],
    cases,
    total: spec.cases.length,
    passedCount,
  };
}

// ── The run ─────────────────────────────────────────────────────────────────

export async function runWebLessonTests(
  ownerKey: string,
  courseKey: string,
  lessonSlug: string,
  code: string,
  lang?: string,
  guestIp?: string,
  waitKey: string | null = null,
): Promise<RunTestsResponse> {
  const found = webSpecFile(courseKey, lessonSlug, lang);
  if (!found) throw new AppError(404, 'This lesson has no tests');
  const spec = JSON.parse(fs.readFileSync(found.file, 'utf8')) as WebTestsSpec;
  const files = siteFiles(courseKey, code);

  if (sandbox.isRunning(ownerKey)) throw new AppError(409, 'A run is already in progress');
  const releaseSlot = await inLine(waitKey, (onWait) => acquireJudgeSlot({ onWait }));
  try {
    const releaseSandbox = await inLine(waitKey, (onWait) => sandbox.acquireSlot({ onWait }));
    try {
      return await runInContainer(ownerKey, guestIp, spec, found.lang, files);
    } finally {
      releaseSandbox();
    }
  } finally {
    releaseSlot();
  }
}

async function runInContainer(
  ownerKey: string,
  guestIp: string | undefined,
  spec: WebTestsSpec,
  specLang: 'en' | 'ro',
  files: Record<string, SiteFile>,
): Promise<RunTestsResponse> {
  let containerId: string;
  try {
    containerId = await sandbox.acquireForRun(ownerKey, WEB_LANGUAGE, guestIp);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof Error && err.message === 'A run is already in progress') {
      throw new AppError(409, 'A run is already in progress');
    }
    throw new AppError(500, 'Could not start the runner. Please try again.');
  }

  let keep = true;
  try {
    const payload = JSON.stringify({
      files,
      stepMs: STEP_MS,
      heapMb: PAGE_HEAP_MB,
      height: WEB_HEIGHT,
      cases: spec.cases.map((c) => ({
        page: c.page ?? 'index.html',
        width: c.width ?? WEB_DEFAULT_WIDTH,
        files: c.files,
        fetch: c.fetch,
        steps: c.steps,
      })),
    });
    await dockerExec(
      ['exec', '-i', containerId, 'sh', '-c', 'rm -rf /work/* && cat > /work/_runner.cjs'],
      WRITE_TIMEOUT_MS,
      fs.readFileSync(RUNNER_PATH, 'utf8'),
    );
    await dockerExec(
      ['exec', '-i', containerId, 'sh', '-c', 'cat > /work/_payload.json'],
      WRITE_TIMEOUT_MS,
      payload,
    );

    let ready = false;
    let deadline = Infinity;
    const cases: TestCaseResult[] = [];
    await dockerConverse(
      ['exec', '-i', containerId, 'node', '/work/_runner.cjs', '/work/_payload.json'],
      BASE_TIMEOUT_MS + BUDGET_MS + CASE_BUDGET_MS,
      (line) => {
        const message = JSON.parse(line) as { ready?: true; launchError?: string } & RunnerCase;
        if (!ready) {
          if (!message.ready) {
            console.error('[web-tests] the browser did not start:', message.launchError);
            failRun();
          }
          ready = true;
          deadline = Date.now() + BUDGET_MS;
          return null;
        }
        const index = cases.length;
        if (index >= spec.cases.length) failRun();
        const testCase = spec.cases[index];
        const pages = new Set([...Object.keys(files), ...Object.keys(testCase.files ?? {})]);
        const result = judgeWebCase(testCase, index, message, pages, specLang);
        cases.push(result);
        if (!result.passed) return 'stop';
        if (index + 1 < spec.cases.length && Date.now() > deadline) {
          cases.push({ ...caseBase(spec.cases[index + 1], index + 1), error: 'timeout' });
          return 'stop';
        }
        return 'next';
      },
    );
    if (!ready) failRun();
    if (cases.length < spec.cases.length && cases.every((c) => c.passed)) failRun();
    return respond(spec, cases);
  } catch (err) {
    keep = false;
    throw err instanceof AppError ? err : new AppError(500, 'Test run failed, please try again');
  } finally {
    if (keep) {
      await killLeftovers(containerId);
      sandbox.releaseAfterRun(ownerKey);
    } else void sandbox.destroyOwner(ownerKey);
  }
}
