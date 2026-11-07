// A web lesson's tests (CYB-110): what <slug>-tests.json holds for a course in
// WEB_COURSE_KEYS, and how a failed check is told to the student. The judge
// loads the student's whole site in a headless Chromium; a trusted runner in
// the sandbox walks each case's steps and reports what the page had, and the
// server decides here whether that is what the mission asks. So the expected
// values never enter the sandbox, as in the other languages.

export interface WebTestsSpec {
  cases: WebTestCase[];
}

export interface WebTestCase {
  /** What the case looks at, in a few words, shown on the result. */
  name: string;
  /** A failed visible case says what was expected; a hidden one only what the page had. */
  visible?: boolean;
  /** The page of the site it opens, index.html by default. */
  page?: string;
  /** The window's width in px, WEB_DEFAULT_WIDTH by default (a phone is about 375). */
  width?: number;
  /**
   * Files of the site replaced, or added, for this case only: other data in a
   * hidden case, so a page that writes the answer in by hand fails it.
   */
  files?: Record<string, string>;
  /** Fixed answers to `fetch` of an address outside the site, by the whole address. */
  fetch?: Record<string, WebFetchAnswer>;
  steps: WebStep[];
}

export interface WebFetchAnswer {
  /** 200 by default */
  status?: number;
  body: string;
  /** application/json by default */
  type?: string;
}

// What a check or an action looks at is named by a CSS selector; `label`
// says it in words for the result ("the biggest heading", "the crew cards").
interface Labelled {
  label: string;
}

/** Something the student would do on the page, then the steps after it look again. */
export type WebAction =
  | ({ click: string } & Labelled)
  | ({ fill: string; text: string } & Labelled)
  | ({ press: string; on?: string } & Partial<Labelled>)
  | ({ submit: string } & Labelled)
  /** Opens another page of the site, as typing its address would. */
  | { open: string }
  /**
   * Waits this many ms (at most WEB_MAX_WAIT_MS), for a page that changes on
   * a timer. Loads, fetches and what they lead to are waited for after every
   * action anyway.
   */
  | { wait: number };

export type WebCheck =
  /** At least one element matches. */
  | ({ exists: string } & Labelled)
  /** How many match; `label` is plural ("crew cards"). */
  | ({ count: string; equals?: number; atLeast?: number } & Labelled)
  /** One of the elements shows this text (spaces collapsed), contains it, or any text. */
  | ({ text: string; equals?: string; contains?: string; nonEmpty?: true } & Labelled)
  /** The first element's attribute: `equals` its value, or only present without it. */
  | ({ attr: string; name: string; equals?: string; ignoreCase?: true } & Labelled)
  /** The first element's computed style, as the browser reports it. */
  | ({ style: string; prop: string; equals: string } & Labelled)
  /** The elements stand in a row (side by side) or a column (one under the other). */
  | ({ layout: string; arrange: 'row' | 'column' } & Labelled)
  /** The first element's size in px. */
  | ({
      size: string;
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
    } & Labelled)
  /** The page fits the window's width, with nothing to scroll sideways. */
  | { fits: true }
  /** The page's scripts logged this line (spaces at the ends aside). */
  | { logged: string }
  /** Nothing thrown and nothing logged with console.error so far. */
  | { noErrors: true }
  /** The page shown now is this one (after a link, a form or `open`). */
  | { at: string };

export type WebStep = WebAction | WebCheck;

export const WEB_DEFAULT_WIDTH = 1280;
export const WEB_HEIGHT = 800;
export const WEB_MIN_WIDTH = 320;
export const WEB_MAX_WIDTH = 1920;
export const WEB_MAX_WAIT_MS = 3000;

// ── What the runner reports for a step ──────────────────────────────────────

export interface WebBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * What the page had at a step: for an action whether it found its element
 * (`ok`), for a check the facts it reads. The server judges them.
 */
export interface WebObservation {
  ok?: boolean;
  count?: number;
  /** Texts, attribute or style values of the elements (an attribute missing is null). */
  values?: (string | null)[];
  boxes?: WebBox[];
  scrollWidth?: number;
  logs?: string[];
  errors?: string[];
  page?: string;
}

// ── How a failed check is told ──────────────────────────────────────────────

export type WebFailureKind =
  | 'missing'
  | 'text'
  | 'attr'
  | 'style'
  | 'count'
  | 'layout'
  | 'size'
  | 'fits'
  | 'logged'
  | 'errors'
  | 'at'
  | 'memory';

export interface WebFailure {
  kind: WebFailureKind;
  label?: string;
  /** A hidden case's: it carries no `expected` and says only what the page had. */
  hidden?: true;
  expected?: string;
  found?: string | null;
  /**
   * What the check compared: the attribute, the style property, how the text
   * is matched (equals, contains, nonEmpty), the bound (minWidth...) or, for a
   * count, equals or atLeast.
   */
  detail?: string;
  /** The window's width, for a layout, a size or fitting the page. */
  width?: number;
  /**
   * The language of the spec it came from, whose labels it carries: 'ro' for
   * a Romanian one, else English. What it says is in that language, so a
   * lesson not translated yet doesn't mix the two.
   */
  lang?: 'ro';
}

type Lang = 'en' | 'ro';

const QUOTE: Record<Lang, (s: string) => string> = {
  en: (s) => `“${s}”`,
  ro: (s) => `„${s}”`,
};

