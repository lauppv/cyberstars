import ReactMarkdown from 'react-markdown';
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
  pre({ children }) {
    return <pre style={{ margin: 0, padding: 0, background: 'transparent' }}>{children}</pre>;
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match?.[1]?.toLowerCase();
    const isInline = !className;

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
    <div className="prose text-[#b0b8c5] break-words [&_pre]:whitespace-pre-wrap [&_pre]:break-words">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
