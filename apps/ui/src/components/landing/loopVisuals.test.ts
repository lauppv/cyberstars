import { describe, it, expect, afterEach } from 'vitest';
import i18n from 'i18next';
import { breadthFirstVisual, linkedListVisual, searchTreeVisual } from './loopVisuals';
import { boxFrames } from '../visual/boxFrames';
import { treeFrames } from '../visual/treeFrames';
import { graphFrames } from '../visual/graphFrames';

const t = i18n.t.bind(i18n);

const VERTICES: [number, number][] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 0],
  [2, 1],
  [3, 1],
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [4, 5],
  [5, 6],
];

afterEach(async () => {
  await i18n.changeLanguage('en');
});

describe('linkedListVisual', () => {
  it('adds each value at the end, then takes one out of the middle', () => {
    const visual = linkedListVisual([10, 20, 30], 20, t);
    expect(visual.steps.map((s) => s.title)).toEqual([
      'add 10',
      'add 20',
      'add 30',
      'remove 20',
      undefined,
    ]);
    expect(visual.steps.map((s) => s.point)).toEqual([
      { head: 'n10' },
      { 'n10.next': 'n20' },
      { 'n20.next': 'n30' },
      { 'n10.next': 'n30' },
      undefined,
    ]);
    expect(visual.steps[3].caption).toBe("10's next. It now skips 20 and points at 30");
    const end = boxFrames(visual).at(-1)!;
    expect(end.places).toEqual(['shown', 'shown', 'removed', 'shown']);
    expect(end.caption).toBe('Nothing points at 20 any more, so it is out of the list');
  });

  it('names the fields as the Romanian lessons do', async () => {
    await i18n.changeLanguage('ro');
    const visual = linkedListVisual([10, 20, 30], 20, t);
    expect(visual.boxes[0].name).toBe('cap');
    expect(visual.boxes[1].cells.map((c) => c.name)).toEqual(['valoare', 'urmator']);
    expect(visual.steps[1].point).toEqual({ 'n10.urmator': 'n20' });
  });
});

describe('searchTreeVisual', () => {
  it('walks each value down to the empty place a search would end on', () => {
    const visual = searchTreeVisual([8, 3, 10, 1, 6, 14], t);
    expect(visual.steps.map((s) => s.add)).toEqual([
      { 0: 8 },
      { 1: 3 },
      { 2: 10 },
      { 3: 1 },
      { 4: 6 },
      { 6: 14 },
    ]);
    expect(visual.steps[4]).toMatchObject({
      ask: 'Where does 6 go?',
      path: [0, 1, 4],
      caption: '6 < 8, go left. 6 > 3, go right. Empty, so 6 goes there',
    });
    expect(visual.steps[0]).toMatchObject({ caption: 'The tree is empty: 8 becomes the root' });
    const nodes = treeFrames(visual).at(-1)!.nodes;
    expect(Object.fromEntries(Object.entries(nodes).map(([p, n]) => [p, n.value]))).toEqual({
      0: 8,
      1: 3,
      2: 10,
      3: 1,
      4: 6,
      6: 14,
    });
  });
});

describe('breadthFirstVisual', () => {
  it('reaches the vertices ring by ring, each tagged with its distance', () => {
    const visual = breadthFirstVisual(VERTICES, EDGES, 0, t, 'en');
    expect(visual.steps.map((s) => s.focus)).toEqual([[0], [1, 2], [3, 4], [5], [6], undefined]);
    expect(visual.steps.map((s) => s.caption)).toEqual([
      '0 steps: 0, the start',
      '1 step: 1 and 2',
      '2 steps: 3 and 4',
      '3 steps: 5',
      '4 steps: 6',
      'Every vertex is reached, each in the fewest steps from 0',
    ]);
    expect(visual.steps[2].used).toEqual([
      [1, 3],
      [2, 3],
      [1, 4],
    ]);
    expect(visual.steps[2].done).toEqual([0, 1, 2]);
    expect(visual.steps.at(-1)!.tags).toEqual({
      0: '0',
      1: '1',
      2: '1',
      3: '2',
      4: '2',
      5: '3',
      6: '4',
    });
    expect(graphFrames(visual)).toHaveLength(7);
  });

  it('speaks Romanian on the Romanian page', async () => {
    await i18n.changeLanguage('ro');
    const visual = breadthFirstVisual(VERTICES, EDGES, 0, t, 'ro');
    expect(visual.steps.slice(1, 3).map((s) => s.caption)).toEqual([
      '1 pas: 1 și 2',
      '2 pași: 3 și 4',
    ]);
  });
});
