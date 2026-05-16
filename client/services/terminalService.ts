import { api } from "./apiClient.js";
import type { TerminalSessionInfo, TerminalExecResult } from "../../shared/terminal.js";

export interface TerminalTestResult {
  name: string;
  passed: boolean;
}

export interface TerminalSubmitResult {
  passed: number;
  total: number;
  allPassed: boolean;
  results: TerminalTestResult[];
}

export function createTerminalSession(courseKey: string, lessonSlug: string) {
  return api.post<TerminalSessionInfo>("/api/terminal/session", { courseKey, lessonSlug });
}

export function execTerminalCommand(sessionId: string, command: string) {
  return api.post<TerminalExecResult>("/api/terminal/exec", { sessionId, command });
}

export function submitTerminalLesson(sessionId: string, courseKey: string, lessonSlug: string) {
  return api.post<TerminalSubmitResult>("/api/terminal/submit", { sessionId, courseKey, lessonSlug });
}

export function destroyTerminalSession(sessionId: string) {
  return api.delete<{ ok: boolean }>(`/api/terminal/session/${sessionId}`);
}
