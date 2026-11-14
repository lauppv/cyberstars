import {
  PRACTICE_CLASSES,
  PRACTICE_NAME_MAX,
  type PracticeCrewMember,
  type PracticeStarship,
} from '@cyberstars/shared/practice';

// The practice API's records (CYB-115). They never change: a POST answers
// like a real API would, with the record and a new id, but keeps nothing, so
// no student ever sees what another one wrote.

export const STARSHIPS: readonly PracticeStarship[] = Object.freeze([
  { id: 1, name: 'Aurora', class: 'Cargo', status: 'Docked', crew: 4 },
  { id: 2, name: 'Comet Runner', class: 'Explorer', status: 'On the way', crew: 6 },
  { id: 3, name: 'Lunar Ferry', class: 'Shuttle', status: 'Boarding', crew: 2 },
  { id: 4, name: 'Red Horizon', class: 'Cargo', status: 'Leaving', crew: 5 },
  { id: 5, name: 'Silver Gull', class: 'Explorer', status: 'Docked', crew: 7 },
]);

export const CREW: readonly PracticeCrewMember[] = Object.freeze([
  { id: 1, name: 'Vega', role: 'Commander' },
  { id: 2, name: 'Orion', role: 'Pilot' },
  { id: 3, name: 'Lyra', role: 'Engineer' },
  { id: 4, name: 'Altair', role: 'Doctor' },
  { id: 5, name: 'Nova', role: 'Navigator' },
  { id: 6, name: 'Rigel', role: 'Scientist' },
]);

export function findStarship(id: number): PracticeStarship | undefined {
  return STARSHIPS.find((ship) => ship.id === id);
}

export type Reported = { ok: true; starship: PracticeStarship } | { ok: false; error: string };

// A reported starship, as the API would keep it: a name and one of the
// classes, answered with the next id and a status of its own. The messages
// are for a student reading the console, so they say what to send.
export function reportStarship(body: unknown): Reported {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return {
      ok: false,
      error:
        'Send a JSON object, like {"name": "Comet", "class": "Cargo"}, with the header Content-Type: application/json.',
    };
  }
  const { name, class: kind } = body as Record<string, unknown>;
  if (typeof name !== 'string' || name.trim() === '') {
    return { ok: false, error: 'The starship needs a name: send "name" with some text.' };
  }
  if (name.trim().length > PRACTICE_NAME_MAX) {
    return { ok: false, error: `A starship's name is at most ${PRACTICE_NAME_MAX} characters.` };
  }
  if (!PRACTICE_CLASSES.includes(kind as PracticeStarship['class'])) {
    return {
      ok: false,
      error: `"class" is one of ${PRACTICE_CLASSES.map((c) => `"${c}"`).join(', ')}.`,
    };
  }
  return {
    ok: true,
    starship: {
      id: STARSHIPS.length + 1,
      name: name.trim(),
      class: kind as PracticeStarship['class'],
      status: 'Reported',
      crew: 0,
    },
  };
}
