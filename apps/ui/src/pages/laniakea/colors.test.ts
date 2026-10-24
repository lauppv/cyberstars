import { describe, it, expect } from 'vitest';
import type { LaniakeaPlanet } from '@cyberstars/shared/laniakea';
import { markOf } from './colors';

function planet(over: Partial<LaniakeaPlanet> = {}): LaniakeaPlanet {
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

describe('markOf', () => {
  it('marks a planet by whose it is', () => {
    expect(markOf(planet({ lessonDone: false }), 'locked')).toBe('none');
    expect(markOf(planet({ hasQuiz: false }), 'soon')).toBe('none');
    expect(markOf(planet(), 'conquerable')).toBe('open');
    expect(markOf(planet(), 'retry')).toBe('open');
    expect(markOf(planet({ level: 2 }), 'owned')).toBe('owned');
    expect(markOf(planet({ level: 2 }), 'recap')).toBe('recap');
    expect(markOf(planet({ level: 8 }), 'forever')).toBe('forever');
  });

  it('keeps one of the student’s planets blue while a failed practice holds it', () => {
    expect(markOf(planet({ level: 3 }), 'retry')).toBe('owned');
  });
});
