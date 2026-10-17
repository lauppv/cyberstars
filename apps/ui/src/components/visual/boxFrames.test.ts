import { describe, it, expect } from 'vitest';
import { boxFrames } from './boxFrames';
import type { BoxesVisual } from './parseBoxes';

const list: BoxesVisual = {
  type: 'boxes',
  caption: 'A list',
  null: 'NULL',
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
    { title: 'insert 10', show: ['a'], point: { head: 'a' }, caption: 'head points at 10' },
    { show: ['b'], point: { 'a.next': 'b' }, set: { 'b.data': 25 }, caption: '10 points at 25' },
    { focus: ['a', 'b'], caption: 'print: 10 25' },
    { point: { head: 'b' }, caption: 'head skips 10' },
    { title: 'remove', remove: ['a'], caption: '10 goes' },
  ],
};

const data = (value: number) => ({ name: 'data', value });
const next = (to: string | null) => ({ name: 'next', to });

describe('boxFrames', () => {
  it('starts from the boxes as given, then applies each step', () => {
    const frames = boxFrames(list);
    expect(frames).toHaveLength(6);
    expect(frames[0]).toEqual({
      places: ['shown', 'hidden', 'hidden'],
      cells: [[{ to: null }], [data(10), next(null)], [data(20), next(null)]],
      focus: [],
      title: null,
      ask: null,
      question: null,
      caption: 'A list',
    });
    expect(frames[1]).toMatchObject({
      places: ['shown', 'shown', 'hidden'],
      cells: [[{ to: 'a' }], [data(10), next(null)], [data(20), next(null)]],
      title: 'insert 10',
    });
    expect(frames[2]).toMatchObject({
      places: ['shown', 'shown', 'shown'],
      cells: [[{ to: 'a' }], [data(10), next('b')], [data(25), next(null)]],
      title: 'insert 10',
    });
    expect(frames[3]).toMatchObject({ focus: ['a', 'b'], caption: 'print: 10 25' });
    expect(frames[3].cells).toBe(frames[2].cells);
    expect(frames[4].cells[0]).toEqual([{ to: 'b' }]);
    expect(frames[5]).toMatchObject({
      places: ['shown', 'removed', 'shown'],
      title: 'remove',
      caption: '10 goes',
    });
  });

  it('shows a question with its answer before the change it announces', () => {
    const frames = boxFrames({
      ...list,
      steps: [
        { ask: 'Is the list empty?', show: ['a'], point: { head: 'a' }, caption: 'Yes' },
        { focus: ['a'], ask: 'Is it 10?', caption: 'Yes, nothing moves' },
      ],
    });
    expect(frames.map((f) => [f.places[1], f.ask, f.caption])).toEqual([
      ['hidden', null, 'A list'],
      ['hidden', 'Is the list empty?', 'Yes'],
      ['shown', 'Is the list empty?', 'Yes'],
      ['shown', 'Is it 10?', 'Yes, nothing moves'],
    ]);
  });
});
