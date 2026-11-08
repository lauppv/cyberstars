import { api } from './apiClient';
import type { WebLessonStart } from '@cyberstars/shared/lesson';

// What a web lesson starts from (CYB-119): the site so far with the lesson's
// new files, the course's version and the student's own passing one
export function fetchWebLessonStart(courseKey: string, lessonSlug: string, lang: string) {
  return api.get<WebLessonStart>(`/api/lessons/${courseKey}/${lessonSlug}/start?lang=${lang}`);
}
