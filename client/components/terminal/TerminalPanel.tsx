import { useState, useRef, useEffect, useCallback } from 'react';
import type { TerminalLine } from '../../hooks/useTerminalSession';

interface Props {
  lines: TerminalLine[];
  cwd: string;
  isReady: boolean;
  isExecuting: boolean;
  onExecute: (cmd: string) => void;
  onReset: () => void;
  lessonCompleted?: boolean;
  isMarking?: boolean;
  onMarkComplete?: () => void;
}

export function TerminalPanel({
  lines,
  cwd,
  isReady,
  isExecuting,
  onExecute,
  onReset,
  lessonCompleted,
  isMarking,
  onMarkComplete,
}: Props) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (isReady && !isExecuting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isReady, isExecuting, lines]);

  const handleSubmitCmd = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd || isExecuting) return;
      setHistory((h) => [...h, cmd]);
      setHistoryIdx(-1);
      setInput('');
      onExecute(cmd);
    },
    [input, isExecuting, onExecute],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIdx = historyIdx < history.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(newIdx);
        setInput(history[history.length - 1 - newIdx] ?? '');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIdx = historyIdx > 0 ? historyIdx - 1 : -1;
        setHistoryIdx(newIdx);
        setInput(newIdx === -1 ? '' : (history[history.length - 1 - newIdx] ?? ''));
      }
    },
    [history, historyIdx],
  );

  const prompt = `student@sandbox:${cwd.replace('/home/student', '~')}$`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[rgba(30,30,40,0.3)] border-b border-[var(--accent)]/20">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--text2)]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FCC624]" />
          Terminal
        </div>
        <div className="flex items-center gap-2">
          {onMarkComplete && (
            <button
              onClick={onMarkComplete}
              disabled={lessonCompleted || isMarking}
              className={`text-[12px] px-3 py-1 rounded-[var(--radius-sm)] transition cursor-pointer border ${
                lessonCompleted
                  ? 'bg-[var(--success)]/15 border-[var(--success)]/30 text-[var(--success)]'
                  : 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/20'
              } font-semibold disabled:cursor-default`}
            >
              {lessonCompleted ? '✓ Completed' : isMarking ? 'Marking...' : 'Mark Complete'}
            </button>
          )}
          <button
            onClick={onReset}
            className="text-[12px] text-[var(--text3)] hover:text-[var(--text)] px-2 py-1 rounded transition cursor-pointer bg-transparent border-none"
            title="Reset sandbox"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-[1.6] bg-[rgba(13,17,23,0.3)]"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className={lineClass(line.type)}>
            {line.type === 'input' && (
              <span className="text-[#7EE787]">{line.prompt ?? prompt} </span>
            )}
            <span className="whitespace-pre-wrap">{line.text}</span>
          </div>
        ))}

        {isReady && (
          <form onSubmit={handleSubmitCmd} className="flex items-start">
            <span className="text-[#7EE787] shrink-0">{prompt}&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isExecuting}
              className="flex-1 bg-transparent border-none outline-none text-[var(--text)] font-mono text-[13px] caret-[var(--accent)]"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        )}

        {!isReady && <div className="text-[var(--text3)] animate-pulse">Starting sandbox...</div>}
      </div>
    </div>
  );
}

function lineClass(type: TerminalLine['type']): string {
  switch (type) {
    case 'system':
      return 'text-[var(--accent)] mb-2';
    case 'output':
      return 'text-[var(--text)] mb-0.5';
    case 'input':
      return 'text-[var(--text)] mb-0.5';
  }
}
