import { useContext, useEffect, useRef, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { RunButton } from './RunButton';
import { CodeOutput } from './CodeOutput';
import { useCodeExecution } from '../../hooks/useCodeExecution';
import { useGuestSignupPrompt } from '../../context/GuestSignupPromptContext';
import { CELL_RUN_EVENT } from '../../constants/tour';
import { RunLessonContext } from './runLesson';
import { useRoomBelow } from '../../hooks/useRoomBelow';

interface CodeCellProps {
  initialCode: string;
  language: string;
}

// The output starts this tall, then grows with what the program prints down to
// a few pixels above the bottom of what can be seen, and scrolls past that.
const OUTPUT_HEIGHT = 120;
// The gap kept below it, plus its 8px margin and borders.
const OUTPUT_GAP = 22;

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
  const { output, isRunning, execute, stop, sendInput } = useCodeExecution(notifyRunComplete);
  const runLesson = useContext(RunLessonContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const wasRunning = useRef(false);
  const outputTop = useRef<HTMLDivElement>(null);
  const room = useRoomBelow(outputTop, OUTPUT_GAP, [output]);

  useEffect(() => {
    if (wasRunning.current && !isRunning) {
      rootRef.current?.dispatchEvent(new Event(CELL_RUN_EVENT, { bubbles: true }));
    }
    wasRunning.current = isRunning;
  }, [isRunning]);

  return (
    <div ref={rootRef} data-code-cell className="my-4 panel rounded p-3">
      <CodeEditor value={code} onChange={setCode} language={lang} minHeight="60px" />
      <RunButton
        onClick={() => execute(code, lang, runLesson ?? undefined)}
        isRunning={isRunning}
        onStop={stop}
        className="mt-2"
      />
      <div ref={outputTop} />
      {(output || isRunning) && (
        <div className="mt-2">
          <CodeOutput
            output={output}
            height={`${OUTPUT_HEIGHT}px`}
            growTo={room === null ? undefined : Math.max(OUTPUT_HEIGHT, room)}
            isRunning={isRunning}
            onInput={sendInput}
          />
        </div>
      )}
    </div>
  );
}
