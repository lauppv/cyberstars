// Build-time validator for the lesson judge's <slug>-tests.json corpus. Guards
// the two silent-failure classes that let hardcoding pass without any runtime
// error (so CI stays green while anti-cheat is quietly disabled):
//
//   1. Locale pairing: a RO lesson graded against the EN tests/solution makes
//      injection a no-op (EN identifiers never match the RO solution), so a
//      hardcoded RO answer passes. Every RO solution that belongs to a tested
//      lesson must ship its own ro/<slug>-tests.json (and vice-versa).
//   2. Dead inject keys: an inject key that doesn't resolve to a real variable
//      in the paired solution injects nothing, so the "hidden" cases all run on
//      the same values and a hardcoded output passes. Every inject key (and
//      every structure `requires` name) must appear in the paired solution.
//   3. A web lesson's tests (CYB-110) have the shape the web judge reads, and
//      every page a case opens is in the lesson's site: a step the runner
//      doesn't know would be judged as passed or break the run.
//   4. Hidden parts: a challenge's <slug>-harness.md wraps the student's
//      function, so structure rules and injection would see the hidden code
//      too (a required loop found in the input reading): a lesson with one has
//      neither. Its solution is only the function, so it must define the one
//      the hidden part calls, and a RO solution, in Romanian names, needs a RO
//      hidden part.
//
// C is checked rigorously via the same tree-sitter analysis the judge uses
// (an inject key must be a real init_declarator site); Python/Java use
// identifier presence on the comment/string-stripped solution (their injectors
// run in-container, so we can't reuse them here, but a missing identifier is
// exactly the drift we need to catch). No Docker, no runtime; pure static.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { contentDir } from '../src/services/paths.js';
import { parseC, collectInjectionSites } from '../src/services/c-analysis.js';
import { defines, readHarness, type Harness } from '../src/services/harness.js';
import type { LessonTestsSpec } from '@cyberstars/shared/tests';
import {
  CODE_LANGUAGES,
  MULTI_LANGUAGE_COURSE_KEYS,
  WEB_COURSE_KEYS,
} from '@cyberstars/shared/constants';
import { isValidWebPath, parseWebFiles } from '@cyberstars/shared/webFiles';
import {
  WEB_ACTION_KEYS,
  WEB_MAX_WAIT_MS,
  WEB_MAX_WIDTH,
  WEB_MIN_WIDTH,
  WEB_PSEUDO_ELEMENTS,
  WEB_SIDES,
  type WebTestsSpec,
} from '@cyberstars/shared/webTests';

// A multi-language course is checked once per language, as <course>/<language>.
const CODE_JUDGE_COURSES = [
  'python',
  'java',
  'c',
  'algo-python',
  'algo-java',
  'algo-c',
  ...MULTI_LANGUAGE_COURSE_KEYS.flatMap((key) => CODE_LANGUAGES.map((lang) => `${key}/${lang}`)),
];
const C_COURSES = new Set(['c', 'algo-c']);

type Lang = 'python' | 'java' | 'c';
function langOf(courseKey: string): Lang {
  const [, language] = courseKey.split('/');
  if (language) return language as Lang;
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

// Names a solution must contain for its own structure `requires` to pass;
// a renamed contract variable/function/call would fail every honest solution.
function requireNames(spec: LessonTestsSpec): string[] {
  const names: string[] = [];
  for (const rule of spec.structure?.requires ?? []) {
    if (rule.name && ['variable', 'function', 'call', 'class'].includes(rule.kind)) {
      names.push(rule.name);
    }
  }
  return names;
}

function stripPython(code: string): string {
  return (
    code
      .replace(/'''[\s\S]*?'''|"""[\s\S]*?"""/g, ' ')
      .replace(/#[^\n]*/g, ' ')
      // f-strings keep their text: a call made only inside {...} still counts.
      .replace(/(\b[fF])?('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/g, (_, f, str: string) =>
        f ? ` ${str.slice(1, -1)} ` : ' ',
      )
  );
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
          `inject key "${key}" is not an initializer in the solution; injection no-ops, hardcoding passes`,
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
        `"${name}" (inject key or required structure) is absent from the solution; injection/structure no-ops`,
      );
    }
  }
  return messages;
}

