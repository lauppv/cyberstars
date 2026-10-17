import { describe, it, expect } from 'vitest';
import { parseVisual } from './parseVisual';

const visual = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'graph',
    caption: 'A graph',
    vertices: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
    edges: [[0, 1]],
    steps: [{ add: [[1, 2]], caption: '1 joins 2' }],
    ...overrides,
  });

const step = (s: Record<string, unknown>) => visual({ steps: [{ caption: 'x', ...s }] });

describe('parseVisual, graph', () => {
  it('reads the vertices where they stand, the edges and the steps', () => {
    expect(
      parseVisual(
        visual({
          list: true,
          matrix: true,
          steps: [
            {
              title: 'from 0',
              ask: 'Who is next?',
              add: [[1, 2]],
              focus: [0],
              seen: [1],
              done: [2],
              used: [[0, 1]],
              tags: { 0: '0', 1: '1' },
              rows: [{ label: 'queue', values: [1] }],
              code: 'queue.append(1)',
              caption: '1 is next',
            },
          ],
        }),
      ),
    ).toEqual({
      type: 'graph',
      caption: 'A graph',
      directed: false,
      list: true,
      matrix: true,
      vertices: [
        [0, 0],
        [1, 0],
        [0, 1],
      ],
      edges: [[0, 1]],
      steps: [
        {
          title: 'from 0',
          ask: 'Who is next?',
          add: [[1, 2]],
          focus: [0],
          seen: [1],
          done: [2],
          used: [[0, 1]],
          tags: { 0: '0', 1: '1' },
          rows: [{ label: 'queue', values: [1] }],
          code: 'queue.append(1)',
          caption: '1 is next',
        },
      ],
    });
  });

  it('starts with no edges unless given, and reads weights and arrows', () => {
    const graph = parseVisual(
      visual({ directed: true, edges: undefined, steps: [{ add: [[0, 1, 4]], caption: 'x' }] }),
    );
    expect(graph).toMatchObject({ directed: true, edges: [], steps: [{ add: [[0, 1, 4]] }] });
  });

  it('stands a vertex on half steps but not off the grid', () => {
    expect(
      parseVisual(
        visual({
          vertices: [
            [0, 0],
            [1, 0],
            [0.5, 1],
          ],
        }),
      ),
    ).not.toBeNull();
    for (const spot of [[0.25, 1], [-1, 0], [7, 0], [0], 'a', [0, '1']]) {
      expect(parseVisual(visual({ vertices: [[0, 0], [1, 0], spot] }))).toBeNull();
    }
    expect(parseVisual(visual({ vertices: [] }))).toBeNull();
    expect(parseVisual(visual({ vertices: 'none' }))).toBeNull();
    const eleven = Array.from({ length: 11 }, (_, i) => [i % 6, Math.floor(i / 6)]);
    expect(
      parseVisual(visual({ vertices: eleven, edges: [], steps: [{ caption: 'x' }] })),
    ).toBeNull();
  });

  it('keeps two vertices apart', () => {
    expect(
      parseVisual(
        visual({
          vertices: [
            [0, 0],
            [1, 0],
            [1, 0],
          ],
        }),
      ),
    ).toBeNull();
  });

  it('refuses an edge that runs through a vertex it does not join', () => {
    const inLine = {
      vertices: [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      edges: [],
    };
    expect(parseVisual(visual({ ...inLine, steps: [{ add: [[0, 2]], caption: 'x' }] }))).toBeNull();
    expect(
      parseVisual(visual({ ...inLine, steps: [{ add: [[0, 1]], caption: 'x' }] })),
    ).not.toBeNull();
  });

  it('refuses an edge that is not between two vertices, or comes twice either way', () => {
    for (const edge of [[0, 3], [0, 0], [0], [0, 1, 'x'], [0, 1, 2, 3], 'edge']) {
      expect(parseVisual(visual({ edges: [edge] }))).toBeNull();
    }
    expect(parseVisual(visual({ edges: 'none' }))).toBeNull();
    expect(parseVisual(step({ add: [[1, 0]] }))).toBeNull();
    expect(
      parseVisual(visual({ directed: true, steps: [{ add: [[1, 0]], caption: 'x' }] })),
    ).toBeNull();
    expect(parseVisual(step({ add: [] }))).toBeNull();
  });

  it('wants a weight on every edge or none', () => {
    expect(parseVisual(step({ add: [[1, 2, 3]] }))).toBeNull();
    expect(
      parseVisual(visual({ edges: [[0, 1, 2]], steps: [{ add: [[1, 2, 3]], caption: 'x' }] })),
    ).not.toBeNull();
  });

  it('uses only edges on screen, the way they go in a directed graph', () => {
    expect(parseVisual(step({ used: [[1, 0]] }))).not.toBeNull();
    expect(parseVisual(step({ used: [[1, 2]] }))).toBeNull();
    expect(
      parseVisual(visual({ steps: [{ add: [[1, 2]], used: [[2, 1]], caption: 'x' }] })),
    ).not.toBeNull();
    expect(
      parseVisual(visual({ directed: true, steps: [{ used: [[1, 0]], caption: 'x' }] })),
    ).toBeNull();
    expect(parseVisual(step({ used: [[0, 1, 2]] }))).toBeNull();
    expect(parseVisual(step({ used: [] }))).toBeNull();
  });

  it('puts a vertex in one state at a time, each named once', () => {
    expect(parseVisual(step({ focus: [0], done: [0] }))).toBeNull();
    expect(parseVisual(step({ seen: [1, 1] }))).toBeNull();
    expect(parseVisual(step({ done: [3] }))).toBeNull();
    expect(parseVisual(step({ focus: [] }))).toBeNull();
  });

  it('refuses tags, rows and words that do not fit', () => {
    for (const bad of [
      { tags: {} },
      { tags: { 3: 'x' } },
      { tags: { a: 'x' } },
      { tags: { 0: '' } },
      { tags: [] },
      { rows: [] },
      { rows: [{ label: 'q', values: [{}] }] },
      { title: '' },
      { code: 3 },
    ]) {
      expect(parseVisual(step(bad))).toBeNull();
    }
    expect(parseVisual(visual({ steps: [{ caption: '' }] }))).toBeNull();
    expect(parseVisual(visual({ steps: ['x'] }))).toBeNull();
    expect(parseVisual(visual({ steps: [] }))).toBeNull();
    expect(parseVisual(visual({ caption: ' ' }))).toBeNull();
    expect(parseVisual(visual({ list: 'yes' }))).toBeNull();
  });
});
