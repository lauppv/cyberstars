import crypto from 'crypto';
import { QUIZ_OPTIONS } from '@cyberstars/shared/laniakea';
import { QUIZ_ID, type QuizQuestionSpec } from './laniakea-quiz.js';

// Question templates (CYB-92): a question written once with blanks, which makes
// one question per set of values. They sit in the quiz file's `templates`, and
// `npm run make:quiz` runs their programs with Python and writes the questions
// they make to <slug>-quiz-made.json. Every right answer and every wrong option
// comes from running code, never typed by hand.
//
//   { "id": "add", "kind": "prints", "text": "What does this print?",
//     "code": "x = {{a}}\ny = {{b}}\nprint(x + y)",
//     "values": [{ "a": 7, "b": 3 }, { "a": 5, "b": 5 }],
//     "mistakes": [["x + y", "str(x) + str(y)"], ["x + y", "\"x + y\""], ["x + y", "x, y"]] }
//
// `{{name}}` is a blank, filled from each set of values in the text and the code
// (and in the mistakes, lines and values below). The kinds:
//
// - prints: the right option is what `code` prints. Each mistake, [what, instead]
//   with `what` once in the code, is the program a student writes by mistake,
//   and what it prints is a wrong option.
// - which-program: the options are `code` and the mistaken programs, and the
//   question shows what `code` prints.
// - missing-line: one line of `code` is only ___. `answer` fills it and each of
//   `wrong` is a line a student might put there; the question shows what the
//   program prints with the answer in.
// - missing-value: the same with ___ inside a line, filled with a value.
// - wrong-line: `bug`, [what, instead] on one line, breaks `code`. The question
//   shows the broken program and what `code` prints, and the options are the
//   broken line and three other lines of it.
//
// A wrong option that gives the right output (or for prints, one that fails or
// prints nothing) or repeats another option is passed over, so a template may
// list more than three; it needs three that stand for every set of values.
//
// The Romanian file has each template's twin with the same id, kind and number
// of value sets, paired by position: numbers stay, words are translated, and its
// code stays ASCII. The made questions' ids come from the English values, so a
// question keeps its id in both languages while its kind and values stay.

const TEMPLATE_KINDS = [
  'prints',
  'which-program',
  'missing-line',
  'missing-value',
  'wrong-line',
] as const;
type TemplateKind = (typeof TEMPLATE_KINDS)[number];

// [what, instead]: the text a change replaces in the code, and what it puts there.
type Swap = [string, string];

export interface QuizTemplate {
  id: string;
  kind: TemplateKind;
  text: string;
  code: string;
  values: Record<string, string>[];
  // prints and which-program
  mistakes: Swap[];
  // missing-line and missing-value
  answer: string;
  wrong: string[];
  // wrong-line
  bug: Swap | null;
}

// What running one program gave: what it printed, or the error that stopped it.
export type ProgramRun = { ok: true; out: string } | { ok: false; error: string };

// One question a template makes: the programs to run, and the question once
// their runs are in, in the same order. `build` throws, naming the template and
// its values, when the runs don't make a question.
export interface QuestionPlan {
  id: string;
  programs: string[];
  build(runs: ProgramRun[]): QuizQuestionSpec;
}

const GAP = '___';
const WRONG = QUIZ_OPTIONS - 1;
const BLANK = /\{\{(\w+)\}\}/g;
const NOT_ASCII = /[^\x20-\x7e\n]/;

function str(value: unknown, where: string): string {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${where} has no text`);
  return value;
}

function list(value: unknown, where: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${where} is not a list`);
  return value;
}

function count(text: string, part: string): number {
  return text.split(part).length - 1;
}

// A change to the code, [what, instead], whose `what` is there exactly once.
function swapIn(code: string, value: unknown, where: string): Swap {
  const pair = list(value, where);
  if (pair.length !== 2 || typeof pair[1] !== 'string') {
    throw new Error(`${where} is not a pair [what, instead]`);
  }
  const [what, instead] = [str(pair[0], where), pair[1]];
  if (what === instead) throw new Error(`${where} changes nothing`);
  if (count(code, what) !== 1) throw new Error(`${where}: "${what}" is not in the code once`);
  return [what, instead];
}

function valueSets(value: unknown, id: string): Record<string, string>[] {
  const sets = list(value, `${id} values`);
  if (sets.length === 0) throw new Error(`${id} has no values`);
  let names: string | null = null;
  return sets.map((set, i) => {
    if (typeof set !== 'object' || set === null || Array.isArray(set)) {
      throw new Error(`${id} value set ${i + 1} is not an object`);
    }
    const entries = Object.entries(set).map(([name, v]): [string, string] => {
      if (typeof v !== 'string' && typeof v !== 'number') {
        throw new Error(`${id} value ${name} in set ${i + 1} is not text or a number`);
      }
      return [name, String(v)];
    });
    const these = entries
      .map(([name]) => name)
      .sort()
      .join(', ');
    if (names !== null && these !== names) {
      throw new Error(`${id} value set ${i + 1} fills ${these}, the first fills ${names}`);
    }
    names = these;
    return Object.fromEntries(entries);
  });
}

