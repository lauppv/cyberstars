import { describe, it, expect } from 'vitest';
import { parseVisual } from './parseVisual';

const card = (id: string, line?: string) => ({ id, text: `${id}()`, ...(line && { line }) });

const visual = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'stack',
    caption: 'Calls wait',
    steps: [{ push: [card('a', 'a * ?')], caption: 'a runs' }],
    ...overrides,
  });

// A stack of a and b, then the step given
const after = (s: Record<string, unknown>) =>
  parseVisual(
    visual({
      cards: [card('a'), card('b', 'b * ?')],
      steps: [{ caption: 'x', ...s }],
    }),
  );

describe('parseVisual, stack', () => {
  it('reads the cards it starts with and every part of a step', () => {
    expect(
      parseVisual(
        visual({
          cards: [{ id: 'v10', text: 10 }],
          steps: [
            {
              title: 'Down',
              ask: 'Who runs?',
              push: [card('a', 'a * ?'), card('b')],
              focus: ['b'],
              done: ['v10'],
              tags: { b: 'base case' },
              caption: 'Two calls',
            },
            { pop: 1, set: { a: 'a * 2 = 2' }, done: ['b', 'a'], caption: 'b hands 2 down' },
          ],
        }),
      ),
    ).toEqual({
      type: 'stack',
      caption: 'Calls wait',
      cards: [{ id: 'v10', text: 10 }],
      steps: [
        {
          title: 'Down',
          ask: 'Who runs?',
          push: [
            { id: 'a', text: 'a()', line: 'a * ?' },
            { id: 'b', text: 'b()' },
          ],
          focus: ['b'],
          done: ['v10'],
          tags: { b: 'base case' },
          caption: 'Two calls',
        },
        { pop: 1, set: { a: 'a * 2 = 2' }, done: ['b', 'a'], caption: 'b hands 2 down' },
      ],
    });
  });

  it('starts empty without cards, or with an empty list, and keeps an id', () => {
    expect(parseVisual(visual())).toMatchObject({ cards: [] });
    expect(parseVisual(visual({ cards: [], id: 'calls' }))).toMatchObject({
      cards: [],
      id: 'calls',
    });
  });

  it('pops from the top, so a later step names only the cards left', () => {
    expect(after({ pop: 2 })).not.toBeNull();
    expect(after({ pop: 3 })).toBeNull();
    expect(after({ pop: 0 })).toBeNull();
    expect(after({ pop: 1.5 })).toBeNull();
    expect(
      parseVisual(
        visual({
          cards: [card('a'), card('b')],
          steps: [
            { pop: 1, caption: 'b goes' },
            { set: { b: 'gone' }, caption: 'x' },
          ],
        }),
      ),
    ).toBeNull();
  });

  it('changes the line of a card still on the stack, not of one the step pops', () => {
    expect(after({ set: { a: 'a * 1' } })).not.toBeNull();
    expect(after({ pop: 1, set: { b: 'b * 1' } })).toBeNull();
    expect(after({ set: { c: 'c' } })).toBeNull();
    expect(after({ set: {} })).toBeNull();
    expect(after({ set: { a: ' ' } })).toBeNull();
    expect(after({ set: ['a'] })).toBeNull();
  });

  it('lights or tags a card the step pops, as it leaves, but not one that was never there', () => {
    expect(after({ pop: 1, done: ['b'], tags: { b: 'done' } })).not.toBeNull();
    expect(after({ push: [card('c')], focus: ['c'] })).not.toBeNull();
    expect(after({ focus: ['c'] })).toBeNull();
    expect(after({ focus: [] })).toBeNull();
    expect(after({ focus: ['a', 'a'] })).toBeNull();
    expect(after({ focus: ['a'], done: ['a'] })).toBeNull();
    expect(after({ tags: { c: 'x' } })).toBeNull();
    expect(after({ tags: { a: '' } })).toBeNull();
    expect(after({ tags: {} })).toBeNull();
  });

  it('never gives an id twice, and keeps the pile to seven cards', () => {
    expect(after({ push: [card('a')] })).toBeNull();
    expect(after({ pop: 1, push: [card('b')] })).toBeNull();
    expect(after({ push: [card('c'), card('c')] })).toBeNull();
    const five = ['c', 'd', 'e', 'f', 'g'].map((id) => card(id));
    expect(after({ push: five })).not.toBeNull();
    expect(after({ push: [...five, card('h')] })).toBeNull();
    const eight = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((id) => card(id));
    expect(parseVisual(visual({ cards: eight }))).toBeNull();
  });

  it('refuses a card without a proper id or text, or with an empty line', () => {
    for (const bad of [
      { id: '1a', text: 'x' },
      { id: 'a b', text: 'x' },
      { text: 'x' },
      { id: 'a' },
      { id: 'a', text: ' ' },
      { id: 'a', text: Infinity },
      { id: 'a', text: 'x', line: '' },
      'a',
    ]) {
      expect(parseVisual(visual({ cards: [bad] }))).toBeNull();
    }
    expect(after({ push: [] })).toBeNull();
    expect(parseVisual(visual({ cards: 'a' }))).toBeNull();
  });

  it('wants a caption, steps, and words where words go', () => {
    expect(parseVisual(visual({ caption: '' }))).toBeNull();
    expect(parseVisual(visual({ steps: [] }))).toBeNull();
    expect(parseVisual(visual({ steps: 'x' }))).toBeNull();
    expect(parseVisual(visual({ steps: [{ push: [card('a')] }] }))).toBeNull();
    expect(parseVisual(visual({ steps: ['x'] }))).toBeNull();
    expect(after({ title: '' })).toBeNull();
    expect(after({ ask: 3 })).toBeNull();
  });
});
