import { describe, it, expect } from 'vitest';
import { parseVisual } from './parseVisual';

const visual = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'tree',
    caption: 'A tree',
    nodes: { 0: 8, 1: 3 },
    steps: [{ add: { 2: 10 }, caption: '10 goes right' }],
    ...overrides,
  });

const step = (s: Record<string, unknown>) => visual({ steps: [{ caption: 'x', ...s }] });

describe('parseVisual, tree', () => {
  it('reads a tree by place, with its steps', () => {
    expect(
      parseVisual(
        visual({
          null: 'None',
          steps: [
            {
              title: 'insert 10',
              ask: 'Where does 10 go?',
              add: { 2: 10 },
              focus: [0],
              path: [0, 2],
              nulls: [1],
              tags: { 0: 'root' },
              code: 'root.right = Node(10)',
              caption: 'Right of 8',
            },
            { remove: [1], set: { 2: 4 }, swap: [0, 2], caption: 'x' },
          ],
        }),
      ),
    ).toEqual({
      type: 'tree',
      caption: 'A tree',
      null: 'None',
      array: false,
      nodes: { 0: 8, 1: 3 },
      steps: [
        {
          title: 'insert 10',
          ask: 'Where does 10 go?',
          add: { 2: 10 },
          focus: [0],
          path: [0, 2],
          nulls: [1],
          tags: { 0: 'root' },
          code: 'root.right = Node(10)',
          caption: 'Right of 8',
        },
        { remove: [1], set: { 2: 4 }, swap: [0, 2], caption: 'x' },
      ],
    });
  });

  it('calls an empty child null unless told otherwise, and starts from no nodes at all', () => {
    expect(
      parseVisual(visual({ nodes: {}, steps: [{ add: { 0: 8 }, caption: 'x' }] })),
    ).toMatchObject({ null: 'null', array: false, nodes: {} });
  });

  it('reads a list under the tree, nodes done, rows and a move', () => {
    expect(
      parseVisual(
        visual({
          array: true,
          steps: [
            {
              move: [1, 0],
              done: [0],
              rows: [
                { label: 'queue', values: [3, 'x'] },
                { label: 'printed', values: [] },
              ],
              caption: '3 moves up',
            },
          ],
        }),
      ),
    ).toMatchObject({
      array: true,
      steps: [
        {
          move: [1, 0],
          done: [0],
          rows: [
            { label: 'queue', values: [3, 'x'] },
            { label: 'printed', values: [] },
          ],
        },
      ],
    });
  });

  it('keeps an id', () => {
    expect(parseVisual(visual({ id: 'trees-grow' }))).toMatchObject({ id: 'trees-grow' });
    expect(parseVisual(visual())).not.toHaveProperty('id');
    expect(parseVisual(visual({ id: ' ' }))).toBeNull();
  });

  it.each([
    ['no caption', visual({ caption: undefined })],
    ['a blank null word', visual({ null: '' })],
    ['nodes that are no object', visual({ nodes: [8, 3] })],
    ['a place that is no number', visual({ nodes: { root: 8 } })],
    ['a place too deep', visual({ nodes: { 0: 1, 31: 2 } })],
    ['a value that is no number or string', visual({ nodes: { 0: null } })],
    ['a node with no parent', visual({ nodes: { 0: 8, 3: 1 } })],
    ['no steps', visual({ steps: [] })],
    ['steps that are no list', visual({ steps: {} })],
    ['a step that is no object', visual({ steps: [3] })],
    ['a step without a caption', visual({ steps: [{ focus: [0] }] })],
    ['a blank code line', step({ code: ' ' })],
    ['an empty list of places', step({ focus: [] })],
    ['a place named twice', step({ focus: [0, 0] })],
    ['a place out of range', step({ focus: [-1] })],
    ['an empty add', step({ add: {} })],
    ['an add on a node already there', step({ add: { 1: 4 } })],
    ['an add with no parent', step({ add: { 5: 4 } })],
    ['a set of no node', step({ set: { 2: 4 } })],
    ['a remove of no node', step({ remove: [2] })],
    ['a remove that leaves a child hanging', step({ remove: [0] })],
    ['a swap of one place', step({ swap: [0] })],
    ['a swap of a place with itself', step({ swap: [1, 1] })],
    ['a swap with no node', step({ swap: [0, 2] })],
    ['empty tags', step({ tags: {} })],
    ['a blank tag', step({ tags: { 0: '' } })],
    ['a tag on no node', step({ tags: { 2: 'x' } })],
    ['a focus on no node', step({ focus: [2] })],
    ['a path that skips a level', step({ path: [0, 3] })],
    ['a path that goes up', step({ path: [1, 0] })],
    ['empty children of no node', step({ nulls: [5] })],
    ['an array that is no boolean', visual({ array: 'yes' })],
    ['a node done that is not there', step({ done: [2] })],
    ['a move of one place', step({ move: [1] })],
    ['a move from no node', step({ move: [2, 0] })],
    ['a move that leaves a child hanging', step({ move: [0, 1] })],
    ['a done node after it moved away', step({ move: [1, 0], done: [1] })],
    ['no rows', step({ rows: [] })],
    ['rows that are no list', step({ rows: { queue: [] } })],
    ['a row without a label', step({ rows: [{ values: [1] }] })],
    ['a row whose values are no list', step({ rows: [{ label: 'q', values: 1 }] })],
    [
      'a row with a value that is no number or string',
      step({ rows: [{ label: 'q', values: [null] }] }),
    ],
  ])('refuses %s', (_, source) => {
    expect(parseVisual(source)).toBeNull();
  });
});
