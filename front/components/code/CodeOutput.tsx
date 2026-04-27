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
      className="p-4 bg-[#1a1428] text-[#a8c4d4] font-bold font-mono rounded overflow-auto whitespace-pre-wrap border border-[#3d3458] shadow-inner"
      style={{ height, minHeight: height, maxHeight: height }}
    >
      {output || "Output will appear here..."}
    </div>
  );
}
