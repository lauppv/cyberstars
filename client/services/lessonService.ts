import { api } from "./apiClient";
import type { LessonContent, Course } from "../../shared/lesson";

export function fetchLesson(courseKey: string, lessonSlug: string) {
  return api.get<LessonContent>(`/api/lessons/${courseKey}/${lessonSlug}`);
}

export function fetchLessonCode(courseKey: string, lessonSlug: string) {
  return api.get<string>(`/api/lesson-code/${courseKey}/${lessonSlug}-code.md`);
}

export function fetchCurriculum() {
  return api.get<Course[]>("/api/curriculum");
}
