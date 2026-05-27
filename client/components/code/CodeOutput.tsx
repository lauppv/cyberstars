import { useRef, useEffect, useCallback } from 'react';

interface CodeOutputProps {
  output: string;
  height?: string;
  fillHeight?: boolean;
  isRunning?: boolean;
  onInput?: (data: string) => void;
}

export function CodeOutput({
  output,
  height = '200px',
  fillHeight,
  isRunning,
  onInput,
}: CodeOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [output]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const val = e.currentTarget.value;
        e.currentTarget.value = '';
        onInput?.(val + '\n');
      }
    },
    [onInput],
  );

  const lastNewline = output.lastIndexOf('\n');
  const beforeLastLine = lastNewline >= 0 ? output.slice(0, lastNewline + 1) : '';
  const lastLine = lastNewline >= 0 ? output.slice(lastNewline + 1) : output;

  return (
    <div
      className={`rounded-[var(--radius-sm)] border border-[var(--accent)]/30 overflow-hidden bg-[rgba(10,14,20,0.3)] backdrop-blur-[12px]${fillHeight ? ' flex-1 min-h-0 flex flex-col' : ''}`}
    >
      <div className="px-3 py-1.5 text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-semibold border-b border-[var(--accent)]/20 bg-[rgba(22,22,29,0.2)] flex items-center gap-2">
        <span>★ Output</span>
        {isRunning && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
        )}
      </div>
      <div
        ref={containerRef}
        className={`p-4 font-mono text-[13px] overflow-auto whitespace-pre-wrap${fillHeight ? ' flex-1 min-h-0' : ''}`}
        style={
          fillHeight
            ? { fontFamily: 'var(--mono)' }
            : { height, minHeight: height, maxHeight: height, fontFamily: 'var(--mono)' }
        }
        onClick={() => isRunning && inputRef.current?.focus()}
      >
        {output || isRunning ? (
          <>
            {beforeLastLine && <span className="text-[var(--success)]">{beforeLastLine}</span>}
            <span className="text-[var(--success)]">{lastLine}</span>
            {isRunning && onInput && (
              <input
                ref={inputRef}
                type="text"
                className="bg-transparent text-[var(--text)] outline-none border-none font-mono text-[13px] caret-[var(--accent)] p-0 m-0 align-baseline inline"
                style={{
                  fontFamily: 'var(--mono)',
                  width: `${Math.max(10, 30 - lastLine.length)}ch`,
                }}
                autoFocus
                onKeyDown={handleKeyDown}
              />
            )}
          </>
        ) : (
          <span className="text-[var(--text3)] italic">Run your code to see the output...</span>
        )}
      </div>
    </div>
  );
}
