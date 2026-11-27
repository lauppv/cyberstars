// The placement test a visitor can take on the landing page before signing up
// (CYB-68): 10 questions from the courses they picked.

export const PLACEMENT_QUESTION_COUNT = 10;

// What the score says about a new student. The student never sees it; the
// tutor talks to them and picks its suggestions by it.
export type PlacementLevel = 'beginner' | 'intermediate' | 'advanced';

export function placementLevel(score: number): PlacementLevel {
  if (score <= 3) return 'beginner';
  if (score <= 6) return 'intermediate';
  return 'advanced';
}
