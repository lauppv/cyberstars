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

interface WebFetchAnswer {
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
  /** Puts the mouse over the element, so the checks after it see its :hover rules. */
  | ({ hover: string } & Labelled)
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
  /**
   * The first element's computed style, as the browser reports it, or that of
   * its ::before or ::after (`pseudo`), whose `content` keeps its quotes: `"★"`.
   * It `equals` a value, is anything `not` this one, `endsWith` a text (a
   * font list's generic family: `sans-serif`), or, for a length (the
   * browser reports it in px), is `atLeast` and/or `atMost` so many px: a
   * mission that asks for room, not for 16px. A corner's radius is read as
   * a length too: a percentage of the box ("50%"), and an elliptical corner
   * as its smaller radius. A `background-color` left transparent under a
   * gradient or a picture reads as that picture. With `every`, that of every
   * element (up to 50), for a mission that says "every link", so a rule that
   * styles only the first one fails.
   */
  | ({
      style: string;
      prop: string;
      equals?: string;
      not?: string;
      endsWith?: string;
      atLeast?: number;
      atMost?: number;
      pseudo?: WebPseudo;
      every?: true;
    } & Labelled)
  /**
   * The element's text reads on the background behind it: the contrast ratio
   * of its color and the background colors under it (WCAG's, from 1 to 21) is
   * at least `atLeast`, 4.5 for text, and with `on`, the background is the
   * `dark` one (light text) or the `light` one. Background images aren't
   * looked at, only the colors. With `every`, every element's (up to 50).
   */
  | ({ contrast: string; atLeast: number; on?: 'dark' | 'light'; every?: true } & Labelled)
  /**
   * Every element of `differs` looks unlike every element of `from` in at least
   * one of `props`: a warning stands out from the other paragraphs by its
   * color, its background or its weight, whichever the student picked. Its
   * `background-color` is the background that shows behind it, its own or
   * an ancestor's (a cell colored on its row), a gradient or a picture too.
   * `fromLabel` names the others ("the other paragraphs").
   */
  | ({ differs: string; from: string; props: readonly string[]; fromLabel: string } & Labelled)
  /**
   * The elements stand in a row (side by side) or a column (one under the
   * other), with at least `gap` px between each one and the next, and with
   * `align: 'start'` lined up at their tops (a row) or their left edges (a
   * column).
   */
  | ({ layout: string; arrange: 'row' | 'column'; gap?: number; align?: 'start' } & Labelled)
  /**
   * The elements, taken together (the box round them all: a menu's links),
   * are narrower than the first one's parent's content and centered across it.
   */
  | ({ centered: string } & Labelled)
  /** The first element is as wide as its parent's content: a table across its column. */
  | ({ fills: string } & Labelled)
  /** Every picture it picks has loaded: its file was found, whatever room its width and height keep. */
  | ({ loaded: string } & Labelled)
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
  /** The page starts with `<!DOCTYPE html>`, so the browser shows it as a modern page. */
  | { doctype: true }
  /** The page's headings: one h1, and none more than a level below the heading before it. */
  | { outline: true }
  /** The page's scripts logged this line (spaces at the ends aside). */
  | { logged: string }
  /** Nothing thrown and nothing logged with console.error so far. */
  | { noErrors: true }
  /** The page shown now is this one (after a link, a form or `open`). */
  | { at: string };

export type WebStep = WebAction | WebCheck;

/**
 * The keys that make a step an action. The validator, the server's judge and
 * the runner (handed it in its payload) all tell an action by this list.
 */
export const WEB_ACTION_KEYS = [
  'click',
  'hover',
  'fill',
  'press',
  'submit',
  'open',
  'wait',
] as const;

export function isWebAction(step: WebStep): step is WebAction {
  return WEB_ACTION_KEYS.some((key) => key in step);
}

export const WEB_PSEUDO_ELEMENTS = ['::before', '::after'] as const;
type WebPseudo = (typeof WEB_PSEUDO_ELEMENTS)[number];

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
  /** A contrast check's: each element's contrast ratio with its background, and whether that background is the darker of the two. */
  ratios?: number[];
  darker?: boolean[];
  /** A differs check's: each element's values of its props, then each other element's. */
  rows?: string[][];
  others?: string[][];
  /** An outline check's: the page's headings in order. */
  headings?: { level: number; text: string }[];
  scrollWidth?: number;
  /** A doctype check's: whether the browser shows the page as a modern one (`document.compatMode`). */
  standards?: boolean;
  logs?: string[];
  errors?: string[];
  page?: string;
}

// ── How a failed check is told ──────────────────────────────────────────────

type WebFailureKind =
  | 'missing'
  | 'text'
  | 'attr'
  | 'style'
  | 'count'
  | 'layout'
  | 'gap'
  | 'align'
  | 'centered'
  | 'fills'
  | 'loaded'
  | 'size'
  | 'contrast'
  | 'differs'
  | 'outline'
  | 'fits'
  | 'doctype'
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
  /**
   * How a style was compared, when not by `equals`: `not`, `atLeast` or
   * `atMost` (a length in px).
   */
  compare?: 'not' | 'endsWith' | 'atLeast' | 'atMost';
  /**
   * What the element was held against: a differs check's others ("the other
   * paragraphs"), or the level of the heading that skips one (`h4`).
   */
  other?: string;
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