// The structure kinds each judge implements. A runner treats a kind it
// doesn't know as present (a require passes, a forbid fires), so a spec using
// one would silently check nothing.
const COMMON_KINDS = [
  'call',
  'variable',
  'function',
  'loop',
  'recursion',
  'int_literal',
  'comment',
  'if',
  'switch',
  'break',
  'continue',
  'nested_loop',
  'operator',
];
export const STRUCTURE_KINDS: Record<Lang, Set<string>> = {
  python: new Set([
    ...COMMON_KINDS,
    'fstring',
    'string_expr',
    'try',
    'class',
    'object',
    'return',
    'default_param',
    'slice',
  ]),
  c: new Set([
    ...COMMON_KINDS,
    'string_expr',
    'struct',
    'typedef',
    'pointer',
    'deref',
    'sizeof',
    'define',
    'enum',
  ]),
  java: new Set([
    ...COMMON_KINDS,
    'try',
    'class',
    'object',
    'extends',
    'implements',
    'interface',
    'enum',
    'override',
    'overload',
    'modifier',
    'instanceof',
    'cast',
  ]),
};
const LOOP_TYPES: Record<Lang, Set<string>> = {
  python: new Set(['for', 'while', 'comprehension']),
  c: new Set(['for', 'while', 'do_while']),
  java: new Set(['for', 'while', 'do_while']),
};

export function auditKinds(lang: Lang, spec: LessonTestsSpec): string[] {
  const messages: string[] = [];
  const rules = [...(spec.structure?.requires ?? []), ...(spec.structure?.forbids ?? [])];
  for (const rule of rules) {
    if (!STRUCTURE_KINDS[lang].has(rule.kind)) {
      messages.push(`structure kind "${rule.kind}" is not implemented for ${lang}`);
    } else if (rule.kind === 'loop' && rule.type && !LOOP_TYPES[lang].has(rule.type)) {
      messages.push(`loop type "${rule.type}" does not exist in ${lang}`);
    } else if (rule.in && lang !== 'python') {
      messages.push(`a rule scoped with "in" is python-only`);
    } else if (['operator', 'modifier'].includes(rule.kind) && !rule.name) {
      messages.push(`a ${rule.kind} rule needs a name`);
    }
  }
  return messages;
}

// Every case runs two programs, so a lesson's case count is bounded by the
// judge's time budget; Java pays a JVM start per program, so it gets fewer.
export const MAX_CASES: Record<Lang, number> = { python: 50, c: 50, java: 20 };

// Bulk (generated) cases are hidden by definition, and they are meant for
// lessons whose output is deterministic, so not for masked/unordered ones.
// The load test, the one case the runtime comes from, is hidden and runs last,
// so its time is only shown once every other case has passed.
export function auditCases(lang: Lang, spec: LessonTestsSpec): string[] {
  const messages: string[] = [];
  const cases = spec.cases ?? [];
  if (cases.length > MAX_CASES[lang]) {
    messages.push(`${cases.length} cases exceeds the ${lang} limit of ${MAX_CASES[lang]}`);
  }
  const generated = cases.filter((c) => c.generated);
  if (generated.some((c) => c.visible)) {
    messages.push('a generated case is marked visible; generated cases are always hidden');
  }
  if (generated.length > 0 && (spec.comparator === 'masked' || spec.comparator === 'unordered')) {
    messages.push(
      `generated cases on a ${spec.comparator} lesson; its output is not deterministic`,
    );
  }
  const loads = cases.filter((c) => c.load);
  if (loads.length > 1) messages.push(`${loads.length} load tests; a lesson has at most one`);
  if (loads.length > 0 && !cases[cases.length - 1].load) {
    messages.push('the load test is not the last case');
  }
  if (loads.some((c) => c.visible)) messages.push('the load test is marked visible');
  return messages;
}

