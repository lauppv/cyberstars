import fs from 'fs';
import path from 'path';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';
import { courseDir } from './paths.js';

// A lesson of a multi-language course writes each of its visuals once, in the course's
// visuals/<name>.json (visuals/ro/<name>.json for Romanian), and its text in every language names
// it in a fence of its own:
//
//   ```visual
//   {"use": "<name>"}
//   ```
//
// Generating the content puts the visual itself in that fence, for the lesson's language: an
// object of the form { "python": ..., "java": ..., "c": ... } anywhere in it, such as a step's line
// of code or the word for an empty child, becomes that language's value, and the visual gets its
// name as its id, which keeps the student's step when they switch languages.

const USE = /```visual\n\s*\{\s*"use"\s*:\s*"([\w-]+)"\s*\}\s*\n```/g;

const isPerLanguage = (value: object) => {
  const keys = Object.keys(value);
  return keys.length === CODE_LANGUAGES.length && CODE_LANGUAGES.every((l) => keys.includes(l));
};

function pick(value: unknown, language: string): unknown {
  if (Array.isArray(value)) return value.map((item) => pick(item, language));
  if (typeof value !== 'object' || value === null) return value;
  if (isPerLanguage(value)) return (value as Record<string, unknown>)[language];
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, pick(item, language)]),
  );
}

// `read` gives a visual's JSON by its name, or null when there is no such file. Throws, naming the
// visual, on one that is missing or isn't JSON
export function inlineVisuals(
  markdown: string,
  language: string,
  read: (name: string) => string | null,
): string {
  return markdown.replace(USE, (_, name: string) => {
    const source = read(name);
    if (source === null) throw new Error(`no visual named ${name}`);
    let visual: unknown;
    try {
      visual = JSON.parse(source);
    } catch {
      throw new Error(`the visual ${name} isn't JSON`);
    }
    const filled = { id: name, ...(pick(visual, language) as object) };
    return '```visual\n' + JSON.stringify(filled, null, 2) + '\n```';
  });
}

// A multi-language course's visuals sit beside its language folders, the Romanian ones in ro/
export function visualFiller(courseKey: string, language: string, locale?: string) {
  const dir = path.join(path.dirname(courseDir(courseKey, language)), 'visuals', locale ?? '');
  return (text: string) =>
    inlineVisuals(text, language, (name) => {
      const file = path.join(dir, `${name}.json`);
      return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    });
}
