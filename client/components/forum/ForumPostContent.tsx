import { Fragment, type ReactNode } from 'react';
import { CodeEditor } from '../code/CodeEditor';

/**
 * Renders a forum post: fenced ``` code blocks become read-only, syntax-
 * highlighted editors; everything else stays plain text (pre-wrap) so existing
 * text posts are unaffected.
 */
export function ForumPostContent({ content }: { content: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const m of content.matchAll(/```(\w*)\r?\n([\s\S]*?)```/g)) {
    const index = m.index ?? 0;
    if (index > last) {
      parts.push(<Fragment key={key++}>{content.slice(last, index)}</Fragment>);
    }
    const lang = (m[1] || '').toLowerCase();
    const code = m[2].replace(/\n$/, '');
    parts.push(
      <div
        key={key++}
        className="my-2 border border-[var(--accent)]/20 rounded-[var(--radius-sm)] overflow-hidden bg-[#111820]"
      >
        <CodeEditor value={code} language={lang} fontSize="13px" readOnly />
      </div>,
    );
    last = index + m[0].length;
  }

  if (last < content.length) {
    parts.push(<Fragment key={key++}>{content.slice(last)}</Fragment>);
  }

  return <>{parts}</>;
}
