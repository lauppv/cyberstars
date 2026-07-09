import { api } from './apiClient';
import type { RunTestsResponse } from '../../shared/tests';

export function runTests(
  courseKey: string,
  lessonSlug: string,
  code: string,
  lang: string,
): Promise<RunTestsResponse> {
  return api.post<RunTestsResponse>(`/api/tests/${courseKey}/${lessonSlug}/run`, { code, lang });
}
