import { describe, it, expect } from 'vitest';
import { placementLevel } from './placement.js';

describe('placementLevel', () => {
  it('cuts the 12 questions into three levels', () => {
    expect([0, 4, 5, 8, 9, 12].map(placementLevel)).toEqual([
      'beginner',
      'beginner',
      'intermediate',
      'intermediate',
      'advanced',
      'advanced',
    ]);
  });
});
