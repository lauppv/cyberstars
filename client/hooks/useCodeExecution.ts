import { useState, useCallback } from "react";
import { runCode, submitCode } from "../services/codeExecutionService";
import { ApiClientError } from "../services/apiClient";
import type { SubmitResult } from "../../shared/tests";

function errorMessage(err: unknown): string {
  if (err instanceof ApiClientError) return err.message;
  return "Error connecting to server.";
}

export function useCodeExecution() {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const execute = useCallback(async (code: string, language: string) => {
    setIsRunning(true);
    setOutput("Running...");
    setSubmitResult(null);

    try {
      const result = await runCode(code, language);
      setOutput(result.output || "No output.");
    } catch (err) {
      setOutput(errorMessage(err));
    } finally {
      setIsRunning(false);
    }
  }, []);

  const submit = useCallback(async (code: string, language: string, courseKey: string, lessonSlug: string) => {
    setIsSubmitting(true);
    setOutput("Running tests...");
    setSubmitResult(null);

    try {
      const result = await submitCode(code, language, courseKey, lessonSlug);
      setSubmitResult(result);
      if (result.allPassed) {
        setOutput(`All tests passed! (${result.passed}/${result.total})`);
      } else {
        setOutput(`Tests: ${result.passed}/${result.total} passed`);
      }
    } catch (err) {
      setOutput(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput("");
    setSubmitResult(null);
  }, []);

  return { output, isRunning, isSubmitting, submitResult, execute, submit, clearOutput };
}
