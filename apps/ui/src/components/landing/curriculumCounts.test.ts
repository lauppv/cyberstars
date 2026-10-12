import { describe, it, expect } from 'vitest';
import type { Course } from '@cyberstars/shared/lesson';
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
      courses: 4,
      lessons: 211,
      challenges: 72,
    });
  });

  it('leaves out a course that is still coming soon', () => {
    const counts = curriculumCounts([course('python', 3), course('kotlin', 1)]);
    expect(counts.languages).toEqual(['Python']);
    expect(counts.courses).toBe(1);
    expect(counts.lessons).toBe(3);
  });

  it('claims nothing before the curriculum has loaded', () => {
    expect(curriculumCounts([])).toEqual({ languages: [], courses: 0, lessons: 0, challenges: 0 });
  });
});
