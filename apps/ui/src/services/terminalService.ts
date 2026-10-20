import { api } from './apiClient.js';
import type {
  TerminalSessionInfo,
  TerminalExecResult,
  TerminalTestResult,
} from '@cyberstars/shared/terminal';

export function createTerminalSession(courseKey: string, lessonSlug: string, lang?: string) {
  return api.post<TerminalSessionInfo>('/api/terminal/session', { courseKey, lessonSlug, lang });
}

// `runId` names the command, so the page can ask whether it's waiting for a sandbox
export function execTerminalCommand(sessionId: string, command: string, runId?: string) {
  return api.post<TerminalExecResult>(
    '/api/terminal/exec',
    { sessionId, command },
    runId ? { headers: { 'X-Run-Id': runId } } : undefined,
  );
}

export function destroyTerminalSession(sessionId: string) {
  return api.delete<{ ok: boolean }>(`/api/terminal/session/${sessionId}`);
}

export function checkTerminalTests(
  sessionId: string,
  courseKey: string,
  lessonSlug: string,
  lang: string,
) {
  return api.post<TerminalTestResult>('/api/terminal/check', {
    sessionId,
    courseKey,
    lessonSlug,
    lang,
  });
}
