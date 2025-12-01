import { useState, useRef, useEffect } from "react";
import CodeMirror, { oneDark } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { indentUnit } from "@codemirror/language";

export default function CodeCell({ initialCode, language }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const outputRef = useRef();

  const isProduction = import.meta.env.MODE === "production";
  const API = import.meta.env.VITE_BACKEND_URL || "";

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
    setRunning(true);
    setOutput("Running Code...");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setOutput("Error connecting to server.");
        setRunning(false);
      }, 5000);

      // ------------------------
      // DEVELOPMENT vs PRODUCTION
      // ------------------------
      let endpoint = API;
      if (isProduction) {
        // Production: backend-ul Railway folosește Piston
        endpoint = API; // de obicei același, dar poate fi un URL diferit dacă ai split dev/prod
      }

      const res = await fetch(`${endpoint}/api/run-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      setOutput(data.output || "Programul nu a produs output.");
    } catch {
      setOutput("Error connecting to server.");
    } finally {
      setRunning(false);
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
        style={{ fontSize: "20px", fontWeight: "bold" }}
      />
      <button
        onClick={runCode}
        className="mt-2 px-3 py-1 bg-pink-500 text-white font-bold rounded hover:bg-cyan-300 shadow-md shadow-pink-500/30 transition"
        disabled={running}
      >
        {running ? "Running..." : "Run Code"}
      </button>
      <div
        ref={outputRef}
        className="mt-2 bg-black text-white font-bold p-2 rounded font-mono whitespace-pre-wrap max-h-40 overflow-auto"
      >
        {output || "Output will appear here..."}
      </div>
    </div>
  );
}
