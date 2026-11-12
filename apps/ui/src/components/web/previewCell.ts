import { createContext } from 'react';

// A preview cell of a web lesson's text: a whole page written in one fenced
// block (```html preview or ```css preview), shown with the page it makes
// under it. The part the lesson is about sits between two marker lines,
// `<!-- show -->` and `<!-- /show -->` in HTML or `/* show */` and
// `/* /show */` in a style sheet. The cell shows only that part until View is
// pressed; the rest of the page is what that part needs to be seen. A block
// without markers shows all of it.

export interface PreviewCell {
  // The page up to the part shown, with its line break, or ''
  before: string;
  // The part shown, without the indent it has in the page
  shown: string;
  // The page after the part shown, from its line break, or ''
  after: string;
  // The indent each line of the part shown has in the page
  indent: string;
  // False when the block has no markers: the cell has nothing to hide
  hasRest: boolean;
}

const OPEN = /^[ \t]*(?:<!--\s*show\s*-->|\/\*\s*show\s*\*\/)[ \t]*$/;
const CLOSE = /^[ \t]*(?:<!--\s*\/show\s*-->|\/\*\s*\/show\s*\*\/)[ \t]*$/;

function commonIndent(lines: string[]): string {
  let indent: string | null = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const own = /^[ \t]*/.exec(line)?.[0] ?? '';
    if (indent === null) indent = own;
    else {
      let i = 0;
      while (i < indent.length && i < own.length && indent[i] === own[i]) i++;
      indent = indent.slice(0, i);
    }
  }
  return indent ?? '';
}

export function parsePreviewCell(source: string): PreviewCell {
  const lines = source.split('\n');
  const open = lines.findIndex((line) => OPEN.test(line));
  const close = open < 0 ? -1 : lines.findIndex((line, i) => i > open && CLOSE.test(line));
  if (open < 0 || close < 0) {
    return { before: '', shown: source, after: '', indent: '', hasRest: false };
  }
  const part = lines.slice(open + 1, close);
  const indent = commonIndent(part);
  const head = lines.slice(0, open);
  const tail = lines.slice(close + 1);
  return {
    before: head.length ? `${head.join('\n')}\n` : '',
    shown: part.map((line) => line.slice(Math.min(indent.length, line.length))).join('\n'),
    after: tail.length ? `\n${tail.join('\n')}` : '',
    indent,
    hasRest: true,
  };
}

// The whole page, with `shown` put back in its place and indent
export function wholePage(cell: Omit<PreviewCell, 'shown' | 'hasRest'>, shown: string): string {
  const part = shown
    .split('\n')
    .map((line) => (line ? cell.indent + line : line))
    .join('\n');
  return cell.before + part + cell.after;
}

// The part shown of an edited whole page, or null when the edit reached
// outside it and the part can no longer be told apart
export function shownPart(
  cell: Omit<PreviewCell, 'shown' | 'hasRest'>,
  page: string,
): string | null {
  const { before, after, indent } = cell;
  if (page.length < before.length + after.length) return null;
  if (!page.startsWith(before) || !page.endsWith(after)) return null;
  return page
    .slice(before.length, page.length - after.length)
    .split('\n')
    .map((line) => (line.startsWith(indent) ? line.slice(indent.length) : line.trimStart()))
    .join('\n');
}

// The course whose lesson the cells are in, for the pictures a cell's page
// names (assets/ of the course); null outside a lesson
export const PreviewCourseContext = createContext<string | null>(null);
