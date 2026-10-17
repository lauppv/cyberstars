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
    const idle = { title: null, ask: null, done: [], at: [], range: null };
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
    const pass = { title: 'Pass 1', done: [], at: [], range: null };
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

  it('puts the markers where a step asks at once, and moves them, the range and the done ones after the answer', () => {
    const frames = arrayFrames({
      type: 'array',
      values: [1, 3, 5, 7],
      caption: 'Find 5',
      markers: ['left', 'mid', 'right'],
      steps: [
        {
          at: [0, 1, 3],
          compare: [1],
          ask: 'Is 3 < 5?',
          move: [2, null, 3],
          range: [2, 3],
          caption: 'Yes: left = 2',
        },
        { at: [2, 2, 3], compare: [2], ask: 'Is 5 == 5?', done: [2], caption: 'Found' },
        { title: 'After', caption: 'Nothing moves' },
      ],
    });
    const still = { order: [0, 1, 2, 3], sortedFrom: 4 };
    expect(frames.map(({ at, range, done, compared }) => ({ at, range, done, compared }))).toEqual([
      { at: [null, null, null], range: null, done: [], compared: null },
      { at: [0, 1, 3], range: null, done: [], compared: [1] },
      { at: [2, null, 3], range: [2, 3], done: [], compared: [1] },
      { at: [2, 2, 3], range: [2, 3], done: [], compared: [2] },
      { at: [2, 2, 3], range: [2, 3], done: [2], compared: [2] },
      // Markers, the range and the done ones stay until a step changes them
      { at: [2, 2, 3], range: [2, 3], done: [2], compared: null },
    ]);
    expect(frames.every((f) => f.order.join() === still.order.join())).toBe(true);
    expect(frames.every((f) => f.sortedFrom === still.sortedFrom)).toBe(true);
  });

  it('moves markers at once on a step that asks nothing', () => {
    const frames = arrayFrames({
      type: 'array',
      values: [4, 2],
      caption: 'Start',
      markers: ['i'],
      steps: [{ at: [0], move: [1], caption: 'Straight to 1' }],
    });
    expect(frames.map((f) => f.at)).toEqual([[null], [1]]);
  });
});
