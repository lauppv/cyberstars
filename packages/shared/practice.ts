// The practice API of the Web Development course (CYB-115): a few station
// records a student's page loads with fetch, at an address open to any page.
// Lessons name it by its full address on the live site; the preview sends a
// request to it to the API of the site it runs on, so it works in development
// too, and the grader answers the same address with a case's fixed answers.

const PRACTICE_API_ORIGIN = 'https://cyberstars.app';
export const PRACTICE_API_PATH = '/api/practice';
export const PRACTICE_API_URL = `${PRACTICE_API_ORIGIN}${PRACTICE_API_PATH}`;

/** The classes a starship can be reported in. */
export const PRACTICE_CLASSES = ['Cargo', 'Shuttle', 'Explorer'] as const;

/** The most seconds `?wait=` holds an answer, to see a page while it loads. */
export const PRACTICE_MAX_WAIT_S = 3;

/** The longest name a reported starship may have. */
export const PRACTICE_NAME_MAX = 60;

export interface PracticeStarship {
  id: number;
  name: string;
  class: (typeof PRACTICE_CLASSES)[number];
  status: string;
  crew: number;
}

export interface PracticeCrewMember {
  id: number;
  name: string;
  role: string;
}
