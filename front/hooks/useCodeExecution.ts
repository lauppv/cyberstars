import { useState, useCallback } from "react";
import { runCode } from "../services/codeExecutionService";

export function useCodeExecution() {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const execute = useCallback(async (code: string, language: string) => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const result = await runCode(code, language);
      setOutput(result.output || "No output.");
    } catch {
      setOutput("Error connecting to server.");
    } finally {
      setIsRunning(false);
    }
  }, []);

  const clearOutput = useCallback(() => setOutput(""), []);

  return { output, isRunning, execute, clearOutput };
}
