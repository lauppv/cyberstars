import { api } from './apiClient.js';
import type { TerminalSessionInfo, TerminalExecResult } from '../../shared/terminal.js';

export function createTerminalSession(courseKey: string, lessonSlug: string, lang?: string) {
  return api.post<TerminalSessionInfo>('/api/terminal/session', { courseKey, lessonSlug, lang });
}

export function execTerminalCommand(sessionId: string, command: string) {
  return api.post<TerminalExecResult>('/api/terminal/exec', { sessionId, command });
}

export function destroyTerminalSession(sessionId: string) {
  return api.delete<{ ok: boolean }>(`/api/terminal/session/${sessionId}`);
}
