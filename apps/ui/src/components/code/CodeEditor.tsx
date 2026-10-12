import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { indentUnit, StreamLanguage } from '@codemirror/language';
import { kotlin } from '@codemirror/legacy-modes/mode/clike';
import { EditorView, keymap } from '@codemirror/view';
import { Prec, type Extension } from '@codemirror/state';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: string;
  minHeight?: string;
  fontSize?: string;
  onRun?: () => void;
  readOnly?: boolean;
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
  onRun,
  readOnly = false,
}: CodeEditorProps) {
  const extensions = getExtensions(language);
  if (onRun) {
    extensions.push(
      Prec.highest(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onRun();
              return true;
            },
          },
        ]),
      ),
    );
  }
  return (
    <CodeMirror
      value={value}
      minHeight={minHeight}
      height="auto"
      theme={oneDark}
      extensions={extensions}
      onChange={onChange}
      style={{ fontSize }}
      readOnly={readOnly}
      editable={!readOnly}
      basicSetup={
        readOnly ? { lineNumbers: true, foldGutter: false, highlightActiveLine: false } : undefined
      }
    />
  );
}