export function auditHarness(harness: Harness, spec: LessonTestsSpec, solution: string): string[] {
  const messages: string[] = [];
  const { requires = [], forbids = [] } = spec.structure ?? {};
  if (requires.length || forbids.length) {
    messages.push('structure rules on a lesson with a hidden part would see the hidden code too');
  }
  if (injectKeys(spec).size) {
    messages.push('injection on a lesson with a hidden part could land in the hidden code');
  }
  if (!defines(solution, harness.entry)) {
    messages.push(`the solution doesn't define ${harness.entry}, which the hidden part calls`);
  }
  return messages;
}

// The hidden part of a lesson in one locale's folder, checked against that
// folder's solution and the spec it is graded by.
function checkHarness(
  courseKey: string,
  dir: string,
  slug: string,
  locale: 'en' | 'ro',
  spec: LessonTestsSpec,
  problems: Problem[],
): void {
  const tag = locale === 'ro' ? `ro/${slug}` : slug;
  let harness: Harness | null;
  try {
    harness = readHarness(dir, slug);
  } catch (err) {
    problems.push({ courseKey, slug, message: `${tag}: ${(err as Error).message}` });
    return;
  }
  if (!harness) return;
  const code = solutionCode(dir, slug);
  if (code === null) return;
  for (const message of auditHarness(harness, spec, code)) {
    problems.push({ courseKey, slug, message: `${tag}: ${message}` });
  }
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
  for (const message of auditKinds(langOf(courseKey), spec)) {
    problems.push({ courseKey, slug, message: `${tag}: ${message}` });
  }
  for (const message of auditCases(langOf(courseKey), spec)) {
    problems.push({ courseKey, slug, message: `${tag}: ${message}` });
  }
  for (const message of await auditSolution(langOf(courseKey), code, spec)) {
    problems.push({ courseKey, slug, message: `${tag}: ${message}` });
  }
}

// A web lesson's spec: the steps the runner and the server know, each with
// what it needs, and pages the site has (`sitePaths`, the reference's files)
export const MAX_WEB_CASES = 30;

