import { FIRST_STEPS_LESSONS } from '@cyberstars/shared/laniakea';

// Where a student stands with First steps, the lessons that open Laniakea, from
// the Python course's progress, which lists every lesson in its order: how many
// are done and the first one still to do.
export function firstSteps(lessons: { slug: string; completed: boolean }[]): {
  done: number;
  next: string | null;
} {
  const first = lessons.slice(0, FIRST_STEPS_LESSONS);
  return {
    done: first.filter((l) => l.completed).length,
    next: first.find((l) => !l.completed)?.slug ?? null,
  };
}
