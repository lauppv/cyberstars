import fs from 'fs';
import path from 'path';
import type { RunLesson } from '@cyberstars/shared/lesson';
import { contentDir } from './paths.js';
import { AppError } from '../middleware/errorHandler.js';

// A challenge may ship a <slug>-harness.md next to its solution: the part of
// the program the student doesn't see (reading the input, building the tree,
// printing the answer), so they write only the function the statement names.
// Its one fenced block holds a `{{code: <name>}}` placeholder where the
// student's code goes, <name> being the function the hidden part calls. The
// judge and the editor's Run wrap the student's code in it, and the reference
// solution and the variants are written the same way, without the hidden part.
//
// The student's code comes first wherever the language allows, so an error
// names the student's own line: Python and Java put the hidden part after it
// (Java's imports share the student's first line), C declares what the
// student uses above it and starts the count again with `#line 1 "main.c"`,
// a file gcc can't open, so it doesn't print a hidden line under the error.
const PLACEHOLDER = /\{\{code: (\w+)\}\}/;
const SLUG = /^[a-z0-9-]+$/;

export interface Harness {
  /** The whole program, the placeholder included. */
  source: string;
  /** The function the hidden part calls, which the student writes. */
  entry: string;
  /** Lines of the hidden part above the student's first line. */
  lineOffset: number;
}

export function readHarness(dir: string, slug: string): Harness | null {
  const file = path.join(dir, `${slug}-harness.md`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, 'utf8').match(/```[\w-]*\n([\s\S]*?)```/)?.[1];
  const place = source?.match(PLACEHOLDER);
  if (!source || !place || place.index === undefined) {
    throw new Error(`${file} has no {{code: <name>}} placeholder`);
  }
  return {
    source,
    entry: place[1],
    lineOffset: source.slice(0, place.index).split('\n').length - 1,
  };
}

export function wrapCode(harness: Harness | null, code: string): string {
  if (!harness) return code;
  return harness.source.replace(PLACEHOLDER, () => code.replace(/\n+$/, ''));
}

export function defines(code: string, name: string): boolean {
  return new RegExp(`\\b${name}\\s*\\(`).test(code);
}

// The harness the student's code goes into: the page language's, unless the
// code is written for the other one's names (started in Romanian, page then
// switched to English), which the function it defines tells. Null when the
// lesson has none, or the course or slug isn't a real one.
export function studentHarness(
  courseKey: string,
  lessonSlug: string,
  lang: string | undefined,
  language: string | undefined,
  code: string,
): Harness | null {
  if (!SLUG.test(lessonSlug)) return null;
  const dir = contentDir(courseKey, language);
  const en = readHarness(dir, lessonSlug);
  const ro = readHarness(path.join(dir, 'ro'), lessonSlug);
  const [first, second] = lang === 'ro' ? [ro ?? en, en] : [en, ro];
  if (first && second && !defines(code, first.entry) && defines(code, second.entry)) {
    return second;
  }
  return first;
}

function isRunLesson(lesson: unknown): lesson is RunLesson {
  if (typeof lesson !== 'object' || lesson === null) return false;
  const { courseKey, lessonSlug, lang } = lesson as Record<string, unknown>;
  return (
    typeof courseKey === 'string' && typeof lessonSlug === 'string' && typeof lang === 'string'
  );
}

// What an editor Run executes: the code, wrapped in the hidden part when the
// Run names a lesson that has one. A lesson that isn't a real one (made up by
// hand, or a language the course isn't in) runs the code as it is, and so does
// one whose hidden part can't be read, which is logged.
export function programForRun(code: string, language: string, lesson: unknown): string {
  if (!isRunLesson(lesson)) return code;
  try {
    const { courseKey, lessonSlug, lang } = lesson;
    return wrapCode(studentHarness(courseKey, lessonSlug, lang, language, code), code);
  } catch (err) {
    if (!(err instanceof AppError)) console.error('[ws/run] hidden part unreadable:', err);
    return code;
  }
}

// A judge message names a line of the program it ran: the student's own line
// is the hidden part's lines further up.
export function studentLines(message: string, harness: Harness | null): string {
  if (!harness?.lineOffset) return message;
  const offset = harness.lineOffset;
  return message.replace(/\bline (\d+)/g, (whole, n: string) =>
    Number(n) > offset ? `line ${Number(n) - offset}` : whole,
  );
}
