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
    <div className="my-4 border border-[#1e2a38] rounded p-3 bg-[#111820]">
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
        <div className="mt-2 bg-[#0d1117] text-[#78a8d0] font-bold p-2 rounded font-mono whitespace-pre-wrap max-h-40 overflow-auto border border-[#1e2a38]">
          {output}
        </div>
      )}
    </div>
  );
}
