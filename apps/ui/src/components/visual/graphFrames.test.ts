import { describe, it, expect } from 'vitest';
import { adjacency, graphFrames } from './graphFrames';
import type { GraphVisual } from './parseGraph';

const graph: GraphVisual = {
  type: 'graph',
  caption: 'A graph',
  directed: false,
  list: false,
  matrix: false,
  vertices: [
    [0, 0],
    [1, 0],
    [0, 1],
  ],
  edges: [[0, 1]],
  steps: [
    { title: 'from 0', add: [[1, 2]], focus: [1], used: [[1, 2]], caption: '1 joins 2' },
    { done: [0], tags: { 0: '0' }, rows: [{ label: 'queue', values: [2] }], caption: 'x' },
  ],
};

describe('graphFrames', () => {
  it('starts from the edges given, then adds each step', () => {
    const frames = graphFrames(graph);
    expect(frames).toHaveLength(3);
    expect(frames[0]).toMatchObject({
      edges: [[0, 1]],
      focus: [],
      seen: [],
      done: [],
      used: [],
      tags: {},
      rows: [],
      code: null,
      title: null,
      ask: null,
      caption: 'A graph',
    });
    expect(frames[1]).toMatchObject({
      edges: [
        [0, 1],
        [1, 2],
      ],
      focus: [1],
      used: [[1, 2]],
      title: 'from 0',
    });
    expect(frames[2]).toMatchObject({
      edges: frames[1].edges,
      done: [0],
      tags: { 0: '0' },
      rows: [{ label: 'queue', values: [2] }],
      title: 'from 0',
    });
  });

  it('shows a question with its answer before the edges it announces', () => {
    const frames = graphFrames({
      ...graph,
      steps: [
        { ask: 'Joined?', add: [[1, 2]], caption: 'Yes' },
        { ask: 'Ready?', focus: [2], caption: 'No' },
      ],
    });
    expect(frames.map((f) => [f.edges.length, f.ask])).toEqual([
      [1, null],
      [1, 'Joined?'],
      [2, 'Joined?'],
      [2, 'Ready?'],
    ]);
  });
});

describe('adjacency', () => {
  it('lists each neighbour in the order the edges came, both ways unless directed', () => {
    const edges: GraphVisual['edges'] = [
      [0, 2],
      [1, 0],
    ];
    expect(adjacency(3, edges, false)).toEqual([
      [
        [0, 2],
        [0, 1],
      ],
      [[1, 0]],
      [[2, 0]],
    ]);
    expect(adjacency(3, edges, true)).toEqual([[[0, 2]], [[1, 0]], []]);
    expect(adjacency(2, [[0, 1, 5]], false)).toEqual([[[0, 1, 5]], [[1, 0, 5]]]);
  });
});
