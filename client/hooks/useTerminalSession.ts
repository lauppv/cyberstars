import { useState, useCallback, useRef, useEffect } from "react";
import {
  createTerminalSession,
  execTerminalCommand,
  submitTerminalLesson,
  destroyTerminalSession,
} from "../services/terminalService";
import type { TerminalSubmitResult } from "../services/terminalService";

export interface TerminalLine {
  type: "input" | "output" | "system";
  text: string;
  prompt?: string;
}

export function useTerminalSession(courseKey: string, lessonSlug: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cwd, setCwd] = useState("/home/student");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [submitResult, setSubmitResult] = useState<TerminalSubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sessionRef = useRef<string | null>(null);

  const init = useCallback(async () => {
    if (!courseKey || !lessonSlug) return;
    setIsReady(false);
    setLines([]);
    setSubmitResult(null);
    try {
      const info = await createTerminalSession(courseKey, lessonSlug);
      setSessionId(info.sessionId);
      sessionRef.current = info.sessionId;
      setCwd(info.cwd);
      if (info.intro) {
        setLines([{ type: "system", text: info.intro }]);
      }
      setIsReady(true);
    } catch (e: unknown) {
      setLines([{ type: "system", text: `Failed to start session: ${e instanceof Error ? e.message : "unknown error"}` }]);
    }
  }, [courseKey, lessonSlug]);

  useEffect(() => {
    if (!courseKey || !lessonSlug) return;
    init();
    return () => {
      if (sessionRef.current) {
        destroyTerminalSession(sessionRef.current).catch(() => {});
        sessionRef.current = null;
      }
    };
  }, [init, courseKey, lessonSlug]);

  const execute = useCallback(async (command: string) => {
    if (!sessionRef.current || isExecuting) return;
    setIsExecuting(true);
    const snap = `student@sandbox:${cwd.replace("/home/student", "~")}$`;
    setLines((prev) => [...prev, { type: "input", text: command, prompt: snap }]);
    try {
      const result = await execTerminalCommand(sessionRef.current, command);
      if (result.output) {
        setLines((prev) => [...prev, { type: "output", text: result.output }]);
      }
      setCwd(result.cwd);
    } catch (e: unknown) {
      setLines((prev) => [...prev, { type: "output", text: e instanceof Error ? e.message : "Error" }]);
    }
    setIsExecuting(false);
  }, [isExecuting]);

  const submit = useCallback(async () => {
    if (!sessionRef.current) return null;
    setIsSubmitting(true);
    try {
      const result = await submitTerminalLesson(sessionRef.current, courseKey, lessonSlug);
      setSubmitResult(result);
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }, [courseKey, lessonSlug]);

  const reset = useCallback(async () => {
    if (sessionRef.current) {
      await destroyTerminalSession(sessionRef.current).catch(() => {});
      sessionRef.current = null;
    }
    setSessionId(null);
    await init();
  }, [init]);

  return {
    sessionId,
    cwd,
    lines,
    isReady,
    isExecuting,
    submitResult,
    isSubmitting,
    execute,
    submit,
    reset,
  };
}
