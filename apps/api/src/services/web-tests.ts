import fs from 'fs';
import path from 'path';
import { dockerConverse, dockerExec, killLeftovers } from '@cyberstars-framework/sandbox/docker';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { isAssetPath, isValidWebPath, parseWebFiles } from '@cyberstars/shared/webFiles';
import {
  WEB_ACTION_KEYS,
  WEB_AGAINST_WITHIN,
  WEB_DEFAULT_WIDTH,
  WEB_HEIGHT,
  isWebAction,
  type WebBox,
  type WebCheck,
  type WebFailure,
  type WebObservation,
  type WebRequest,
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

// The site as the runner serves it: the student's files, and each image,
// video or sound the site names read from the course's assets/ folder
function siteFiles(courseKey: string, code: string): Record<string, SiteFile> {
  const assets = path.join(contentDir(courseKey), 'assets');
  const files: Record<string, SiteFile> = {};
  for (const file of parseWebFiles(code)) {
    if (!isValidWebPath(file.path)) continue;
    if (file.image) {
      const asset = path.join(assets, file.path);
      if (isAssetPath(file.path) && fs.existsSync(asset)) {
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

// The room between each element and the next, along the way they stand
function gaps(boxes: WebBox[], arrange: 'row' | 'column'): number[] {
  return boxes
    .slice(1)
    .map((next, i) =>
      arrange === 'row'
        ? next.x - (boxes[i].x + boxes[i].width)
        : next.y - (boxes[i].y + boxes[i].height),
    );
}

// How a style value misses the step: not the value it `equals`, the one it's
// `not`, or a length outside its bounds (one that isn't a length misses them)
function styleMiss(
  step: Extract<WebCheck, { style: string }>,
  value: string,
): Pick<WebFailure, 'expected' | 'compare'> | null {
  if (step.equals !== undefined) return value === step.equals ? null : { expected: step.equals };
  if (step.not !== undefined) {
    return value !== step.not ? null : { expected: step.not, compare: 'not' };
  }
  if (step.endsWith !== undefined) {
    return value.endsWith(step.endsWith) ? null : { expected: step.endsWith, compare: 'endsWith' };
  }
  const px = /^-?[\d.]+px$/.test(value) ? parseFloat(value) : NaN;
  if (step.atLeast !== undefined && !(px >= step.atLeast - 0.5)) {
    return { expected: String(step.atLeast), compare: 'atLeast' };
  }
  if (step.atMost !== undefined && !(px <= step.atMost + 0.5)) {
    return { expected: String(step.atMost), compare: 'atMost' };
  }
  return null;
}

// One h1, and no heading more than a level below the one before it
function outlineFailure(headings: { level: number; text: string }[]): WebFailure | null {
  const ones = headings.filter((h) => h.level === 1).length;
  if (ones !== 1) return { kind: 'outline', detail: 'h1', found: String(ones) };
  for (const [i, h] of headings.entries()) {
    const before = headings[i - 1];
    if (before && h.level > before.level + 1) {
      return {
        kind: 'outline',
        detail: 'skip',
        expected: `h${before.level}`,
        other: `h${h.level}`,
        found: h.text,
      };
    }
  }
  return null;
}

// A form's fields as the preview's console says them: name=value&...
function formLine(fields: [string, string][]): string {
  return fields.map(([name, value]) => `${name}=${value}`).join('&');
}

// The last form sent has each field asked with its value (one of its values,
// for a name sent twice)
function sentFailure(want: Record<string, string>, forms: [string, string][][]): WebFailure | null {
  const last = forms.at(-1);
  if (!last) return { kind: 'sent', detail: 'none' };
  for (const [name, value] of Object.entries(want)) {
    const had = last.filter(([n]) => n === name).map(([, v]) => v);
    if (had.includes(value)) continue;
    return { kind: 'sent', detail: 'field', other: name, expected: value, found: had[0] ?? null };
  }
  return null;
}

// An address as the browser writes it, so `https://a.test` and `https://a.test/` match
function address(url: string): string {
  try {
    return new URL(url).href;
  } catch {
    return url;
  }
}

// Two values read from JSON hold the same, whatever the order of an object's keys
function sameJson(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return (
    ka.length === kb.length &&
    ka.every((k) => sameJson((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
  );
}

const requestLine = (r: WebRequest) => `${r.method} ${r.url}`;

// The page asked for the address (with the method the check names), and the
// last such request sent the fields asked as JSON; or, with `none`, never asked
function requestedFailure(
  step: Extract<WebCheck, { requested: string }>,
  requests: WebRequest[],
): WebFailure | null {
  const url = address(step.requested);
  const method = step.method?.toUpperCase();
  const where = method ? `${method} ${url}` : url;
  const atUrl = requests.filter((r) => address(r.url) === url);
  const matching = method ? atUrl.filter((r) => r.method.toUpperCase() === method) : atUrl;
  if (step.none) {
    return matching.length ? { kind: 'requested', detail: 'none', other: where } : null;
  }
  const last = matching.at(-1);
  if (!last) {
    if (method && atUrl.length) {
      return {
        kind: 'requested',
        detail: 'method',
        other: url,
        expected: method,
        found: atUrl.at(-1)!.method,
      };
    }
    const before = requests.at(-1);
    return { kind: 'requested', other: where, found: before ? requestLine(before) : null };
  }
  if (!step.json) return null;
  let body: unknown;
  try {
    body = last.body === null ? undefined : JSON.parse(last.body);
  } catch {
    body = undefined;
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { kind: 'requested', detail: 'notJson', other: where, found: last.body };
  }
  for (const [name, value] of Object.entries(step.json)) {
    const had = (body as Record<string, unknown>)[name];
    if (sameJson(had, value)) continue;
    return {
      kind: 'requested',
      detail: 'field',
      other: where,
      expected: `${name}: ${JSON.stringify(value)}`,
      found: had === undefined ? null : `${name}: ${JSON.stringify(had)}`,
    };
  }
  return null;
}

function valueFailure(
  step: Extract<WebCheck, { value: string }>,
  value: string,
): WebFailure | null {
  const label = step.label;
  if (step.nonEmpty)
    return value !== '' ? null : { kind: 'value', label, detail: 'nonEmpty', found: '' };
  if (step.empty)
    return value === '' ? null : { kind: 'value', label, detail: 'empty', found: value };
  if (step.contains !== undefined) {
    const want = collapse(step.contains);
    return value.includes(want)
      ? null
      : { kind: 'value', label, detail: 'contains', expected: want, found: value };
  }
  const want = collapse(step.equals ?? '');
  return value === want
    ? null
    : { kind: 'value', label, detail: 'equals', expected: want, found: value };
}

// Every element inside its ancestor and no further than `within` px from the
// side (both sides of a corner) asked
function againstFailure(
  step: Extract<WebCheck, { against: string }>,
  pairs: [WebBox, WebBox | null][],
): WebFailure | null {
  const { label, inLabel: other } = step;
  const within = step.within ?? WEB_AGAINST_WITHIN;
  for (const [box, parent] of pairs) {
    if (!parent) return { kind: 'against', label, other, detail: 'none' };
    const room = {
      top: box.y - parent.y,
      left: box.x - parent.x,
      bottom: parent.y + parent.height - (box.y + box.height),
      right: parent.x + parent.width - (box.x + box.width),
    };
    if (Object.values(room).some((r) => r < -1)) {
      return { kind: 'against', label, other, detail: 'outside' };
    }
    const far = Math.max(...step.side.split(' ').map((s) => room[s as keyof typeof room]));
    if (far > within + 0.5) {
      return {
        kind: 'against',
        label,
        other,
        detail: step.side,
        expected: String(within),
        found: String(Math.round(far)),
      };
    }
  }
  return null;
}

// Whether `a` comes before `b` read as a page is: above it, or beside it on
// its left
function readsBefore(a: WebBox, b: WebBox): boolean {
  if (a.y + a.height <= b.y + 0.5) return true;
  if (b.y + b.height <= a.y + 0.5) return false;
  return a.x + a.width / 2 < b.x + b.width / 2;
}

// How elements fail to wrap in their parent: all on one row, one under the
// other (a column, each row one element), or one sticking out. Read in the
// order they show, whatever the HTML's
function wrapsMiss(items: WebBox[], parent: WebBox | undefined): string | null {
  if (!parent || items.length < 2) return 'one';
  if (items.some((b) => b.x < parent.x - 1 || b.x + b.width > parent.x + parent.width + 1)) {
    return 'out';
  }
  const rows: WebBox[][] = [];
  for (const box of [...items].sort((a, b) => a.y - b.y)) {
    const row = rows.find((r) =>
      r.some((o) => box.y < o.y + o.height - 0.5 && o.y < box.y + box.height - 0.5),
    );
    if (row) row.push(box);
    else rows.push([box]);
  }
  if (rows.length < 2) return 'one';
  return rows.some((r) => r.length > 1) ? null : 'column';
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
  if (isWebAction(step)) {
    // open, wait and scroll can't miss; the others name an element the page may lack
    if (seen.ok !== false || 'open' in step || 'wait' in step || 'scroll' in step) return null;
    return { kind: 'missing', label: step.label ?? ('on' in step ? step.on : undefined) };
  }
  if ('fits' in step) {
    const scroll = seen.scrollWidth ?? 0;
    return scroll <= width + 1 ? null : { kind: 'fits', found: String(scroll), width };
  }
  if ('doctype' in step) return seen.standards ? null : { kind: 'doctype' };
  if ('logged' in step) {
    const logs = seen.logs ?? [];
    const there = logs.some((line) => line.trim() === step.logged.trim());
    if (step.none) return there ? { kind: 'logged', detail: 'none', expected: step.logged } : null;
    if (there) return null;
    return { kind: 'logged', expected: step.logged, found: logs.at(-1) ?? null };
  }
  if ('alerted' in step) {
    const dialogs = seen.dialogs ?? [];
    const there = dialogs.some((line) => line.trim() === step.alerted.trim());
    if (step.none)
      return there ? { kind: 'alerted', detail: 'none', expected: step.alerted } : null;
    if (there) return null;
    return { kind: 'alerted', expected: step.alerted, found: dialogs.at(-1) ?? null };
  }
  if ('noErrors' in step) {
    const errors = seen.errors ?? [];
    return errors.length === 0 ? null : { kind: 'errors', found: errors[0] };
  }
  if ('at' in step) {
    return seen.page === step.at ? null : { kind: 'at', expected: step.at, found: seen.page };
  }
  if ('outline' in step) return outlineFailure(seen.headings ?? []);
  if ('sent' in step) return sentFailure(step.sent, seen.forms ?? []);
  if ('notSent' in step) {
    const last = (seen.forms ?? []).at(-1);
    return last ? { kind: 'sent', detail: 'sent', found: formLine(last) } : null;
  }
  if ('requested' in step) return requestedFailure(step, seen.requests ?? []);

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
    // The first element's, or with `every` the first one that misses
    const all = values.length ? values : [''];
    const read = (step.every ? all : all.slice(0, 1)).map((v) => (v ?? '').trim());
    // A pseudo-element's style says so: "::before content"
    const detail = step.pseudo ? `${step.pseudo} ${step.prop}` : step.prop;
    for (const value of read) {
      const missed = styleMiss(step, value);
      if (missed) return { kind: 'style', label, detail, found: value, ...missed };
    }
    return null;
  }
  if ('contrast' in step) {
    const low = (seen.ratios ?? []).find((ratio) => ratio < step.atLeast);
    if (low !== undefined) {
      return { kind: 'contrast', label, expected: String(step.atLeast), found: String(low) };
    }
    const wrongWay = step.on && (seen.darker ?? []).some((dark) => dark !== (step.on === 'dark'));
    return wrongWay ? { kind: 'contrast', label, detail: 'on', expected: step.on } : null;
  }
  if ('differs' in step) {
    // Alike: an element with every prop the same as one other element's, not
    // each prop matched by some other element or another
    const others = seen.others ?? [];
    const alike = (seen.rows ?? []).some((row) =>
      others.some((other) => row.every((value, i) => other[i] === value)),
    );
    if (!alike) return null;
    return { kind: 'differs', label, other: step.fromLabel, detail: step.props.join(', ') };
  }
  const boxes = seen.boxes ?? [];
  if ('layout' in step) {
    const found = arrangement(boxes);
    if (found !== step.arrange) {
      return { kind: 'layout', label, expected: step.arrange, found, width };
    }
    const least = step.gap === undefined ? Infinity : Math.min(...gaps(boxes, step.arrange));
    if (step.gap !== undefined && least < step.gap - 0.5) {
      return {
        kind: 'gap',
        label,
        expected: String(step.gap),
        found: String(Math.round(least)),
        width,
      };
    }
    if (step.align === undefined) return null;
    // Tops of a row, left edges of a column
    const edges = boxes.map((b) => (step.arrange === 'row' ? b.y : b.x));
    const spread = Math.max(...edges) - Math.min(...edges);
    if (spread <= 1) return null;
    return {
      kind: 'align',
      label,
      expected: step.arrange,
      found: String(Math.round(spread)),
      width,
    };
  }
  if ('loaded' in step) {
    const missed = (seen.values ?? []).find((v) => v !== 'yes');
    if (missed === undefined) return null;
    // A video, a sound or a track the runner reports as `media`
    return missed === 'media'
      ? { kind: 'loaded', label, detail: 'media' }
      : { kind: 'loaded', label };
  }
  if ('value' in step) return valueFailure(step, collapse(values[0] ?? ''));
  if ('checked' in step) {
    const want = !step.off;
    return seen.checked === want ? null : { kind: 'checked', label, expected: want ? 'on' : 'off' };
  }
  if ('playing' in step) {
    const want = !step.off;
    return seen.playing === want ? null : { kind: 'playing', label, expected: want ? 'on' : 'off' };
  }
  if ('muted' in step) {
    const want = !step.off;
    return seen.muted === want ? null : { kind: 'muted', label, expected: want ? 'on' : 'off' };
  }
  if ('animated' in step) {
    const running = values.filter((v): v is string => typeof v === 'string');
    if (step.off) {
      return running.length === 0
        ? null
        : { kind: 'animated', label, expected: 'off', found: running.join(', ') };
    }
    return running.length > 0 ? null : { kind: 'animated', label, expected: 'on' };
  }
  if ('focused' in step) {
    return seen.focused ? null : { kind: 'focused', label, found: values[0] ?? null };
  }
  if ('shows' in step) {
    const file = values[0] ?? null;
    return file === step.file ? null : { kind: 'shows', label, expected: step.file, found: file };
  }
  if ('visible' in step) {
    return seen.shown?.[0] ? null : { kind: 'visible', label, expected: 'visible' };
  }
  if ('hidden' in step) {
    return (seen.shown ?? []).some(Boolean) ? { kind: 'visible', label, expected: 'hidden' } : null;
  }
  if ('onTop' in step) {
    const cover = values[0] ?? null;
    return cover === '' ? null : { kind: 'onTop', label, found: cover };
  }
  if ('inView' in step) {
    const [box] = boxes;
    const height = seen.windowHeight ?? 0;
    if (step.out) {
      const off = box.y + box.height <= 0.5 || box.y >= height - 0.5;
      return off ? null : { kind: 'inView', label, expected: 'out' };
    }
    const outside = Math.max(0, -box.y) + Math.max(0, box.y + box.height - height);
    if (outside <= 1) return null;
    return { kind: 'inView', label, expected: 'in', found: String(Math.round(outside)) };
  }
  if ('against' in step) return againstFailure(step, seen.pairs ?? []);
  if ('order' in step) {
    const texts = values.map((v) => collapse(v ?? ''));
    // The boxes in the order the mission asks; each must come before the next
    const wrong = boxes.slice(1).some((next, i) => !readsBefore(boxes[i], next));
    if (!wrong && boxes.length === step.order.length) return null;
    const shown = boxes
      .map((box, i) => ({ box, text: texts[i] }))
      .sort((a, b) => (readsBefore(a.box, b.box) ? -1 : readsBefore(b.box, a.box) ? 1 : 0))
      .map((e) => e.text);
    return { kind: 'order', label, expected: texts.join(', '), found: shown.join(', ') };
  }
  if ('wraps' in step) {
    const [parent, ...items] = boxes;
    const detail = wrapsMiss(items, parent);
    return detail ? { kind: 'wraps', label, detail, width } : null;
  }
  if ('fills' in step) {
    const [box, parent] = boxes;
    if (!box || !parent) return { kind: 'missing', label };
    if (box.width >= parent.width - 1) return null;
    return {
      kind: 'fills',
      label,
      expected: String(Math.round(parent.width)),
      found: String(Math.round(box.width)),
      width,
    };
  }
  if ('centered' in step) {
    const [box, parent] = boxes;
    if (!box || !parent) return { kind: 'missing', label };
    if (box.width >= parent.width - 0.5) return { kind: 'centered', label, detail: 'full', width };
    const left = box.x - parent.x;
    const right = parent.x + parent.width - (box.x + box.width);
    if (Math.abs(left - right) <= 1) return null;
    return {
      kind: 'centered',
      label,
      found: `${Math.round(left)} ${Math.round(right)}`,
      width,
    };
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
      actions: WEB_ACTION_KEYS,
      cases: spec.cases.map((c) => ({
        page: c.page ?? 'index.html',
        width: c.width ?? WEB_DEFAULT_WIDTH,
        files: c.files,
        fetch: c.fetch,
        clock: c.clock,
        colorScheme: c.colorScheme,
        reducedMotion: c.reducedMotion,
        storage: c.storage,
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
