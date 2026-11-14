import { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface CodeOutputProps {
  output: string;
  height?: string;
  // Grow with the output from `height` up to this many pixels (no less than
  // `height`), then scroll.
  growTo?: number;
  fillHeight?: boolean;
  isRunning?: boolean;
  onInput?: (data: string) => void;
  // End input (Ctrl+D): given, an End input button shows under a running
  // program and Ctrl+D closes its input; once `inputEnded`, it takes no more
  onEndInput?: () => void;
  inputEnded?: boolean;
}

export function CodeOutput({
  output,
  height = '200px',
  growTo,
  fillHeight,
  isRunning,
  onInput,
  onEndInput,
  inputEnded,
}: CodeOutputProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [output]);

  // What is still typed on the line goes first, as its last line, so nothing
  // the student wrote is lost when the input closes
  const endInput = useCallback(() => {
    const el = inputRef.current;
    const pending = el?.textContent ?? '';
    if (el) el.textContent = '';
    if (pending) onInput?.(pending + '\n');
    onEndInput?.();
  }, [onInput, onEndInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const el = e.currentTarget;
        const val = el.textContent ?? '';
        el.textContent = '';
        onInput?.(val + '\n');
      } else if (onEndInput && e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        endInput();
      }
    },
    [onInput, onEndInput, endInput],
  );

  // Several lines pasted at once go in as a terminal takes them: every whole
  // line is sent, and what follows the last line break stays typed. A paste of
  // one line is left to the browser.
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLSpanElement>) => {
      const text = e.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n');
      if (!text.includes('\n')) return;
      e.preventDefault();
      const el = e.currentTarget;
      const lines = ((el.textContent ?? '') + text).split('\n');
      const rest = lines.pop() ?? '';
      el.textContent = rest;
      onInput?.(lines.join('\n') + '\n');
    },
    [onInput],
  );

  const takesInput = isRunning && onInput && !inputEnded;

  const lastNewline = output.lastIndexOf('\n');
  const beforeLastLine = lastNewline >= 0 ? output.slice(0, lastNewline + 1) : '';
  const lastLine = lastNewline >= 0 ? output.slice(lastNewline + 1) : output;

  return (
    <div
      data-testid="code-output"
      className={`relative rounded-[var(--radius-sm)] panel overflow-hidden${fillHeight ? ' flex-1 min-h-0 flex flex-col' : ''}`}
    >
      {/* No title: the placeholder says what the box is for, and a running
          program shows as the dot alone in its corner */}
      {isRunning && (
        <span
          data-testid="output-running"
          className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse"
        />
      )}
      <div
        ref={containerRef}
        className={`p-4 font-mono text-[13px] overflow-auto whitespace-pre-wrap${fillHeight ? ' flex-1 min-h-0' : ''}`}
        style={
          fillHeight
            ? { fontFamily: 'var(--mono)' }
            : growTo !== undefined
              ? {
                  minHeight: height,
                  maxHeight: `${growTo}px`,
                  fontFamily: 'var(--mono)',
                }
              : { height, minHeight: height, maxHeight: height, fontFamily: 'var(--mono)' }
        }
        onClick={() => isRunning && inputRef.current?.focus()}
      >
        {output || isRunning ? (
          <>
            {beforeLastLine && <span className="text-[var(--output)]">{beforeLastLine}</span>}
            <span className="text-[var(--output)]">{lastLine}</span>
            {takesInput && (
              <span
                ref={inputRef}
                data-testid="stdin-input"
                contentEditable
                suppressContentEditableWarning
                className="inline-block min-w-[1ch] min-h-[1em] outline-none font-mono text-[13px] text-[var(--text)] caret-[var(--accent)] whitespace-pre-wrap break-all"
                style={{ fontFamily: 'var(--mono)' }}
                autoFocus
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
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
          <span className="text-[var(--text3)] italic">{t('code.runToSee')}</span>
        )}
      </div>
      {takesInput && onEndInput && (
        <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-[var(--border)]">
          <span className="text-[12px] text-[var(--text3)]">{t('code.endInputHint')}</span>
          <button
            type="button"
            data-testid="end-input"
            data-track="end-input"
            onClick={endInput}
            title={t('code.endInputTitle')}
            className="btn btn-secondary btn-sm"
          >
            {t('code.endInput')}
          </button>
        </div>
      )}
    </div>
  );
}