const WEB_CHECKS = [
  'exists',
  'count',
  'text',
  'attr',
  'style',
  'contrast',
  'differs',
  'layout',
  'centered',
  'fills',
  'loaded',
  'size',
  'fits',
  'doctype',
  'outline',
  'logged',
  'alerted',
  'noErrors',
  'at',
  'value',
  'checked',
  'playing',
  'muted',
  'focused',
  'shows',
  'sent',
  'notSent',
  'inView',
  'onTop',
  'against',
  'order',
  'wraps',
  'visible',
  'hidden',
] as const;
// The keys each step may carry beside its own
const WEB_STEP_KEYS: Record<string, string[]> = {
  click: ['label'],
  hover: ['label'],
  fill: ['text', 'label'],
  select: ['option', 'label'],
  press: ['on', 'label'],
  submit: ['label'],
  scroll: [],
  open: [],
  wait: [],
  exists: ['label'],
  count: ['equals', 'atLeast', 'label'],
  text: ['equals', 'contains', 'nonEmpty', 'label'],
  attr: ['name', 'equals', 'ignoreCase', 'label'],
  style: ['prop', 'equals', 'not', 'endsWith', 'atLeast', 'atMost', 'pseudo', 'every', 'label'],
  contrast: ['atLeast', 'on', 'every', 'label'],
  differs: ['from', 'props', 'fromLabel', 'label'],
  layout: ['arrange', 'gap', 'align', 'label'],
  centered: ['label'],
  fills: ['label'],
  loaded: ['label'],
  size: ['minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'label'],
  fits: [],
  doctype: [],
  outline: [],
  logged: ['none'],
  alerted: ['none'],
  noErrors: [],
  at: [],
  value: ['equals', 'contains', 'nonEmpty', 'empty', 'label'],
  checked: ['off', 'label'],
  playing: ['off', 'label'],
  muted: ['off', 'label'],
  focused: ['label'],
  shows: ['file', 'label'],
  sent: [],
  notSent: [],
  inView: ['out', 'label'],
  onTop: ['label'],
  against: ['in', 'side', 'within', 'inLabel', 'label'],
  order: ['label'],
  wraps: ['label'],
  visible: ['label'],
  hidden: ['label'],
};
const NEEDS_LABEL = new Set([
  'click',
  'hover',
  'fill',
  'submit',
  'exists',
  'count',
  'text',
  'attr',
  'style',
  'contrast',
  'differs',
  'layout',
  'centered',
  'fills',
  'loaded',
  'size',
  'select',
  'value',
  'checked',
  'playing',
  'muted',
  'focused',
  'shows',
  'inView',
  'onTop',
  'against',
  'order',
  'wraps',
  'visible',
  'hidden',
]);
const CASE_KEYS = new Set([
  'name',
  'visible',
  'page',
  'width',
  'files',
  'fetch',
  'clock',
  'colorScheme',
  'reducedMotion',
  'storage',
  'steps',
]);
// A clock is a date and a time, to the second, without a zone (the page's UTC)
const CLOCK = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
const isPage = (v: unknown): v is string => isText(v) && isValidWebPath(v) && v.endsWith('.html');

function auditWebStep(step: Record<string, unknown>, sitePaths: Set<string>): string | null {
  const keys = Object.keys(step);
  // fill names its text in `text` too, so it is told by its own key first
  const own = 'fill' in step ? 'fill' : [...WEB_ACTION_KEYS, ...WEB_CHECKS].find((k) => k in step);
  if (!own) return `a step with none of the known keys: ${JSON.stringify(step)}`;
  const extra = keys.filter((k) => k !== own && !WEB_STEP_KEYS[own].includes(k));
  if (extra.length) return `a ${own} step with keys it doesn't take: ${extra.join(', ')}`;
  if (NEEDS_LABEL.has(own) && !isText(step.label)) return `a ${own} step without a label`;
  const value = step[own];
  switch (own) {
    case 'fits':
    case 'doctype':
    case 'outline':
    case 'noErrors':
    case 'notSent':
      return value === true ? null : `${own} must be true`;
    case 'scroll':
      return value === 'end' || (typeof value === 'number' && value !== 0 && Number.isFinite(value))
        ? null
        : 'scroll is a number of px other than 0, or end';
    case 'sent': {
      const fields = value as Record<string, unknown> | null;
      if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
        return 'sent names the fields a form sends, as { name: value }';
      }
      return Object.entries(fields).every(([k, v]) => isText(k) && typeof v === 'string')
        ? null
        : "sent's fields are names with text values";
    }
    case 'order':
      return Array.isArray(value) && value.length >= 2 && value.every(isText)
        ? null
        : 'order names two or more selectors';
    case 'wait':
      return typeof value === 'number' && value > 0 && value <= WEB_MAX_WAIT_MS
        ? null
        : `wait must be a number of ms up to ${WEB_MAX_WAIT_MS}`;
    case 'open':
    case 'at':
      if (!isPage(value)) return `${own} must name an .html page of the site`;
      return sitePaths.has(value) ? null : `${own} names ${value}, which the site doesn't have`;
    case 'logged':
    case 'alerted':
      if (!isText(value)) return `${own} must name a line`;
      return step.none === undefined || step.none === true
        ? null
        : `a ${own} step's none is true or left out`;
    case 'press':
      return isText(value) ? null : 'press must name a key';
    default:
      break;
  }
  if (!isText(value)) return `a ${own} step without a selector`;
  if (own === 'fill' && typeof step.text !== 'string') return 'a fill step without its text';
  if (own === 'shows' && !(isText(step.file) && isValidWebPath(step.file))) {
    return 'a shows step names the file of the site it shows';
  }
  if (own === 'select' && !isText(step.option)) return 'a select step without its option';
  if (own === 'value') {
    const ways = ['equals', 'contains', 'nonEmpty', 'empty'].filter((k) => k in step);
    if (ways.length !== 1)
      return 'a value step needs exactly one of equals, contains, nonEmpty, empty';
    if (
      ('nonEmpty' in step && step.nonEmpty !== true) ||
      ('empty' in step && step.empty !== true)
    ) {
      return "a value step's nonEmpty and empty are true";
    }
  }
  if (
    (own === 'checked' || own === 'playing' || own === 'muted') &&
    step.off !== undefined &&
    step.off !== true
  ) {
    return `a ${own} step's off is true or left out`;
  }
  if (own === 'inView' && step.out !== undefined && step.out !== true) {
    return "an inView step's out is true or left out";
  }
  if (own === 'against') {
    if (!isText(step.in)) return 'an against step needs in, a selector';
    if (!isText(step.inLabel)) return 'an against step needs inLabel';
    if (!(WEB_SIDES as readonly unknown[]).includes(step.side)) {
      return `an against step's side is one of ${WEB_SIDES.join(', ')}`;
    }
    if (step.within !== undefined && !(typeof step.within === 'number' && step.within >= 0)) {
      return "an against step's within is a number of px";
    }
  }
  if (own === 'count' && step.equals === undefined && step.atLeast === undefined) {
    return 'a count step needs equals or atLeast';
  }
  if (own === 'text') {
    const ways = ['equals', 'contains', 'nonEmpty'].filter((k) => k in step);
    if (ways.length !== 1) return 'a text step needs exactly one of equals, contains, nonEmpty';
  }
  if (own === 'attr' && !isText(step.name)) return 'an attr step without the attribute name';
  if (own === 'style') {
    if (!isText(step.prop)) return 'a style step needs prop';
    const bounds = ['atLeast', 'atMost'].filter((k) => k in step);
    const ways =
      ['equals', 'not', 'endsWith'].filter((k) => k in step).length + (bounds.length ? 1 : 0);
    if (ways !== 1) {
      return 'a style step needs exactly one of equals, not, endsWith, or atLeast/atMost';
    }
    if ('equals' in step && typeof step.equals !== 'string') return "a style step's equals is text";
    if ('not' in step && typeof step.not !== 'string') return "a style step's not is text";
    if ('endsWith' in step && !isText(step.endsWith)) return "a style step's endsWith is text";
    if (bounds.some((k) => typeof step[k] !== 'number'))
      return "a style step's bounds are px numbers";
  }
  if (own === 'contrast') {
    const least = step.atLeast;
    if (typeof least !== 'number' || least < 1 || least > 21) {
      return "a contrast step's atLeast is a ratio from 1 to 21";
    }
    if (step.every !== undefined && step.every !== true) {
      return "a contrast step's every is true or left out";
    }
    if (step.on !== undefined && step.on !== 'dark' && step.on !== 'light') {
      return "a contrast step's on is dark or light";
    }
  }
  if (own === 'differs') {
    if (!isText(step.from)) return 'a differs step needs from, a selector';
    if (!isText(step.fromLabel)) return 'a differs step needs fromLabel';
    if (!Array.isArray(step.props) || step.props.length === 0 || !step.props.every(isText)) {
      return 'a differs step needs props, a list of style properties';
    }
  }
  if (
    own === 'style' &&
    step.pseudo !== undefined &&
    !(WEB_PSEUDO_ELEMENTS as readonly unknown[]).includes(step.pseudo)
  ) {
    return `a style step's pseudo is one of ${WEB_PSEUDO_ELEMENTS.join(', ')}`;
  }
  if (own === 'style' && step.every !== undefined && step.every !== true) {
    return "a style step's every is true or left out";
  }
  if (own === 'layout' && step.arrange !== 'row' && step.arrange !== 'column') {
    return 'a layout step arranges in a row or a column';
  }
  if (
    own === 'layout' &&
    step.gap !== undefined &&
    !(typeof step.gap === 'number' && step.gap > 0)
  ) {
    return "a layout step's gap is a number of px above 0";
  }
  if (own === 'layout' && step.align !== undefined && step.align !== 'start') {
    return "a layout step's align is start or left out";
  }
  if (
    own === 'size' &&
    !['minWidth', 'maxWidth', 'minHeight', 'maxHeight'].some((k) => k in step)
  ) {
    return 'a size step needs a bound';
  }
  return null;
}

