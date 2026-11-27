import { describe, it, expect } from 'vitest';
import { placementLevel } from './placement.js';

describe('placementLevel', () => {
  it('cuts the 10 questions into three levels', () => {
    expect([0, 3, 4, 6, 7, 10].map(placementLevel)).toEqual([
      'beginner',
      'beginner',
      'intermediate',
      'intermediate',
      'advanced',
      'advanced',
    ]);
  });
});
