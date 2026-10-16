// The placement test a visitor can take on the landing page before signing up
// (CYB-68): 12 questions, three each from Python, C, Java and Linux.

export const PLACEMENT_QUESTION_COUNT = 12;

// What the score says about a new student. The student never sees it; the
// tutor talks to them and picks its suggestions by it.
export type PlacementLevel = 'beginner' | 'intermediate' | 'advanced';

export function placementLevel(score: number): PlacementLevel {
  if (score <= 4) return 'beginner';
  if (score <= 8) return 'intermediate';
  return 'advanced';
}
