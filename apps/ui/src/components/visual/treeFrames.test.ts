import { describe, it, expect } from 'vitest';
import { treeFrames } from './treeFrames';
import type { TreeVisual } from './parseTree';

const tree: TreeVisual = {
  type: 'tree',
  caption: 'A heap',
  null: 'null',
  array: false,
  nodes: { 0: 1, 1: 3, 2: 6 },
  steps: [
    { title: 'push 2', add: { 3: 2 }, focus: [3], code: 'push(2)', caption: '2 goes last' },
    { swap: [1, 3], path: [0, 1, 3], caption: '2 < 3: swap' },
    { set: { 0: 9 }, remove: [3], tags: { 0: 'new' }, nulls: [1], caption: 'x' },
  ],
};

const values = (frame: ReturnType<typeof treeFrames>[number]) =>
  Object.fromEntries(Object.entries(frame.nodes).map(([place, v]) => [place, v.value]));

describe('treeFrames', () => {
  it('starts from the nodes as given, then applies each step', () => {
    const frames = treeFrames(tree);
    expect(frames).toHaveLength(4);
    expect(frames[0]).toMatchObject({
      focus: [],
      path: [],
      nulls: [],
      tags: {},
      code: null,
      title: null,
      ask: null,
      caption: 'A heap',
    });
    expect(values(frames[0])).toEqual({ 0: 1, 1: 3, 2: 6 });
    expect(values(frames[1])).toEqual({ 0: 1, 1: 3, 2: 6, 3: 2 });
    expect(frames[1]).toMatchObject({ focus: [3], code: 'push(2)', title: 'push 2' });
    expect(values(frames[2])).toEqual({ 0: 1, 1: 2, 2: 6, 3: 3 });
    expect(frames[2]).toMatchObject({ path: [0, 1, 3], code: null, title: 'push 2' });
    expect(values(frames[3])).toEqual({ 0: 9, 1: 2, 2: 6 });
    expect(frames[3]).toMatchObject({ tags: { 0: 'new' }, nulls: [1] });
  });

  it('lets a swapped value keep its id and gives a value set anew a new one', () => {
    const [start, added, swapped, set] = treeFrames(tree);
    expect(swapped.nodes[1].id).toBe(added.nodes[3].id);
    expect(swapped.nodes[3].id).toBe(start.nodes[1].id);
    expect(set.nodes[0].id).not.toBe(swapped.nodes[0].id);
    expect(set.nodes[2]).toBe(start.nodes[2]);
  });

  it('shows a question with its answer and highlights before the change it announces', () => {
    const frames = treeFrames({
      ...tree,
      steps: [
        { ask: 'Where does 2 go?', add: { 3: 2 }, focus: [1], caption: 'Below 3' },
        { ask: 'Is it a leaf?', focus: [3], caption: 'Yes' },
      ],
    });
    expect(frames.map((f) => [Object.keys(f.nodes).length, f.ask, f.focus])).toEqual([
      [3, null, []],
      [3, 'Where does 2 go?', [1]],
      [4, 'Where does 2 go?', [1]],
      [4, 'Is it a leaf?', [3]],
    ]);
  });

  it('moves a value to another node, which loses its own, and carries done and rows', () => {
    const [start, moved] = treeFrames({
      ...tree,
      steps: [
        {
          move: [2, 0],
          done: [1],
          rows: [{ label: 'queue', values: [3] }],
          caption: '6 to the root',
        },
      ],
    });
    expect(values(moved)).toEqual({ 0: 6, 1: 3 });
    expect(moved.nodes[0]).toBe(start.nodes[2]);
    expect(moved).toMatchObject({ done: [1], rows: [{ label: 'queue', values: [3] }] });
    expect(start).toMatchObject({ done: [], rows: [] });
  });
});