export function auditWebSpec(spec: WebTestsSpec, sitePaths: Set<string>): string[] {
  const messages: string[] = [];
  const cases = Array.isArray(spec.cases) ? spec.cases : [];
  if (cases.length === 0) messages.push('no cases');
  if (cases.length > MAX_WEB_CASES) {
    messages.push(`${cases.length} cases exceeds the web limit of ${MAX_WEB_CASES}`);
  }
  for (const [i, c] of cases.entries()) {
    const at = `case ${i}`;
    const extra = Object.keys(c).filter((k) => !CASE_KEYS.has(k));
    if (extra.length) messages.push(`${at}: keys a case doesn't take: ${extra.join(', ')}`);
    if (!isText(c.name)) messages.push(`${at}: no name`);
    const files = c.files ?? {};
    const pages = new Set([...sitePaths, ...Object.keys(files)]);
    for (const [file, content] of Object.entries(files)) {
      if (!isValidWebPath(file) || typeof content !== 'string') {
        messages.push(`${at}: ${file} is not a text file a site may hold`);
      }
    }
    const page = c.page ?? 'index.html';
    if (!isPage(page)) messages.push(`${at}: page ${page} is not an .html page`);
    else if (!pages.has(page)) messages.push(`${at}: opens ${page}, which the site doesn't have`);
    if (
      c.width !== undefined &&
      (!Number.isInteger(c.width) || c.width < WEB_MIN_WIDTH || c.width > WEB_MAX_WIDTH)
    ) {
      messages.push(`${at}: width ${c.width} is not between ${WEB_MIN_WIDTH} and ${WEB_MAX_WIDTH}`);
    }
    if (
      c.clock !== undefined &&
      !(isText(c.clock) && CLOCK.test(c.clock) && !isNaN(Date.parse(`${c.clock}Z`)))
    ) {
      messages.push(`${at}: clock ${c.clock} is not a date and time like 2031-05-14T09:30:00`);
    }
    if (c.colorScheme !== undefined && c.colorScheme !== 'light' && c.colorScheme !== 'dark') {
      messages.push(`${at}: colorScheme is light or dark`);
    }
    if (c.reducedMotion !== undefined && c.reducedMotion !== true) {
      messages.push(`${at}: reducedMotion is true or left out`);
    }
    if (
      c.storage !== undefined &&
      (typeof c.storage !== 'object' ||
        c.storage === null ||
        Array.isArray(c.storage) ||
        !Object.entries(c.storage).every(([k, v]) => isText(k) && typeof v === 'string'))
    ) {
      messages.push(`${at}: storage holds names with text values`);
    }
    for (const [url, answer] of Object.entries(c.fetch ?? {})) {
      if (!/^https?:\/\//.test(url) || typeof answer?.body !== 'string') {
        messages.push(`${at}: fetch answer for ${url} needs a whole http(s) address and a body`);
      }
    }
    if (!Array.isArray(c.steps) || c.steps.length === 0) {
      messages.push(`${at}: no steps`);
      continue;
    }
    for (const [j, step] of c.steps.entries()) {
      const problem = auditWebStep(step as Record<string, unknown>, pages);
      if (problem) messages.push(`${at}, step ${j}: ${problem}`);
    }
  }
  return messages;
}

