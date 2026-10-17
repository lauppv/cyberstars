import { api } from './apiClient';
import type { CourseProgress } from '@cyberstars/shared/progress';
import type { CodeLanguage } from '@cyberstars/shared/constants';

export function getCourseProgress(courseKey: string) {
  return api.get<CourseProgress>(`/api/progress/${courseKey}`);
}

// A multi-language course keeps the code of each language apart.
export function getSavedCode(courseKey: string, lessonSlug: string, language?: CodeLanguage) {
  const query = language ? `?language=${language}` : '';
  return api.get<{ code: string | null }>(`/api/progress/${courseKey}/${lessonSlug}/code${query}`);
}

export function saveCode(
  courseKey: string,
  lessonSlug: string,
  code: string,
  language?: CodeLanguage,
) {
  return api.put<{ message: string }>(`/api/progress/${courseKey}/${lessonSlug}/code`, {
    code,
    ...(language && { language }),
  });
}

export function trackAccess(courseKey: string, lessonSlug: string) {
  return api.post(`/api/progress/${courseKey}/${lessonSlug}/access`);
}
