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
    <div
      ref={ref}
      className="p-4 bg-[#0d1117] text-[#78a8d0] font-bold font-mono rounded overflow-auto whitespace-pre-wrap border border-[#1e2a38] shadow-inner"
      style={{ height, minHeight: height, maxHeight: height }}
    >
      {output || "Output will appear here..."}
    </div>
  );
}
