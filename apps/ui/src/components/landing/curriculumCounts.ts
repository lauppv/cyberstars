import type { Course } from '@cyberstars/shared/lesson';
import {
  ALGO_COURSE_KEYS,
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
  isBeta,
} from '@cyberstars/shared/constants';
import { courseMeta } from '../../constants/courses';

export interface CurriculumCounts {
  languages: string[];
  perCourse: { key: string; label: string; color: string; lessons: number }[];
  courses: number;
  lessons: number;
  challenges: number;
}

// What the landing page can claim, counted from the curriculum the app already
// loads, so the numbers move on their own when a lesson is added. A Beta course
// waits until it is whole.
export function curriculumCounts(all: Course[]): CurriculumCounts {
  const live = (keys: readonly string[]) =>
    keys
      .filter((key) => !isBeta(key))
      .map((key) => all.find((c) => c.key === key))
      .filter((c): c is Course => !!c);
  const courses = live([...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]);
  const lessons = (list: Course[]) => list.reduce((n, c) => n + c.lessons.length, 0);
  return {
    languages: courses.map((c) => courseMeta(c.key).label),
    perCourse: courses.map((c) => ({
      key: c.key,
      label: courseMeta(c.key).label,
      color: courseMeta(c.key).color,
      lessons: c.lessons.length,
    })),
    courses: courses.length,
    lessons: lessons(courses),
    challenges: lessons(live(ALGO_COURSE_KEYS)),
  };
}
