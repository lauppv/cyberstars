import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { indentUnit, StreamLanguage } from '@codemirror/language';
import { kotlin } from '@codemirror/legacy-modes/mode/clike';
import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  minHeight?: string;
  fontSize?: string;
}

const transparentBg = EditorView.theme({
  '&': { backgroundColor: 'transparent' },
  '.cm-gutters': { backgroundColor: 'transparent', borderRight: '1px solid rgba(108,92,231,0.15)' },
  '.cm-content': { backgroundColor: 'transparent' },
  '.cm-line': { backgroundColor: 'transparent' },
  '.cm-activeLine': { backgroundColor: 'rgba(108,92,231,0.08)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent' },
});

function getExtensions(language: string): Extension[] {
  const lang = language.toLowerCase();
  const base: Extension[] = [indentUnit.of('    '), EditorView.lineWrapping, transparentBg];
  switch (lang) {
    case 'python':
    case 'py':
    case 'algo-python':
      return [...base, python()];
    case 'c':
    case 'cpp':
    case 'algo-c':
      return [...base, cpp()];
    case 'java':
    case 'algo-java':
      return [...base, java()];
    case 'kotlin':
    case 'algo-kotlin':
      return [...base, StreamLanguage.define(kotlin)];
    default:
      return base;
  }
}

export function CodeEditor({
  value,
  onChange,
  language,
  minHeight = '100px',
  fontSize = '16px',
}: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      minHeight={minHeight}
      height="auto"
      theme={oneDark}
      extensions={getExtensions(language)}
      onChange={onChange}
      style={{ fontSize, fontFamily: 'var(--mono)' }}
    />
  );
}