// How the browser reports a few colors a beginner knows by name
const COLOR_NAMES: Record<string, string> = {
  'rgba(0, 0, 0, 0)': 'transparent',
  'rgb(0, 0, 0)': 'black',
  'rgb(255, 255, 255)': 'white',
};

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
    case 'style': {
      if (f.compare === 'not') {
        // The browser reports a color as numbers; a few are said by their names
        const said = (v: string | null) => (v !== null && COLOR_NAMES[v]) || v;
        return ro
          ? `Se aștepta ${label} cu ${f.detail} diferit de ${said(expected)}, dar are ${f.detail}: ${said(found)}.`
          : `Expected ${label} with ${f.detail} other than ${said(expected)}, found ${f.detail}: ${said(found)}.`;
      }
      if (f.compare === 'endsWith') {
        return ro
          ? `Se aștepta ${label} cu ${f.detail} terminat în ${expected}, dar are ${f.detail}: ${found}.`
          : `Expected ${label} with ${f.detail} ending in ${expected}, found ${f.detail}: ${found}.`;
      }
      if (f.compare) {
        const least = f.compare === 'atLeast';
        const bound = ro
          ? least
            ? 'de cel puțin'
            : 'de cel mult'
          : least
            ? 'at least'
            : 'at most';
        return ro
          ? `Se aștepta ${label} cu ${f.detail} ${bound} ${expected}px, dar are ${f.detail}: ${found}.`
          : `Expected ${label} with ${f.detail} of ${bound} ${expected}px, found ${f.detail}: ${found}.`;
      }
      return ro
        ? `Se aștepta ${label} cu ${f.detail}: ${expected}, dar are ${f.detail}: ${found}.`
        : `Expected ${label} with ${f.detail}: ${expected}, found ${f.detail}: ${found}.`;
    }
    case 'contrast':
      if (f.detail === 'on') {
        const dark = expected === 'dark';
        return ro
          ? `Se aștepta ca ${label} să aibă text ${dark ? 'deschis pe fundal închis' : 'închis pe fundal deschis'}, dar are invers.`
          : `Expected ${label} ${dark ? 'light on a dark background' : 'dark on a light background'}, found it the other way round.`;
      }
      return ro
        ? `Se aștepta ca ${label} să se citească pe fundalul său, cu un contrast de cel puțin ${expected}:1, dar contrastul e ${found}:1.`
        : `Expected ${label} readable on its background, a contrast of at least ${expected}:1, found ${found}:1.`;
    case 'differs':
      return ro
        ? `Se aștepta ca ${label} să arate altfel decât ${f.other} (prin ${f.detail}), dar nu toate se deosebesc.`
        : `Expected ${label} to look unlike ${f.other} (by ${f.detail}), found one that looks the same.`;
    case 'gap':
      return ro
        ? `Se așteptau ${label} la cel puțin ${expected}px unul de altul la o fereastră de ${w}px, dar între două sunt doar ${found}px.`
        : `Expected ${label} at least ${expected}px apart in a window ${w}px wide, found two only ${found}px apart.`;
    case 'align': {
      const edge = expected === 'row' ? (ro ? 'sus' : 'tops') : ro ? 'stânga' : 'left edges';
      return ro
        ? `Se așteptau ${label} aliniate ${expected === 'row' ? 'sus' : 'la stânga'} la o fereastră de ${w}px, dar sunt la ${found}px unul de altul.`
        : `Expected ${label} lined up at their ${edge} in a window ${w}px wide, found them ${found}px apart.`;
    }
    case 'centered': {
      if (f.detail === 'full') {
        return ro
          ? `Se aștepta ca ${label} să stea la mijloc în părintele său la o fereastră de ${w}px, dar îl ocupă pe tot.`
          : `Expected ${label} centered in its parent in a window ${w}px wide, found it as wide as its parent.`;
      }
      const [left, right] = (found ?? '').split(' ');
      return ro
        ? `Se aștepta ca ${label} să stea la mijloc în părintele său la o fereastră de ${w}px, dar are ${left}px în stânga și ${right}px în dreapta.`
        : `Expected ${label} centered in its parent in a window ${w}px wide, found ${left}px of room on the left and ${right}px on the right.`;
    }
    case 'loaded':
      return ro
        ? `Se aștepta ca ${label} să se vadă, dar fișierul nu e găsit: verifică-i calea.`
        : `Expected ${label} to show, found its file missing: check its path.`;
    case 'fills':
      return ro
        ? `Se aștepta ca ${label} să fie lat cât părintele său (${expected}px) la o fereastră de ${w}px, dar are ${found}px.`
        : `Expected ${label} as wide as its parent (${expected}px) in a window ${w}px wide, found it ${found}px wide.`;
    case 'outline':
      if (f.detail === 'h1') {
        return ro
          ? `Se aștepta ca pagina să aibă un singur titlu principal (h1), dar are ${found}.`
          : `Expected the page to have one biggest heading (h1), found ${found}.`;
      }
      return ro
        ? `Se aștepta ca titlurile să nu sară niciun nivel, dar după un ${expected} vine direct un ${f.other}: ${q(found ?? '')}.`
        : `Expected headings that never skip a level, found an ${f.other} right after an ${expected}: ${q(found ?? '')}.`;
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
    case 'doctype':
      return ro
        ? 'Se aștepta ca pagina să înceapă cu <!DOCTYPE html>, dar nu începe așa.'
        : 'Expected the page to start with <!DOCTYPE html>, found it missing.';
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
