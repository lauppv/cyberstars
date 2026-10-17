import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { CodeCell } from '../code/CodeCell';
import { StringIndexTable } from './StringIndexTable';
import { remarkGreen } from './remarkGreen';
import type { Components } from 'react-markdown';
import { CODE_LANGUAGES } from '@cyberstars/shared/constants';

interface MarkdownRendererProps {
  content: string;
}

const EDITABLE_LANGS = [...CODE_LANGUAGES, 'py'];

const components: Components = {
  strong({ children }) {
    return <strong style={{ color: '#5aa0e0' }}>{children}</strong>;
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto my-4">
        <table className="w-auto border-collapse text-sm">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="border border-[var(--border)] bg-[rgba(108,92,231,0.12)] px-4 py-2 text-left font-semibold">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="border border-[var(--border)] px-4 py-2">{children}</td>;
  },
  pre({ children }) {
    return <pre style={{ margin: 0, padding: 0, background: 'transparent' }}>{children}</pre>;
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match?.[1]?.toLowerCase();
    // Fenced blocks without a language tag (plain ```) get no className from
    // remark, same as true inline code. The only distinguishing signal is
    // that fenced content is multi-line (a real `inline code` span never is).
    // Without this, untagged multi-line fences render with inline code's box
    // model, which only pads the first/last visual line, making the block
    // look indented.
    const isInline = !className && !String(children).includes('\n');

    if (!isInline && lang === 'strindex') {
      const lines = String(children).replace(/\n$/, '').split('\n');
      const text = lines[0] ?? '';
      // A position lights purple, or green with :green ("^ 0 1:green"). Anything else, the
      // empty piece a space after the caret leaves included, lights nothing
      const highlight: number[] = [];
      const green: number[] = [];
      for (const piece of (lines[1] ?? '').replace(/^\^/, '').split(/[\s,]+/)) {
        const match = /^(\d+)(:green)?$/.exec(piece);
        if (match) (match[2] ? green : highlight).push(Number(match[1]));
      }
      return <StringIndexTable text={text} highlight={highlight} green={green} />;
    }

    if (!isInline && lang && EDITABLE_LANGS.includes(lang)) {
      const code = String(children).trim();
      return <CodeCell key={code} initialCode={code} language={lang} />;
    }

    if (isInline) {
      return (
        <code
          className={className}
          style={{ background: '#111820', padding: '4px 6px', borderRadius: '4px' }}
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className={`${className ?? ''} panel`.trim()}
        style={{
          display: 'block',
          padding: '12px 16px',
          borderRadius: '6px',
        }}
        {...props}
      >
        {String(children).replace(/^\n/, '')}
      </code>
    );
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose text-[#d0d4de] break-words [&_pre]:whitespace-pre-wrap [&_pre]:break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkGreen]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
