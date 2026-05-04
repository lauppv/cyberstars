import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { indentUnit } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import type { Extension } from "@codemirror/state";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  minHeight?: string;
  fontSize?: string;
}

function getExtensions(language: string): Extension[] {
  const lang = language.toLowerCase();
  // lineWrapping: long lines wrap inside the editor instead of overflowing horizontally
  const base: Extension[] = [indentUnit.of("    "), EditorView.lineWrapping];
  switch (lang) {
    case "python":
    case "py":
      return [...base, python()];
    case "c":
    case "cpp":
      return [...base, cpp()];
    case "java":
      return [...base, java()];
    default:
      return base;
  }
}

export function CodeEditor({
  value,
  onChange,
  language,
  minHeight = "100px",
  fontSize = "16px",
}: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      minHeight={minHeight}
      height="auto"
      theme={oneDark}
      extensions={getExtensions(language)}
      onChange={onChange}
      style={{ fontSize, fontFamily: "var(--mono)" }}
    />
  );
}
