import type { ReactNode } from 'react';
import { highlightCode, tagHighlighter, tags as t } from '@lezer/highlight';
import { parser as cpp } from '@lezer/cpp';
import { parser as java } from '@lezer/java';
import { parser as python } from '@lezer/python';

// The parsers the editor reads each course's code with, by the names an answer
// can give a code block
const PARSERS: Record<string, typeof python> = {
  python,
  py: python,
  java,
  c: cpp,
  cpp,
  'c++': cpp,
};

// oneDark's own tag groups, coloured in index.css, so an answer's code reads
// like the editor's
const highlighter = tagHighlighter([
  { tag: t.keyword, class: 'tok-keyword' },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], class: 'tok-name' },
  { tag: [t.function(t.variableName), t.labelName], class: 'tok-function' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], class: 'tok-constant' },
  { tag: [t.definition(t.name), t.separator], class: 'tok-plain' },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    class: 'tok-type',
  },
  {
    tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
    class: 'tok-operator',
  },
  { tag: [t.meta, t.comment], class: 'tok-comment' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], class: 'tok-constant' },
  { tag: [t.processingInstruction, t.string, t.inserted], class: 'tok-string' },
]);

// A code block of an answer in the editor's colours; one in a language the
// editor doesn't know stays plain
export function TutorCode({ lang, code }: { lang: string; code: string }) {
  const parser = PARSERS[lang.toLowerCase()];
  if (!parser) return <code>{code}</code>;
  const parts: ReactNode[] = [];
  highlightCode(
    code,
    parser.parse(code),
    highlighter,
    (text, classes) => {
      parts.push(
        classes ? (
          <span key={parts.length} className={classes}>
            {text}
          </span>
        ) : (
          text
        ),
      );
    },
    () => parts.push('\n'),
  );
  return <code>{parts}</code>;
}
