import { useRef, useEffect } from "react";

interface CodeOutputProps {
  output: string;
  height?: string;
}

export function CodeOutput({ output, height = "200px" }: CodeOutputProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [output]);

  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--accent)]/30 overflow-hidden bg-[rgba(10,14,20,0.3)] backdrop-blur-[12px]">
      <div className="px-3 py-1.5 text-[11px] uppercase tracking-[1px] text-[var(--text3)] font-semibold border-b border-[var(--accent)]/20 bg-[rgba(22,22,29,0.2)]">
        ⬡ Output
      </div>
      <div
        ref={ref}
        className="p-4 text-[var(--success)] font-mono text-[13px] overflow-auto whitespace-pre-wrap"
        style={{ height, minHeight: height, maxHeight: height, fontFamily: 'var(--mono)' }}
      >
        {output || (
          <span className="text-[var(--text3)] italic">Run your code to see the output...</span>
        )}
      </div>
    </div>
  );
}
