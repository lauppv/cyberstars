import type { Course } from '@cyberstars/shared/lesson';
import { ALGO_COURSE_KEYS, LISTED_COURSE_KEYS, isBeta } from '@cyberstars/shared/constants';
import { courseMeta } from '../../constants/courses';

export interface CurriculumCounts {
  languages: string[];
  perCourse: { key: string; label: string; color: string; lessons: number; beta: boolean }[];
  courses: number;
  lessons: number;
  challenges: number;
}

// What the landing page can claim, counted from the curriculum the app already
// loads, so the numbers move on their own when a lesson is added. A Beta course
// waits until it is whole to be counted, but is listed course by course, marked.
export function curriculumCounts(all: Course[]): CurriculumCounts {
  const loaded = (keys: readonly string[]) =>
    keys.map((key) => all.find((c) => c.key === key)).filter((c): c is Course => !!c);
  const live = (keys: readonly string[]) => loaded(keys.filter((key) => !isBeta(key)));
  const courses = live(LISTED_COURSE_KEYS);
  const lessons = (list: Course[]) => list.reduce((n, c) => n + c.lessons.length, 0);
  return {
    languages: courses.map((c) => courseMeta(c.key).label),
    perCourse: loaded(LISTED_COURSE_KEYS).map((c) => ({
      key: c.key,
      label: courseMeta(c.key).label,
      color: courseMeta(c.key).color,
      lessons: c.lessons.length,
      beta: isBeta(c.key),
    })),
    courses: courses.length,
    lessons: lessons(courses),
    challenges: lessons(live(ALGO_COURSE_KEYS)),
  };
}
