import { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { RunButton } from "./RunButton";
import { useCodeExecution } from "../../hooks/useCodeExecution";

interface CodeCellProps {
  initialCode: string;
  language: string;
}

const LANG_MAP: Record<string, string> = {
  py: "python",
  python: "python",
  c: "c",
  java: "java",
};

export function CodeCell({ initialCode, language }: CodeCellProps) {
  const lang = LANG_MAP[language.toLowerCase()] || language.toLowerCase();
  const [code, setCode] = useState(initialCode);
  const { output, isRunning, execute } = useCodeExecution();

  return (
    <div className="my-4 border border-[#3d3458] rounded p-3 bg-[#1e1730]">
      <CodeEditor
        value={code}
        onChange={setCode}
        language={lang}
        minHeight="60px"
      />
      <RunButton
        onClick={() => execute(code, lang)}
        isRunning={isRunning}
        className="mt-2"
      />
      {output && (
        <div className="mt-2 bg-[#1a1428] text-[#a8c4d4] font-bold p-2 rounded font-mono whitespace-pre-wrap max-h-40 overflow-auto border border-[#3d3458]">
          {output}
        </div>
      )}
    </div>
  );
}
