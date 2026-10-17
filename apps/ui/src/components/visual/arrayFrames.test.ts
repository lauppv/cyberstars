import { describe, it, expect } from 'vitest';
import { arrayFrames } from './arrayFrames';

describe('arrayFrames', () => {
  it('starts from the array as given, then applies each step', () => {
    const frames = arrayFrames({
      type: 'array',
      values: [5, 3, 8],
      caption: 'How it works',
      steps: [
        { compare: [0, 1], swap: true, caption: 'Swap 5 and 3' },
        { compare: [1, 2], caption: '5 < 8, ok' },
        { sorted: 2, caption: '8 is in place' },
        { compare: [0, 1], swap: true, sorted: 0, caption: 'Done' },
      ],
    });
    const idle = { title: null, ask: null };
    expect(frames).toEqual([
      { ...idle, order: [0, 1, 2], compared: null, sortedFrom: 3, caption: 'How it works' },
      { ...idle, order: [1, 0, 2], compared: [0, 1], sortedFrom: 3, caption: 'Swap 5 and 3' },
      { ...idle, order: [1, 0, 2], compared: [1, 2], sortedFrom: 3, caption: '5 < 8, ok' },
      { ...idle, order: [1, 0, 2], compared: null, sortedFrom: 2, caption: '8 is in place' },
      { ...idle, order: [0, 1, 2], compared: [0, 1], sortedFrom: 0, caption: 'Done' },
    ]);
  });

  it('shows a question with its answer before the swap or the sorted end it announces', () => {
    const frames = arrayFrames({
      type: 'array',
      values: [5, 3, 8],
      caption: 'Start',
      steps: [
        { title: 'Pass 1', compare: [0, 1], ask: 'Is 5 > 3?', swap: true, caption: 'Yes' },
        { compare: [1, 2], ask: 'Is 5 > 8?', caption: 'No' },
        { compare: [1, 2], ask: 'Is 8 the end?', sorted: 2, caption: 'Yes' },
        { sorted: 0, caption: 'Done' },
      ],
    });
    const pass = { title: 'Pass 1' };
    expect(frames.slice(1)).toEqual([
      {
        ...pass,
        order: [0, 1, 2],
        compared: [0, 1],
        sortedFrom: 3,
        ask: 'Is 5 > 3?',
        caption: 'Yes',
      },
      {
        ...pass,
        order: [1, 0, 2],
        compared: [0, 1],
        sortedFrom: 3,
        ask: 'Is 5 > 3?',
        caption: 'Yes',
      },
      // Nothing changes on a no, so it takes one frame
      {
        ...pass,
        order: [1, 0, 2],
        compared: [1, 2],
        sortedFrom: 3,
        ask: 'Is 5 > 8?',
        caption: 'No',
      },
      {
        ...pass,
        order: [1, 0, 2],
        compared: [1, 2],
        sortedFrom: 3,
        ask: 'Is 8 the end?',
        caption: 'Yes',
      },
      {
        ...pass,
        order: [1, 0, 2],
        compared: [1, 2],
        sortedFrom: 2,
        ask: 'Is 8 the end?',
        caption: 'Yes',
      },
      // The title stays until a step changes it
      { ...pass, order: [1, 0, 2], compared: null, sortedFrom: 0, ask: null, caption: 'Done' },
    ]);
  });
});
