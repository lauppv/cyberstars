import { describe, it, expect } from 'vitest';
import { stackFrames } from './stackFrames';
import type { StackVisual } from './parseStack';

const calls: StackVisual = {
  type: 'stack',
  caption: 'Calls wait',
  queue: false,
  ends: false,
  cards: [{ id: 'main', text: 'main()' }],
  steps: [
    {
      title: 'Down',
      push: [{ id: 'f2', text: 'f(2)', line: '2 * f(1)' }],
      focus: ['f2'],
      caption: 'f(2) waits',
    },
    {
      push: [{ id: 'f1', text: 'f(1)', line: 'return 1' }],
      done: ['f1'],
      tags: { f1: 'base case' },
      caption: 'The base case',
    },
    {
      title: 'Up',
      ask: 'What does f(2) return?',
      pop: 1,
      set: { f2: '2 * 1 = 2' },
      done: ['f1', 'f2'],
      caption: '2',
    },
    { ask: 'Anything left?', caption: 'main' },
  ],
};

const ids = (frame: { cards: { id: string }[] }) => frame.cards.map((card) => card.id);

describe('stackFrames', () => {
  it('piles the cards up and keeps the highlights of each step for that step', () => {
    const frames = stackFrames(calls);
    expect(frames).toHaveLength(6);
    expect(frames[0]).toMatchObject({ focus: [], tags: {}, title: null, caption: 'Calls wait' });
    expect(ids(frames[0])).toEqual(['main']);
    expect(ids(frames[1])).toEqual(['main', 'f2']);
    expect(frames[1]).toMatchObject({ focus: ['f2'], title: 'Down' });
    expect(ids(frames[2])).toEqual(['main', 'f2', 'f1']);
    expect(frames[2]).toMatchObject({ focus: [], done: ['f1'], tags: { f1: 'base case' } });
  });

  it('shows a question with its answer before the pop and the new line', () => {
    const frames = stackFrames(calls);
    expect(frames[3]).toMatchObject({ ask: 'What does f(2) return?', title: 'Up', tags: {} });
    expect(ids(frames[3])).toEqual(['main', 'f2', 'f1']);
    expect(frames[3].cards[1].line).toBe('2 * f(1)');
    expect(ids(frames[4])).toEqual(['main', 'f2']);
    expect(frames[4].cards[1]).toEqual({ id: 'f2', text: 'f(2)', line: '2 * 1 = 2' });
    expect(frames[4]).toMatchObject({ ask: 'What does f(2) return?', done: ['f1', 'f2'] });
    // A question with nothing to change is one frame
    expect(frames[5]).toMatchObject({ ask: 'Anything left?', caption: 'main' });
    expect(frames[5].cards).toBe(frames[4].cards);
  });

  it('leaves a card that some id inherits from untouched', () => {
    const frames = stackFrames({
      ...calls,
      cards: [{ id: 'constructor', text: 'x', line: 'kept' }],
      steps: [{ set: {}, caption: 'x' }],
    });
    expect(frames[1].cards[0].line).toBe('kept');
  });

  it("takes a queue's cards from the front", () => {
    const frames = stackFrames({
      type: 'stack',
      caption: 'A line',
      queue: true,
      ends: true,
      cards: [
        { id: 'a', text: 10 },
        { id: 'b', text: 20 },
      ],
      steps: [{ pop: 1, push: [{ id: 'c', text: 30 }], caption: '10 leaves, 30 joins' }],
    });
    expect(ids(frames[1])).toEqual(['b', 'c']);
  });
});
