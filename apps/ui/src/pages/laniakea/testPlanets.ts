import type { LaniakeaPlanet } from '@cyberstars/shared/laniakea';

// A planet for the tests, ready to conquer unless told otherwise.
export function testPlanet(over: Partial<LaniakeaPlanet> = {}): LaniakeaPlanet {
  return {
    slug: 'print',
    lessonDone: true,
    hasQuiz: true,
    level: 0,
    passedAt: null,
    nextRecapAt: null,
    retryAt: null,
    ...over,
  };
}
