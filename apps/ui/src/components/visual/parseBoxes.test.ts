import { describe, it, expect } from 'vitest';
import { parseVisual } from './parseVisual';
import { findCell } from './parseBoxes';

const node = (id: string, value: number) => ({
  id,
  fields: [
    { name: 'data', value },
    { name: 'next', to: null },
  ],
});

const visual = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'boxes',
    caption: 'A list',
    boxes: [{ id: 'head', name: 'head', to: null, shown: true }, node('a', 10), node('b', 20)],
    steps: [{ show: ['a'], point: { head: 'a' }, caption: 'head points at 10' }],
    ...overrides,
  });

const step = (s: Record<string, unknown>) => visual({ steps: [{ caption: 'x', ...s }] });
const boxes = (...list: unknown[]) => visual({ boxes: list, steps: [{ caption: 'x' }] });

describe('parseVisual, boxes', () => {
  it('reads boxes, nodes and their steps', () => {
    expect(
      parseVisual(
        visual({
          null: 'null',
          steps: [
            {
              title: 'add 10',
              focus: ['head'],
              ask: 'Is the list empty?',
              show: ['a'],
              point: { head: 'a' },
              caption: 'Yes',
            },
            { show: ['b'], point: { 'a.next': 'b' }, set: { 'b.data': 'x' }, caption: 'b' },
            { point: { head: 'b' }, caption: 'skip a' },
            { remove: ['a'], caption: 'a goes' },
          ],
        }),
      ),
    ).toEqual({
      type: 'boxes',
      caption: 'A list',
      null: 'null',
      boxes: [
        { id: 'head', name: 'head', shown: true, cells: [{ to: null }] },
        {
          id: 'a',
          shown: false,
          cells: [
            { name: 'data', value: 10 },
            { name: 'next', to: null },
          ],
        },
        {
          id: 'b',
          shown: false,
          cells: [
            { name: 'data', value: 20 },
            { name: 'next', to: null },
          ],
        },
      ],
      steps: [
        {
          title: 'add 10',
          focus: ['head'],
          ask: 'Is the list empty?',
          show: ['a'],
          point: { head: 'a' },
          caption: 'Yes',
        },
        { show: ['b'], point: { 'a.next': 'b' }, set: { 'b.data': 'x' }, caption: 'b' },
        { point: { head: 'b' }, caption: 'skip a' },
        { remove: ['a'], caption: 'a goes' },
      ],
    });
  });

  it('calls a null arrow NULL unless told otherwise, and takes a box without a name', () => {
    const parsed = parseVisual(
      JSON.stringify({
        type: 'boxes',
        caption: 'x',
        boxes: [{ id: 'x', value: 10, shown: true }],
        steps: [{ set: { x: 42 }, caption: 'x is 42' }],
      }),
    );
    expect(parsed).toMatchObject({ null: 'NULL', boxes: [{ id: 'x', cells: [{ value: 10 }] }] });
    expect(parsed).not.toHaveProperty('boxes.0.name');
  });

  it.each([
    ['no caption', visual({ caption: undefined })],
    ['a blank null word', visual({ null: ' ' })],
    ['no boxes', boxes()],
    ['boxes that are no list', visual({ boxes: {} })],
    ['a box that is no object', boxes('head')],
    ['a box without an id', boxes({ value: 1 })],
    ['an id with a dot', boxes({ id: 'a.b', value: 1 })],
    ['two boxes with one id', boxes(node('a', 1), node('a', 2))],
    ['a box with a value and an arrow', boxes({ id: 'x', value: 1, to: null })],
    ['a box with neither', boxes({ id: 'x' })],
    ['a value that is no number or string', boxes({ id: 'x', value: [1] })],
    ['an arrow that is no id', boxes({ id: 'x', to: 3 })],
    ['an arrow to no box', boxes({ id: 'x', to: 'y' })],
    ['a blank name', boxes({ id: 'x', name: '', value: 1 })],
    ['shown that is no boolean', boxes({ id: 'x', value: 1, shown: 'yes' })],
    ['a node with one field', boxes({ id: 'a', fields: [{ name: 'd', value: 1 }] })],
    ['a node with a name', boxes({ ...node('a', 1), name: 'a' })],
    ['a node with a value of its own', boxes({ ...node('a', 1), value: 1 })],
    ['a node whose fields are no list', boxes({ id: 'a', fields: { data: 1 } })],
    [
      'a field without a name',
      visual({
        boxes: [{ id: 'a', fields: [{ value: 1 }, { name: 'next', to: null }] }],
        steps: [{ caption: 'x' }],
      }),
    ],
    [
      'a field with neither value nor arrow',
      visual({
        boxes: [{ id: 'a', fields: [{ name: 'data' }, { name: 'next', to: null }] }],
        steps: [{ caption: 'x' }],
      }),
    ],
    [
      'two fields with one name',
      visual({
        boxes: [
          {
            id: 'a',
            fields: [
              { name: 'd', value: 1 },
              { name: 'd', value: 2 },
            ],
          },
        ],
        steps: [{ caption: 'x' }],
      }),
    ],
    ['no steps', visual({ steps: [] })],
    ['steps that are no list', visual({ steps: {} })],
    ['a step that is no object', visual({ steps: ['show'] })],
    ['a step without a caption', visual({ steps: [{ show: ['a'] }] })],
    ['a blank title', step({ title: ' ' })],
    ['a blank question', step({ ask: '' })],
    ['a list of boxes that is empty', step({ focus: [] })],
    ['a list of boxes that is no list', step({ show: 'a' })],
    ['a box named twice', step({ show: ['a', 'a'] })],
    ['an unknown box', step({ focus: ['z'] })],
    ['a set that is empty', step({ set: {} })],
    ['a set that is no object', step({ set: 'a.data' })],
    ['a set of an arrow', step({ show: ['a'], set: { 'a.next': 1 } })],
    ['a set of an unknown field', step({ show: ['a'], set: { 'a.value': 1 } })],
    ['a set of a node without a field', step({ show: ['a'], set: { a: 1 } })],
    ['an address too deep', step({ show: ['a'], set: { 'a.data.x': 1 } })],
    ['a set to no value', step({ show: ['a'], set: { 'a.data': null } })],
    ['a point that is empty', step({ point: {} })],
    ['a point that is no object', step({ point: ['head'] })],
    ['a point of a value', step({ show: ['a'], point: { 'a.data': 'a' } })],
    ['a point to no box', step({ point: { head: 'z' } })],
    ['a point to no id', step({ point: { head: 1 } })],
    ['a box shown twice', visual({ steps: [{ show: ['head'], caption: 'x' }] })],
    ['a box removed before it came', step({ remove: ['a'] })],
    ['a change to a box not on screen', step({ set: { 'a.data': 1 } })],
    ['an arrow to a box not on screen', step({ point: { head: 'a' } })],
    [
      'a box on screen pointing at one not yet',
      visual({
        boxes: [
          { id: 'p', to: 'x' },
          { id: 'x', value: 1 },
        ],
        steps: [{ show: ['p'], caption: 'x' }],
      }),
    ],
    [
      'a box removed while an arrow still points at it',
      visual({
        steps: [
          { show: ['a'], point: { head: 'a' }, caption: 'x' },
          { remove: ['a'], caption: 'y' },
        ],
      }),
    ],
    [
      'a box shown from the start pointing at one not there',
      visual({
        boxes: [
          { id: 'p', to: 'x', shown: true },
          { id: 'x', value: 1 },
        ],
      }),
    ],
  ])('refuses %s', (_, source) => {
    expect(parseVisual(source)).toBeNull();
  });
});

describe('findCell', () => {
  const boxes = [
    { id: 'x', shown: true, cells: [{ value: 1 }] },
    {
      id: 'a',
      shown: true,
      cells: [
        { name: 'data', value: 1 },
        { name: 'next', to: null },
      ],
    },
  ];

  it('finds a box of one cell by its id and a field by id.field', () => {
    expect(findCell(boxes, 'x')).toEqual([0, 0]);
    expect(findCell(boxes, 'a.next')).toEqual([1, 1]);
  });

  it('finds nothing for a field of a box of one cell, or for an unknown box', () => {
    expect(findCell(boxes, 'x.data')).toBeNull();
    expect(findCell(boxes, 'y')).toBeNull();
  });
});
