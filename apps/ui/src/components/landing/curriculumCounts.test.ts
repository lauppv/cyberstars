import { describe, it, expect } from 'vitest';
import type { Course } from '@cyberstars/shared/lesson';
import { courseMeta } from '../../constants/courses';
import { curriculumCounts } from './curriculumCounts';

const course = (key: string, n: number): Course => ({
  key,
  title: key,
  description: '',
  lessons: Array.from({ length: n }, (_, i) => ({
    slug: `l${i}`,
    title: `L${i}`,
    sortOrder: i + 1,
  })),
});

describe('curriculumCounts', () => {
  it('counts the courses, their lessons and the algorithm challenges', () => {
    const counts = curriculumCounts([
      course('python', 60),
      course('c', 47),
      course('java', 49),
      course('linux', 55),
      course('algo-python', 20),
      course('algo-java', 20),
      course('algo-c', 32),
    ]);
    expect(counts).toEqual({
      languages: ['Python', 'Java', 'C', 'Linux'],
      perCourse: [
        {
          key: 'python',
          label: 'Python',
          color: courseMeta('python').color,
          lessons: 60,
          beta: false,
        },
        { key: 'java', label: 'Java', color: courseMeta('java').color, lessons: 49, beta: false },
        { key: 'c', label: 'C', color: courseMeta('c').color, lessons: 47, beta: false },
        {
          key: 'linux',
          label: 'Linux',
          color: courseMeta('linux').color,
          lessons: 55,
          beta: false,
        },
      ],
      courses: 4,
      lessons: 211,
      challenges: 72,
    });
  });

  it('counts a Beta course only once it is whole, but lists it, marked', () => {
    const counts = curriculumCounts([course('python', 60), course('trees-graphs', 12)]);
    expect(counts.courses).toBe(1);
    expect(counts.lessons).toBe(60);
    expect(counts.languages).toEqual(['Python']);
    expect(counts.perCourse.map((c) => [c.key, c.lessons, c.beta])).toEqual([
      ['python', 60, false],
      ['trees-graphs', 12, true],
    ]);
  });

  it('claims nothing before the curriculum has loaded', () => {
    expect(curriculumCounts([])).toEqual({
      languages: [],
      perCourse: [],
      courses: 0,
      lessons: 0,
      challenges: 0,
    });
  });
});
