import { api } from "./apiClient";
import type { SubmitResult } from "../../shared/tests";

export function runCode(code: string, language: string) {
  return api.post<{ output: string }>("/api/run-code", { code, language });
}

export function submitCode(code: string, language: string, courseKey: string, lessonSlug: string) {
  return api.post<SubmitResult>("/api/run-code/submit", { code, language, courseKey, lessonSlug });
}
