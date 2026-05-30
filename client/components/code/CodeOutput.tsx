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
  const inputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [output]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const el = e.currentTarget;
        const val = el.textContent ?? '';
        el.textContent = '';
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
      data-testid="code-output"
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
              <span
                ref={inputRef}
                data-testid="stdin-input"
                contentEditable
                suppressContentEditableWarning
                className="outline-none font-mono text-[13px] text-[var(--text)] caret-[var(--accent)] whitespace-pre-wrap break-all"
                style={{ fontFamily: 'var(--mono)' }}
                autoFocus
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  const range = document.createRange();
                  range.selectNodeContents(e.currentTarget);
                  range.collapse(false);
                  const sel = window.getSelection();
                  sel?.removeAllRanges();
                  sel?.addRange(range);
                }}
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