// Reads a quiz file's templates ([] when it has none), or throws saying what is
// wrong with one.
export function parseTemplates(raw: unknown): QuizTemplate[] {
  const given = (raw as { templates?: unknown } | null)?.templates;
  if (given === undefined) return [];
  const ids = new Set<string>();
  return list(given, 'templates').map((value, i): QuizTemplate => {
    const t = (value ?? {}) as Record<string, unknown>;
    if (typeof t.id !== 'string' || !QUIZ_ID.test(t.id)) {
      throw new Error(`template ${i + 1} has a bad id`);
    }
    const id = t.id;
    if (ids.has(id)) throw new Error(`template ${i + 1} repeats the id ${id}`);
    ids.add(id);
    if (!TEMPLATE_KINDS.includes(t.kind as TemplateKind)) {
      throw new Error(`${id} has no kind of ${TEMPLATE_KINDS.join(', ')}`);
    }
    const kind = t.kind as TemplateKind;
    const code = str(t.code, `${id} code`);
    const template: QuizTemplate = {
      id,
      kind,
      text: str(t.text, id),
      code,
      values: valueSets(t.values, id),
      mistakes: [],
      answer: '',
      wrong: [],
      bug: null,
    };
    if (kind === 'prints' || kind === 'which-program') {
      template.mistakes = list(t.mistakes, `${id} mistakes`).map((m, j) =>
        swapIn(code, m, `${id} mistake ${j + 1}`),
      );
      if (template.mistakes.length < WRONG) throw new Error(`${id} needs ${WRONG} mistakes`);
    } else if (kind === 'wrong-line') {
      template.bug = swapIn(code, t.bug, `${id} bug`);
      if (template.bug.some((part) => part.includes('\n'))) {
        throw new Error(`${id} bug changes more than one line`);
      }
    } else {
      if (count(code, GAP) !== 1) throw new Error(`${id} code needs one ${GAP}`);
      const line = code.split('\n').find((l) => l.includes(GAP))!;
      const whole = line.trim() === GAP;
      if (kind === 'missing-line' && !whole) {
        throw new Error(`${id}: the ${GAP} of a missing line is a line of its own`);
      }
      if (kind === 'missing-value' && whole) {
        throw new Error(`${id}: the ${GAP} of a missing value is inside a line`);
      }
      template.answer = str(t.answer, `${id} answer`);
      template.wrong = list(t.wrong, `${id} wrong`).map((w, j) => str(w, `${id} wrong ${j + 1}`));
      if (template.wrong.length < WRONG) throw new Error(`${id} needs ${WRONG} wrong options`);
    }
    return template;
  });
}

function fill(text: string, values: Record<string, string>): string {
  return text.replace(BLANK, (blank, name: string) => values[name] ?? blank);
}

function swapped(code: string, [what, instead]: Swap): string {
  return code.replace(what, () => instead);
}

// What a program prints as an option shows it: trailing spaces and the empty
// lines at the end left out, since they don't show.
function shown(out: string): string {
  return out
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n+$/, '');
}

// The id of the question a set of values makes: the template's, then a hash of
// the kind and the values, so it changes only when they do.
export function madeId(t: QuizTemplate, values: Record<string, string>): string {
  const sorted = Object.keys(values)
    .sort()
    .map((name) => [name, values[name]]);
  const hash = crypto
    .createHash('sha1')
    .update(t.kind + JSON.stringify(sorted))
    .digest('hex');
  return `${t.id}-${hash.slice(0, 6)}`;
}

