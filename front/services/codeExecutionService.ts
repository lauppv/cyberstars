import { api } from "./apiClient";

export function runCode(code: string, language: string) {
  return api.post<{ output: string }>("/api/run-code", { code, language });
}
