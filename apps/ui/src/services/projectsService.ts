import { api } from './apiClient';
import type { ProjectCheckDTO, ProjectCompletionDTO } from '@cyberstars/shared/projects';
import type { RunTestsResponse } from '@cyberstars/shared/tests';
import type { TerminalTestResult } from '@cyberstars/shared/terminal';

// Every step the signed-in student ticked, in every project
export function getChecks() {
  return api.get<ProjectCheckDTO[]>('/api/projects/checks');
}

export function setCheck(language: string, slug: string, stepId: string, checked: boolean) {
  return api.put<void>(`/api/projects/${language}/${slug}/steps/${stepId}`, { checked });
}

// The projects the signed-in student finished, each by passing its judge
export function getCompletions() {
  return api.get<ProjectCompletionDTO[]>('/api/projects/completions');
}

// Runs the project's tests on the student's whole program; a pass by a
// signed-in student finishes the project. `runId` names the run, so the page
// can ask whether it's waiting for a sandbox.
export function runTests(language: string, slug: string, code: string, runId?: string) {
  return api.post<RunTestsResponse>(
    `/api/projects/${language}/${slug}/run`,
    { code },
    runId ? { headers: { 'X-Run-Id': runId } } : undefined,
  );
}

// A Linux project's checks, on the terminal session started for it
export function checkTerminal(sessionId: string, project: string) {
  return api.post<TerminalTestResult>('/api/terminal/project-check', { sessionId, project });
}

// A project's steps are a static file, generated into public/projects/ at
// build time like the lessons (see lessonService)
const texts = new Map<string, Promise<string>>();

export function getProjectText(language: string, slug: string): Promise<string> {
  const path = `/projects/${language}/${slug}.md`;
  const hit = texts.get(path);
  if (hit) return hit;
  const pending = fetch(path)
    .then((res) => {
      // Vite's dev server answers a missing file with the app's page
      if (!res.ok || res.headers.get('content-type')?.includes('text/html')) {
        throw new Error(`Failed to load ${path}: ${res.status}`);
      }
      return res.text();
    })
    .catch((err: unknown) => {
      texts.delete(path);
      throw err;
    });
  texts.set(path, pending);
  return pending;
}
