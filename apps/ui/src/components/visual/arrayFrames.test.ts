import { describe, it, expect } from 'vitest';
import { arrayFrames } from './arrayFrames';

describe('arrayFrames', () => {
  it('starts from the array as given, then applies each step', () => {
    const frames = arrayFrames({
      type: 'array',
      values: [5, 3, 8],
      caption: 'Start',
      steps: [
        { compare: [0, 1], swap: true, caption: 'Swap 5 and 3' },
        { compare: [1, 2], caption: '5 < 8, ok' },
        { sorted: 2, caption: '8 is in place' },
        { compare: [0, 1], swap: true, sorted: 0, caption: 'Done' },
      ],
    });
    expect(frames).toEqual([
      { order: [0, 1, 2], compared: null, sortedFrom: 3, caption: 'Start' },
      { order: [1, 0, 2], compared: [0, 1], sortedFrom: 3, caption: 'Swap 5 and 3' },
      { order: [1, 0, 2], compared: [1, 2], sortedFrom: 3, caption: '5 < 8, ok' },
      { order: [1, 0, 2], compared: null, sortedFrom: 2, caption: '8 is in place' },
      { order: [0, 1, 2], compared: [0, 1], sortedFrom: 0, caption: 'Done' },
    ]);
  });
});
