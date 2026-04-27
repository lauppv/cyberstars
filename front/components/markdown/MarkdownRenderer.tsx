import ReactMarkdown from "react-markdown";
import { CodeCell } from "../code/CodeCell";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const EDITABLE_LANGS = ["py", "python", "c", "java"];

const components: Components = {
  strong({ children }) {
    return <strong style={{ color: "#d4789c" }}>{children}</strong>;
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const lang = match?.[1]?.toLowerCase();
    const isInline = !className;

    if (!isInline && lang && EDITABLE_LANGS.includes(lang)) {
      return (
        <CodeCell
          initialCode={String(children).trim()}
          language={lang}
        />
      );
    }

    return (
      <code
        className={className}
        style={{ background: "#1e1730", padding: "4px 6px", borderRadius: "4px" }}
        {...props}
      >
        {children}
      </code>
    );
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose text-[#c8bdd6]">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
