import { describe, it, expect } from 'vitest';
import { parseVisual, type ArrayVisual } from './parseVisual';

const visual = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'array',
    values: [5, 3, 8],
    caption: 'Start',
    steps: [{ compare: [0, 1], swap: true, caption: 'Swap 5 and 3' }],
    ...overrides,
  });

const parseArray = (source: string) => parseVisual(source) as ArrayVisual | null;

describe('parseVisual', () => {
  it('reads an array visual with its steps', () => {
    expect(
      parseVisual(
        visual({
          steps: [
            { title: 'Pass 1', compare: [0, 1], ask: 'Is 5 > 3?', swap: true, caption: 'Swap' },
            { compare: [1, 2], caption: 'Compare' },
            { sorted: 2, caption: 'Sorted end' },
          ],
        }),
      ),
    ).toEqual({
      type: 'array',
      values: [5, 3, 8],
      caption: 'Start',
      steps: [
        { title: 'Pass 1', compare: [0, 1], ask: 'Is 5 > 3?', swap: true, caption: 'Swap' },
        { compare: [1, 2], caption: 'Compare' },
        { sorted: 2, caption: 'Sorted end' },
      ],
    });
  });

  it('reads two pointer labels', () => {
    expect(parseArray(visual({ pointers: ['j = {i}', 'j + 1'] }))?.pointers).toEqual([
      'j = {i}',
      'j + 1',
    ]);
    expect(parseVisual(visual())).not.toHaveProperty('pointers');
  });

  it('reads markers, their places, a range, done positions and a compare of one box', () => {
    const step = {
      compare: [1],
      ask: 'Is 3 < 5?',
      at: [0, 1, 2],
      move: [2, null, 2],
      range: [2, 2],
      done: [2],
      caption: 'Yes',
    };
    expect(parseArray(visual({ markers: ['left', 'mid', 'right'], steps: [step] }))).toEqual({
      type: 'array',
      values: [5, 3, 8],
      caption: 'Start',
      markers: ['left', 'mid', 'right'],
      steps: [step],
    });
    expect(parseVisual(visual())).not.toHaveProperty('markers');
  });

  it('takes strings as values', () => {
    expect(parseArray(visual({ values: ['a', 'b', 'c'] }))?.values).toEqual(['a', 'b', 'c']);
  });

  it.each([
    ['text that is not JSON', 'not json'],
    ['a JSON array', '[1, 2]'],
    ['another type', visual({ type: 'tree' })],
    ['no caption', visual({ caption: undefined })],
    ['a blank caption', visual({ caption: '  ' })],
    ['no values', visual({ values: [] })],
    ['a value that is no number or string', visual({ values: [1, null, 3] })],
    ['values that are no list', visual({ values: '5 3 8' })],
    ['no steps', visual({ steps: [] })],
    ['steps that are no list', visual({ steps: {} })],
    ['a step that is no object', visual({ steps: ['swap'] })],
    ['a step without a caption', visual({ steps: [{ compare: [0, 1] }] })],
    ['a compare out of range', visual({ steps: [{ compare: [2, 3], caption: 'x' }] })],
    ['a compare of one box with itself', visual({ steps: [{ compare: [1, 1], caption: 'x' }] })],
    ['a compare of three boxes', visual({ steps: [{ compare: [0, 1, 2], caption: 'x' }] })],
    ['a compare of no box', visual({ steps: [{ compare: [], caption: 'x' }] })],
    ['a swap of one box', visual({ steps: [{ compare: [1], swap: true, caption: 'x' }] })],
    ['markers that are no list', visual({ markers: 'left' })],
    ['no markers in the list', visual({ markers: [] })],
    ['a blank marker', visual({ markers: ['left', ' '] })],
    ['places without markers', visual({ steps: [{ at: [0], caption: 'x' }] })],
    [
      'a place for each marker missing',
      visual({ markers: ['left', 'right'], steps: [{ at: [0], caption: 'x' }] }),
    ],
    ['a marker out of range', visual({ markers: ['left'], steps: [{ move: [3], caption: 'x' }] })],
    ['places that are no list', visual({ markers: ['left'], steps: [{ at: 0, caption: 'x' }] })],
    ['a range of one end', visual({ steps: [{ range: [0], caption: 'x' }] })],
    ['a range out of the array', visual({ steps: [{ range: [0, 3], caption: 'x' }] })],
    ['done positions that are no list', visual({ steps: [{ done: 1, caption: 'x' }] })],
    ['a done position out of the array', visual({ steps: [{ done: [3], caption: 'x' }] })],
    ['a compare that is no list', visual({ steps: [{ compare: '0 1', caption: 'x' }] })],
    ['one pointer label', visual({ pointers: ['j'] })],
    ['a blank pointer label', visual({ pointers: ['j', ' '] })],
    ['pointers that are no list', visual({ pointers: 'j' })],
    ['a blank title', visual({ steps: [{ title: ' ', caption: 'x' }] })],
    ['a question without a compare', visual({ steps: [{ ask: 'Is 5 > 3?', caption: 'x' }] })],
    ['a blank question', visual({ steps: [{ compare: [0, 1], ask: '', caption: 'x' }] })],
    ['a swap without a compare', visual({ steps: [{ swap: true, caption: 'x' }] })],
    [
      'a swap that is not true',
      visual({ steps: [{ compare: [0, 1], swap: 'yes', caption: 'x' }] }),
    ],
    ['a sorted end past the array', visual({ steps: [{ sorted: 4, caption: 'x' }] })],
    ['a negative sorted end', visual({ steps: [{ sorted: -1, caption: 'x' }] })],
    ['a sorted end that is no whole number', visual({ steps: [{ sorted: 1.5, caption: 'x' }] })],
  ])('refuses %s', (_, source) => {
    expect(parseVisual(source)).toBeNull();
  });
});
