import { useEffect, useRef, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { RunButton } from './RunButton';
import { CodeOutput } from './CodeOutput';
import { useCodeExecution } from '../../hooks/useCodeExecution';
import { useGuestSignupPrompt } from '../../context/GuestSignupPromptContext';
import { CELL_RUN_EVENT } from '../../constants/tour';

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
  const { notifyRunComplete } = useGuestSignupPrompt();
  const { output, isRunning, execute, sendInput } = useCodeExecution(notifyRunComplete);
  const rootRef = useRef<HTMLDivElement>(null);
  const wasRunning = useRef(false);

  useEffect(() => {
    if (wasRunning.current && !isRunning) {
      rootRef.current?.dispatchEvent(new Event(CELL_RUN_EVENT, { bubbles: true }));
    }
    wasRunning.current = isRunning;
  }, [isRunning]);

  return (
    <div ref={rootRef} data-code-cell className="my-4 panel rounded p-3">
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