// Every web course's tested lessons: a solution, the spec's shape, and a RO
// solution, which has its own words, graded against a RO spec
function checkWebCourses(problems: Problem[]): void {
  for (const courseKey of WEB_COURSE_KEYS) {
    const baseDir = contentDir(courseKey);
    const roDir = path.join(baseDir, 'ro');
    const roSlugs = new Set(listTestedSlugs(roDir));
    for (const [dir, slugs, where] of [
      [baseDir, listTestedSlugs(baseDir), ''],
      [roDir, [...roSlugs], 'ro/'],
    ] as const) {
      for (const slug of slugs) {
        const solution = path.join(dir, `${slug}-solution.md`);
        if (!fs.existsSync(solution)) {
          problems.push({
            courseKey,
            slug,
            message: `${where}${slug}: tests file has no solution`,
          });
          continue;
        }
        const site = new Set(parseWebFiles(fs.readFileSync(solution, 'utf8')).map((f) => f.path));
        const spec = JSON.parse(
          fs.readFileSync(path.join(dir, `${slug}${TESTS_SUFFIX}`), 'utf8'),
        ) as WebTestsSpec;
        for (const message of auditWebSpec(spec, site)) {
          problems.push({ courseKey, slug, message: `${where}${slug}: ${message}` });
        }
      }
    }
    for (const slug of listTestedSlugs(baseDir)) {
      if (fs.existsSync(path.join(roDir, `${slug}-solution.md`)) && !roSlugs.has(slug)) {
        problems.push({
          courseKey,
          slug,
          message: `${slug}: ro/${slug}-solution.md has no ro/${slug}-tests.json; the RO site would be graded on the English words`,
        });
      }
    }
  }
}

