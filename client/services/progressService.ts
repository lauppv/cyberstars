import { api } from "./apiClient";
import type { CourseProgress } from "../../shared/progress";

export function getCourseProgress(courseKey: string) {
  return api.get<CourseProgress>(`/api/progress/${courseKey}`);
}

export function markLessonComplete(courseKey: string, lessonSlug: string) {
  return api.post<{ message: string }>(`/api/progress/${courseKey}/${lessonSlug}/complete`);
}

export function getSavedCode(courseKey: string, lessonSlug: string) {
  return api.get<{ code: string | null }>(`/api/progress/${courseKey}/${lessonSlug}/code`);
}

export function saveCode(courseKey: string, lessonSlug: string, code: string) {
  return api.put<{ message: string }>(`/api/progress/${courseKey}/${lessonSlug}/code`, { code });
}

export function trackAccess(courseKey: string, lessonSlug: string) {
  return api.post(`/api/progress/${courseKey}/${lessonSlug}/access`);
}
