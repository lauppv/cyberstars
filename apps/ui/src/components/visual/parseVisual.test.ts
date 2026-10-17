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
    ['a compare of one box', visual({ steps: [{ compare: [1], caption: 'x' }] })],
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
