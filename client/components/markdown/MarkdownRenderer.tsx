import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeCell } from '../code/CodeCell';
import { StringIndexTable } from './StringIndexTable';
import type { Components } from 'react-markdown';
import { MAIN_COURSE_KEYS } from '../../../shared/constants';

interface MarkdownRendererProps {
  content: string;
}

const EDITABLE_LANGS = [...MAIN_COURSE_KEYS, 'py'];

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
      <th className="border border-[var(--accent)]/30 bg-[rgba(108,92,231,0.12)] px-4 py-2 text-left font-semibold">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="border border-[var(--accent)]/20 px-4 py-2">{children}</td>;
  },
  pre({ children }) {
    return <pre style={{ margin: 0, padding: 0, background: 'transparent' }}>{children}</pre>;
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match?.[1]?.toLowerCase();
    // Fenced blocks without a language tag (plain ```) get no className from
    // remark, same as true inline code — the only distinguishing signal is
    // that fenced content is multi-line (a real `inline code` span never is).
    // Without this, untagged multi-line fences render with inline code's box
    // model, which only pads the first/last visual line, making the block
    // look indented.
    const isInline = !className && !String(children).includes('\n');

    if (!isInline && lang === 'strindex') {
      const lines = String(children).replace(/\n$/, '').split('\n');
      const text = lines[0] ?? '';
      const highlight = (lines[1] ?? '')
        .replace(/^\^/, '')
        .split(/[\s,]+/)
        .map((n) => Number(n))
        .filter((n) => Number.isInteger(n));
      return <StringIndexTable text={text} highlight={highlight} />;
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
        className={className}
        style={{
          display: 'block',
          background: '#111820',
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
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
