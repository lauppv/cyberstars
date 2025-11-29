import { useState, useRef, useEffect } from "react";
import CodeMirror, { oneDark } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { indentUnit } from "@codemirror/language";


export default function CodeCell({ initialCode, language }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const outputRef = useRef();
  const API_URL = "http://localhost:3000";

  const langMap = { py: "python", c: "c", java: "java" };
  const lang = langMap[language.toLowerCase()] || language.toLowerCase();

  const getLang = () => {
    switch (lang) {
      case "python": return [python()];
      case "c": return [cpp()];
      case "java": return [java()];
      default: return [];
    }
  };

  const runCode = async () => {
    try {
      const res = await fetch(`${API_URL}/api/run-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang })
      });
      const data = await res.json();
      setOutput(data.output || "");
    } catch {
      setOutput("Error running code.");
    }
  };

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  return (
    <div className="my-4 border border-gray-600 rounded p-3 bg-[#1a1836]">
      <CodeMirror
        value={code}
        minHeight="60px"
        height="auto"

        extensions={[...getLang(), indentUnit.of("    ")]}
        onChange={v => setCode(v)}
        theme={oneDark}
        style={{
          fontSize: "20px",  // mărimea textului
          fontWeight: "bold" // text bold
        }}
      />
      <button
        onClick={runCode}
        className="mt-2 px-3 py-1 bg-pink-400 text-white rounded hover:bg-cyan-300 shadow-md shadow-pink-500/30 transition"
      >
        Run Code
      </button>
      <div
        ref={outputRef}
        className="mt-2 bg-black text-white p-2 rounded font-mono whitespace-pre-wrap max-h-40 overflow-auto"
      >
        {output || "Output will appear here..."}
      </div>
    </div>
  );
}
