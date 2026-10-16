// What a new student can say they want to learn, on the screen right after
// the tour (CYB-69). The tutor picks its suggestions and its advice by them.
export const INTERESTS = ['python', 'c', 'java', 'linux', 'algorithms'] as const;

export type Interest = (typeof INTERESTS)[number];

// The courses each one stands for
export const INTEREST_COURSES: Record<Interest, readonly string[]> = {
  python: ['python'],
  c: ['c'],
  java: ['java'],
  linux: ['linux'],
  algorithms: ['algo-python', 'algo-java', 'algo-c'],
};
