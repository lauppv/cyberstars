import { describe, it, expect } from 'vitest';
import { parseVisual } from './parseVisual';

const visual = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'grid',
    caption: 'A maze',
    cells: ['..#', '...'],
    steps: [{ set: [[0, 0, 0]], focus: [[0, 0]], caption: 'The start' }],
    ...overrides,
  });

const step = (s: Record<string, unknown>) => visual({ steps: [{ caption: 'x', ...s }] });

describe('parseVisual, grid', () => {
  it('reads the cells row by row, with its steps', () => {
    expect(
      parseVisual(
        visual({
          steps: [
            {
              title: 'ring 1',
              ask: 'Who is next?',
              set: [
                [0, 1, 1],
                [1, 0, 'a'],
              ],
              focus: [[0, 1]],
              seen: [[1, 0]],
              done: [[0, 0]],
              rows: [{ label: 'queue', values: ['(1, 1)'] }],
              code: 'queue.append((1, 1))',
              caption: 'Two cells',
            },
          ],
        }),
      ),
    ).toEqual({
      type: 'grid',
      caption: 'A maze',
      cells: ['..#', '...'],
      steps: [
        {
          title: 'ring 1',
          ask: 'Who is next?',
          set: [
            [0, 1, 1],
            [1, 0, 'a'],
          ],
          focus: [[0, 1]],
          seen: [[1, 0]],
          done: [[0, 0]],
          rows: [{ label: 'queue', values: ['(1, 1)'] }],
          code: 'queue.append((1, 1))',
          caption: 'Two cells',
        },
      ],
    });
  });

  it('wants rows of free cells and walls, all as long, eight a side at most', () => {
    for (const cells of [
      [],
      ['..', '.'],
      ['.x'],
      ['.........'],
      Array(9).fill('.'),
      'cells',
      [3],
    ]) {
      expect(parseVisual(visual({ cells }))).toBeNull();
    }
  });

  it('never points at a wall or outside the grid', () => {
    for (const bad of [
      { focus: [[0, 2]] },
      { seen: [[2, 0]] },
      { done: [[0, -1]] },
      { focus: [[0.5, 0]] },
      { focus: [[0]] },
      { focus: [] },
      { set: [[0, 2, 1]] },
      { set: [[0, 0]] },
      { set: [] },
      { set: 'x' },
    ]) {
      expect(parseVisual(step(bad))).toBeNull();
    }
  });

  it('puts a cell in one state at a time and writes it once a step', () => {
    expect(parseVisual(step({ focus: [[0, 0]], done: [[0, 0]] }))).toBeNull();
    expect(
      parseVisual(
        step({
          set: [
            [0, 0, 1],
            [0, 0, 2],
          ],
        }),
      ),
    ).toBeNull();
    expect(parseVisual(step({ set: [[0, 0, {}]] }))).toBeNull();
    expect(parseVisual(step({ set: [[0, 0, '']] }))).toBeNull();
  });

  it('refuses rows and words that do not fit', () => {
    for (const bad of [{ rows: [] }, { title: '' }, { ask: 4 }]) {
      expect(parseVisual(step(bad))).toBeNull();
    }
    expect(parseVisual(visual({ steps: [{ caption: '' }] }))).toBeNull();
    expect(parseVisual(visual({ steps: [] }))).toBeNull();
    expect(parseVisual(visual({ steps: [3] }))).toBeNull();
    expect(parseVisual(visual({ caption: '' }))).toBeNull();
  });
});