export async function collectProblems(): Promise<Problem[]> {
  const problems: Problem[] = [];

  for (const courseKey of CODE_JUDGE_COURSES) {
    const [key, language] = courseKey.split('/');
    const baseDir = contentDir(key, language);
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
      // a RO tests file. Otherwise the RO run falls back to the EN tests +
      // EN solution, and the EN inject keys never match the RO identifiers, so
      // injection silently no-ops and a hardcoded RO answer passes. Stdin-only
      // lessons (no inject, i.e. the whole algo set) deliberately share the EN tests
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
          message: `${slug}: injection lesson has ro/${slug}-solution.md but no ro/${slug}-tests.json; RO grading falls back to EN, injection no-ops`,
        });
      }
      await checkPaired(courseKey, baseDir, slug, 'en', problems);
      const spec = readSpec(path.join(baseDir, `${slug}${TESTS_SUFFIX}`));
      checkHarness(courseKey, baseDir, slug, 'en', spec, problems);
      if (!fs.existsSync(path.join(baseDir, `${slug}-harness.md`))) continue;
      if (!fs.existsSync(path.join(roDir, `${slug}-solution.md`))) continue;
      if (!fs.existsSync(path.join(roDir, `${slug}-harness.md`))) {
        problems.push({
          courseKey,
          slug,
          message: `ro/${slug}: a RO solution has Romanian names, so it needs ro/${slug}-harness.md`,
        });
        continue;
      }
      const roSpec = roSlugs.has(slug)
        ? readSpec(path.join(roDir, `${slug}${TESTS_SUFFIX}`))
        : spec;
      checkHarness(courseKey, roDir, slug, 'ro', roSpec, problems);
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

  checkWebCourses(problems);
  return problems;
}

/* v8 ignore start -- CLI wiring; the pure checks are unit-tested via collectProblems/auditSolution. */
async function main(): Promise<void> {
  const problems = await collectProblems();
  if (problems.length === 0) {
    const count = CODE_JUDGE_COURSES.length + WEB_COURSE_KEYS.length;
    console.log(
      `validate-tests: OK, all inject keys resolve and locales are paired (${count} courses).`,
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
