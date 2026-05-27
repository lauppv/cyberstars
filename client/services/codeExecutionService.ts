import { api } from './apiClient';
import type { SubmitResult } from '../../shared/tests';

export function submitCode(code: string, language: string, courseKey: string, lessonSlug: string) {
  return api.post<SubmitResult>('/api/run-code/submit', { code, language, courseKey, lessonSlug });
}
