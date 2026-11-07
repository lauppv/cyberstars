import { api } from './apiClient';
import type { ProjectCheckDTO } from '@cyberstars/shared/projects';

// Every step the signed-in student ticked, in every project
export function getChecks() {
  return api.get<ProjectCheckDTO[]>('/api/projects/checks');
}

export function setCheck(language: string, slug: string, stepId: string, checked: boolean) {
  return api.put<void>(`/api/projects/${language}/${slug}/steps/${stepId}`, { checked });
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
