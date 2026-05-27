import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { RunButton } from './RunButton';
import { CodeOutput } from './CodeOutput';
import { useCodeExecution } from '../../hooks/useCodeExecution';

interface CodeCellProps {
  initialCode: string;
  language: string;
}

const LANG_MAP: Record<string, string> = {
  py: 'python',
  python: 'python',
  c: 'c',
  java: 'java',
};

export function CodeCell({ initialCode, language }: CodeCellProps) {
  const lang = LANG_MAP[language.toLowerCase()] || language.toLowerCase();
  const [code, setCode] = useState(initialCode);
  const { output, isRunning, execute, sendInput } = useCodeExecution();

  return (
    <div className="my-4 border border-[#1e2a38] rounded p-3 bg-[#111820]">
      <CodeEditor value={code} onChange={setCode} language={lang} minHeight="60px" />
      <RunButton onClick={() => execute(code, lang)} isRunning={isRunning} className="mt-2" />
      {(output || isRunning) && (
        <div className="mt-2">
          <CodeOutput output={output} height="120px" isRunning={isRunning} onInput={sendInput} />
        </div>
      )}
    </div>
  );
}