// The questions a template makes, one per set of values: `ids` are the English
// twin's, which a Romanian template shares.
export function planTemplate(
  t: QuizTemplate,
  lang: 'en' | 'ro',
  ids = t.values.map((values) => madeId(t, values)),
): QuestionPlan[] {
  if (new Set(ids).size !== ids.length) throw new Error(`${t.id} repeats a set of values`);
  return t.values.map((values, k): QuestionPlan => {
    const where = `${t.id} with ${JSON.stringify(values)}`;
    const f = (text: string) => fill(text, values);
    const text = f(t.text);
    if (/\{\{\w+\}\}/.test(text)) throw new Error(`${where}: the text has a blank with no value`);
    const code = f(t.code);

    // What the program the question is about prints: it has to run and print.
    const printed = (run: ProgramRun): string => {
      if (!run.ok) throw new Error(`${where}: the program fails (${run.error})`);
      const out = shown(run.out);
      if (out === '') throw new Error(`${where}: the program prints nothing`);
      return out;
    };
    const gives = (run: ProgramRun, out: string) => run.ok && shown(run.out) === out;
    // The first three wrong options that stand, each null when it doesn't.
    const pick = (right: string, options: (string | null)[]): string[] => {
      const picked: string[] = [];
      for (const option of options) {
        if (picked.length === WRONG) break;
        if (option !== null && option !== right && !picked.includes(option)) picked.push(option);
      }
      if (picked.length < WRONG) {
        throw new Error(
          `${where}: only ${picked.length} of its wrong options stand, each must give another answer and differ from the rest`,
        );
      }
      return picked;
    };
    const question = (
      q: Pick<QuizQuestionSpec, 'code' | 'output'>,
      right: string,
      wrong: string[],
    ): QuizQuestionSpec => ({ id: ids[k], text, ...q, options: [right, ...wrong], answer: 0 });

    let plan: Omit<QuestionPlan, 'id'>;
    if (t.kind === 'prints' || t.kind === 'which-program') {
      const mistaken = t.mistakes.map((m) => f(swapped(t.code, m)));
      plan = {
        programs: [code, ...mistaken],
        build: ([run, ...runs]) => {
          const out = printed(run);
          if (t.kind === 'prints') {
            const wrong = runs.map((r) => (r.ok && shown(r.out) !== '' ? shown(r.out) : null));
            return question({ code, output: null }, out, pick(out, wrong));
          }
          const wrong = mistaken.map((p, i) => (gives(runs[i], out) ? null : p));
          return question({ code: null, output: out }, code, pick(code, wrong));
        },
      };
    } else if (t.kind === 'wrong-line') {
      const broken = f(swapped(t.code, t.bug!));
      const lines = broken.split('\n');
      const at = code.split('\n').findIndex((line, i) => line !== lines[i]);
      plan = {
        programs: [code, broken],
        build: ([run, brokenRun]) => {
          const out = printed(run);
          if (at < 0) throw new Error(`${where}: the bug changes nothing`);
          if (gives(brokenRun, out))
            throw new Error(`${where}: the broken program still prints it`);
          const bad = lines[at].trim();
          const others = lines.map((line, i) => (i === at || !line.trim() ? null : line.trim()));
          return question({ code: broken, output: out }, bad, pick(bad, others));
        },
      };
    } else {
      const answer = f(t.answer);
      const wrong = t.wrong.map(f);
      const filled = (part: string) => code.replace(GAP, () => part);
      plan = {
        programs: [filled(answer), ...wrong.map(filled)],
        build: ([run, ...runs]) => {
          const out = printed(run);
          const options = wrong.map((w, i) => (gives(runs[i], out) ? null : w));
          return question({ code, output: out }, answer, pick(answer, options));
        },
      };
    }
    if (lang === 'ro' && plan.programs.some((p) => NOT_ASCII.test(p))) {
      throw new Error(`${where}: the Romanian code isn't ASCII`);
    }
    return { id: ids[k], ...plan };
  });
}

// What makes the Romanian templates the English ones' twins, or [] when they are.
export function templatePairProblems(en: QuizTemplate[], ro: QuizTemplate[]): string[] {
  const problems: string[] = [];
  if (en.length !== ro.length) {
    problems.push(`${en.length} templates in English, ${ro.length} in Romanian`);
  }
  en.forEach((t, i) => {
    const r = ro[i];
    if (!r) return;
    if (r.id !== t.id)
      problems.push(`template ${i + 1} is ${t.id} in English, ${r.id} in Romanian`);
    else if (r.kind !== t.kind) problems.push(`${t.id} is another kind in Romanian`);
    else if (r.values.length !== t.values.length) {
      problems.push(
        `${t.id} has ${t.values.length} value sets in English, ${r.values.length} in Romanian`,
      );
    }
  });
  return problems;
}

// Every question a lesson's templates make, in both languages: the Romanian
// ones take the ids of their English twins.
export function planLesson(
  en: QuizTemplate[],
  ro: QuizTemplate[],
): { en: QuestionPlan[]; ro: QuestionPlan[] } {
  const problems = templatePairProblems(en, ro);
  if (problems.length > 0) throw new Error(problems.join('; '));
  const enPlans = en.map((t) => planTemplate(t, 'en'));
  return {
    en: enPlans.flat(),
    ro: ro.flatMap((t, i) =>
      planTemplate(
        t,
        'ro',
        enPlans[i].map((p) => p.id),
      ),
    ),
  };
}

// Questions of a pool that read the same (the same text, code and output), by id.
export function sameQuestions(questions: QuizQuestionSpec[]): string[] {
  const seen = new Map<string, string>();
  const problems: string[] = [];
  for (const q of questions) {
    const key = JSON.stringify([q.text, q.code, q.output]);
    const first = seen.get(key);
    if (first) problems.push(`${q.id} reads the same as ${first}`);
    else seen.set(key, q.id);
  }
  return problems;
}
