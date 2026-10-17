import { describe, it, expect } from 'vitest';
import { gridFrames } from './gridFrames';
import type { GridVisual } from './parseGrid';

const grid: GridVisual = {
  type: 'grid',
  caption: 'A maze',
  cells: ['..', '#.'],
  steps: [
    { title: 'ring 0', set: [[0, 0, 0]], focus: [[0, 0]], caption: 'The start' },
    { set: [[0, 1, 1]], done: [[0, 0]], seen: [[1, 1]], code: 'x', caption: 'Ring 1' },
    { ask: 'Done?', rows: [{ label: 'queue', values: [] }], caption: 'Yes' },
  ],
};

describe('gridFrames', () => {
  it('keeps the values written, and shows the highlights of each step only', () => {
    const frames = gridFrames(grid);
    expect(frames).toHaveLength(4);
    expect(frames[0]).toMatchObject({ values: {}, focus: [], title: null, caption: 'A maze' });
    expect(frames[1]).toMatchObject({ values: { '0,0': 0 }, focus: [[0, 0]], title: 'ring 0' });
    expect(frames[2]).toMatchObject({
      values: { '0,0': 0, '0,1': 1 },
      focus: [],
      done: [[0, 0]],
      seen: [[1, 1]],
      code: 'x',
      title: 'ring 0',
    });
    expect(frames[3]).toMatchObject({
      values: { '0,0': 0, '0,1': 1 },
      ask: 'Done?',
      rows: [{ label: 'queue', values: [] }],
      code: null,
    });
  });

  it('shows a question with its answer before the values it writes', () => {
    const frames = gridFrames({
      ...grid,
      steps: [{ ask: 'How far?', set: [[0, 0, 0]], caption: '0' }],
    });
    expect(frames.map((f) => [f.values, f.ask])).toEqual([
      [{}, null],
      [{}, 'How far?'],
      [{ '0,0': 0 }, 'How far?'],
    ]);
  });
});
