import fs from 'fs';
import path from 'path';
import { describe, it, expect } from 'vitest';
import { CODE_LANGUAGES, isMultiLanguage } from '@cyberstars/shared/constants';
import { lessons } from '@cyberstars/content/curriculum';
import { courseDir } from '@cyberstars/content/paths';
import { visualFiller } from '@cyberstars/content/visuals';
import { parseVisual, type Visual } from './parseVisual';
import { findCell } from './parseBoxes';

// Every visual in the curriculum, read the way a student gets it: the course's visuals put in as
// gen:content puts them, then the player's own parser. A Romanian lesson tells the same story as
// its English one, so the two have the same visuals with the same steps, places and values, and a
// question's right answer at the same place among its choices; only the words differ. Prose
// (captions, questions and their choices, titles, row labels, tags) may use diacritics; names
// from the code (markers, pointer labels, code lines, box and field names, the null word, a stack
// card's text and line) and the values stay ASCII, like the code in a RO lesson.

const PROSE = new Set(['caption', 'ask', 'choices', 'title', 'label', 'tags']);
const NAMES = new Set(['markers', 'pointers', 'code', 'name', 'null', 'text', 'line']);

// What a phone shows without scrolling the words away from the drawing
const INTRO_MAX = 280;
const STEP_MAX = 140;
// What fits a button, so four of them sit on two rows
const CHOICE_MAX = 40;

// packages/content, which every file is named from
const CONTENT = path.dirname(path.dirname(courseDir('python')));
const FENCE = /```visual\n([\s\S]*?)\n```/g;

interface LessonFile {
  file: string;
  text: string;
}

// The lesson in English and, when it has one, in Romanian, with its visuals put in
function lessonFiles(courseKey: string, slug: string, language?: string): LessonFile[] {
  const dir = courseDir(courseKey, language);
  return [undefined, 'ro'].flatMap((locale) => {
    const file = path.join(dir, locale ?? '', `${slug}.md`);
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    const text = language ? visualFiller(courseKey, language, locale)(raw) : raw;
    return [{ file: path.relative(CONTENT, file), text }];
  });
}

const pairs = lessons
  .flatMap(({ courseKey, slug }) =>
    isMultiLanguage(courseKey)
      ? CODE_LANGUAGES.map((language) => lessonFiles(courseKey, slug, language))
      : [lessonFiles(courseKey, slug)],
  )
  .filter((files) => files.some(({ text }) => text.includes('```visual')));

const strings = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : typeof value === 'object' && value !== null
      ? Object.values(value).flatMap(strings)
      : [];

// A box's field is named as the code names it, so an address points at it by place instead; a
// stack step's new lines are written as code, so each goes under the key a card's line has
function byPlace(visual: Visual): Visual {
  if (visual.type === 'stack') {
    return {
      ...visual,
      steps: visual.steps.map((step) => ({
        ...step,
        set:
          step.set &&
          Object.fromEntries(Object.entries(step.set).map(([id, line]) => [id, { line }])),
      })),
    } as Visual;
  }
  if (visual.type !== 'boxes') return visual;
  const place = (record?: Record<string, unknown>) =>
    record &&
    Object.fromEntries(
      Object.entries(record).map(([address, value]) => [
        findCell(visual.boxes, address)!.join('.'),
        value,
      ]),
    );
  return {
    ...visual,
    steps: visual.steps.map((step) => ({
      ...step,
      set: place(step.set),
      point: place(step.point),
    })),
  } as Visual;
}

// The visual with every word blanked, which both languages share, and the words taken out
function split(visual: Visual) {
  const prose: string[] = [];
  const names: string[] = [];
  const values: string[] = [];
  const blank = (value: unknown): unknown =>
    typeof value === 'string'
      ? ''
      : Array.isArray(value)
        ? value.map(blank)
        : typeof value === 'object' && value !== null
          ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blank(v)]))
          : value;
  const strip = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(strip);
    if (typeof value !== 'object' || value === null) {
      if (typeof value === 'string') values.push(value);
      return value;
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (PROSE.has(key)) prose.push(...strings(item));
        else if (NAMES.has(key)) names.push(...strings(item));
        else return [key, strip(item)];
        return [key, blank(item)];
      }),
    );
  };
  return { shape: strip(byPlace(visual)), prose, names, values };
}

const isAscii = (text: string) => /^[\x20-\x7e]*$/.test(text);

function problemsOf({ file, text }: LessonFile): { problems: string[]; visuals: Visual[] } {
  const problems: string[] = [];
  const visuals: Visual[] = [];
  [...text.matchAll(FENCE)].forEach(([, source], i) => {
    const visual = parseVisual(source);
    const which = `${file}, visual ${i + 1}${visual?.id ? ` (${visual.id})` : ''}`;
    if (!visual) {
      problems.push(`${which}: the player can't read it`);
      return;
    }
    visuals.push(visual);
    const { names, values } = split(visual);
    for (const word of [...names, ...values]) {
      if (!isAscii(word)) problems.push(`${which}: "${word}" isn't ASCII`);
    }
    if (visual.caption.length > INTRO_MAX) {
      problems.push(`${which}: its caption is over ${INTRO_MAX} characters`);
    }
    visual.steps.forEach((step, s) => {
      for (const words of [step.title, step.ask, step.caption]) {
        if (words && words.length > STEP_MAX) {
          problems.push(`${which}, step ${s + 1}: "${words}" is over ${STEP_MAX} characters`);
        }
      }
      for (const choice of step.question?.choices ?? []) {
        if (choice.length > CHOICE_MAX) {
          problems.push(`${which}, step ${s + 1}: "${choice}" is over ${CHOICE_MAX} characters`);
        }
      }
    });
  });
  return { problems, visuals };
}

describe('lesson visuals', () => {
  it('finds the visuals in the lessons', () => {
    expect(pairs.length).toBeGreaterThan(0);
  });

  it.each(pairs.map((files) => [files[0].file, files] as const))('%s', (_, files) => {
    const [en, ro] = files.map(problemsOf);
    const problems = [...en.problems, ...(ro?.problems ?? [])];
    if (ro) {
      const roFile = files[1].file;
      if (ro.visuals.length !== en.visuals.length) {
        problems.push(
          `${roFile} has ${ro.visuals.length} visuals, its English lesson ${en.visuals.length}`,
        );
      }
      en.visuals.forEach((visual, i) => {
        const other = ro.visuals[i];
        if (!other) return;
        if (JSON.stringify(split(visual).shape) !== JSON.stringify(split(other).shape)) {
          problems.push(`${roFile}, visual ${i + 1}: not the same steps as in English`);
        }
      });
    }
    expect(problems).toEqual([]);
  });
});