// A text from the page, short enough for one line
function shorten(text: string): string {
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

const ARRANGED: Record<Lang, Record<string, string>> = {
  en: {
    row: 'side by side',
    column: 'one under the other',
    mixed: 'neither side by side nor one under the other',
  },
  ro: {
    row: 'unul lângă altul',
    column: 'unul sub altul',
    mixed: 'nici unul lângă altul, nici unul sub altul',
  },
};

const BOUND: Record<Lang, Record<string, string>> = {
  en: {
    minWidth: 'at least {n}px wide',
    maxWidth: 'at most {n}px wide',
    minHeight: 'at least {n}px tall',
    maxHeight: 'at most {n}px tall',
  },
  ro: {
    minWidth: 'lat de cel puțin {n}px',
    maxWidth: 'lat de cel mult {n}px',
    minHeight: 'înalt de cel puțin {n}px',
    maxHeight: 'înalt de cel mult {n}px',
  },
};

/** The failure in the student's words, as the result and the tutor show it. */
export function webFailureText(f: WebFailure, lang: Lang = f.lang ?? 'en'): string {
  const q = QUOTE[lang];
  const ro = lang === 'ro';
  const label = f.label ?? '';
  const found = f.found == null ? null : shorten(f.found);
  const w = f.width;
  // A hidden case knows only what the page had
  if (f.hidden && f.kind !== 'memory' && f.kind !== 'missing') {
    const what = label ? label[0].toUpperCase() + label.slice(1) : ro ? 'Pagina' : 'The page';
    const had =
      found === null || found === ''
        ? ''
        : ro
          ? ` Pagina are ${q(found)}.`
          : ` The page has ${q(found)}.`;
    return ro
      ? `${what}: nu e cum cere misiunea.${had}`
      : `${what}: not what the mission asks.${had}`;
  }
  const expected = f.expected ?? '';
  switch (f.kind) {
    case 'missing':
      return ro ? `Se aștepta ${label}, dar pagina nu are.` : `Expected ${label}, found none.`;
    case 'text':
      if (f.detail === 'nonEmpty') {
        return ro
          ? `Se aștepta ${label} cu un text, dar e gol.`
          : `Expected ${label} with some text, found it empty.`;
      }
      if (f.detail === 'contains') {
        return ro
          ? `Se aștepta ${label} care să conțină ${q(expected)}, dar are ${q(found ?? '')}.`
          : `Expected ${label} with ${q(expected)} in its text, found ${q(found ?? '')}.`;
      }
      return ro
        ? `Se aștepta ${label} cu textul ${q(expected)}, dar are ${q(found ?? '')}.`
        : `Expected ${label} with the text ${q(expected)}, found ${q(found ?? '')}.`;
    case 'attr': {
      const name = f.detail ?? '';
      const want = expected === '' ? name : `${name}="${expected}"`;
      const had = found === null ? (ro ? `fără ${name}` : `no ${name}`) : `${name}="${found}"`;
      return ro
        ? `Se aștepta ${label} cu ${want}, dar are ${had}.`
        : `Expected ${label} with ${want}, found ${had}.`;
    }
    case 'style':
      return ro
        ? `Se aștepta ${label} cu ${f.detail}: ${expected}, dar are ${f.detail}: ${found}.`
        : `Expected ${label} with ${f.detail}: ${expected}, found ${f.detail}: ${found}.`;
    case 'count': {
      // `label` names the elements in the plural: "crew cards: 3"
      const want =
        f.detail === 'atLeast' ? (ro ? `cel puțin ${expected}` : `at least ${expected}`) : expected;
      return ro
        ? `Se aștepta ${label}: ${want}, dar pagina are ${found}.`
        : `Expected ${label}: ${want}, found ${found}.`;
    }
    case 'layout': {
      const want = ARRANGED[lang][expected] ?? expected;
      const had =
        found === 'one'
          ? ro
            ? 'pagina are doar unul'
            : 'found only one'
          : ro
            ? `dar sunt ${ARRANGED[lang][found ?? ''] ?? found}`
            : `found them ${ARRANGED[lang][found ?? ''] ?? found}`;
      return ro
        ? `Se așteptau ${label} ${want} la o fereastră de ${w}px, ${had}.`
        : `Expected ${label} ${want} in a window ${w}px wide, ${had}.`;
    }
    case 'size': {
      const want = (BOUND[lang][f.detail ?? ''] ?? '').replace('{n}', expected);
      const axis = f.detail?.endsWith('Height') ? (ro ? 'înalt' : 'tall') : ro ? 'lat' : 'wide';
      return ro
        ? `Se aștepta ${label} ${want} la o fereastră de ${w}px, dar e ${axis} de ${found}px.`
        : `Expected ${label} ${want} in a window ${w}px wide, found it ${found}px ${axis}.`;
    }
    case 'fits':
      return ro
        ? `Se aștepta ca pagina să încapă în ${w}px fără derulare în lateral, dar e lată de ${found}px.`
        : `Expected the page to fit ${w}px without scrolling sideways, found it ${found}px wide.`;
    case 'logged':
      return ro
        ? `Se aștepta în consolă ${q(expected)}, dar ${found ? `are ${q(found)}` : 'consola e goală'}.`
        : `Expected the console to show ${q(expected)}, found ${found ? q(found) : 'nothing'}.`;
    case 'errors':
      return ro
        ? `Se aștepta ca pagina să meargă fără erori, dar are: ${found}`
        : `Expected the page to run without errors, found: ${found}`;
    case 'at':
      return ro
        ? `Se aștepta să ajungi pe ${expected}, dar pagina e ${found}.`
        : `Expected to end up on ${expected}, found ${found}.`;
    case 'memory':
      return ro
        ? 'Pagina a folosit prea multă memorie și a fost oprită.'
        : 'The page used too much memory and was stopped.';
  }
}
