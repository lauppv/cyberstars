import { describe, it, expect } from 'vitest';
import { diffOutputs, type Piece } from './outputDiff';

// Marked runs in brackets, one string per output.
function show(lines: Piece[][]): string {
  return lines
    .map((line) => line.map((p) => (p.marked ? `[${p.text}]` : p.text)).join(''))
    .join('\n');
}

function both(expected: string, actual: string): [string, string] {
  const diff = diffOutputs(expected, actual);
  if (!diff) throw new Error('no diff');
  return [show(diff.expected), show(diff.actual)];
}

describe('diffOutputs', () => {
  it('marks just the character that differs inside a line', () => {
    expect(both('Player', 'Plauer')).toEqual(['Pla[y]er', 'Pla[u]er']);
    expect(both('Player', 'player')).toEqual(['[P]layer', '[p]layer']);
  });

  it('marks a missing period and a missing space', () => {
    expect(both('Hello, World.', 'Hello, World')).toEqual(['Hello, World[.]', 'Hello, World']);
    expect(both('Hello, World', 'Hello,World')).toEqual(['Hello,[ ]World', 'Hello,World']);
  });

  it('marks an extra space in the student output', () => {
    const [expected, actual] = both('a b', 'a  b');
    expect(expected).toBe('a b');
    expect(actual.replace(/[^[\]]/g, '')).toBe('[]');
    expect(actual.replace(/[[\]]/g, '')).toBe('a  b');
  });

  it('leaves matching lines plain and marks a missing or extra line whole', () => {
    expect(both('a\nb\nc', 'a\nc')).toEqual(['a\n[b]\nc', 'a\nc']);
    expect(both('a', 'a\nb')).toEqual(['a', 'a\n[b]']);
  });

  it('pairs changed lines in order and marks the leftover whole', () => {
    expect(both('x = 1\ny = 2', 'x = 7')).toEqual(['x = [1]\n[y = 2]', 'x = [7]']);
  });

  it('marks everything expected when the program printed nothing', () => {
    expect(both('hi', '')).toEqual(['[hi]', '']);
  });

  it('gives up on outputs too large to diff, or when out of time', () => {
    expect(diffOutputs('a'.repeat(30_000), 'b'.repeat(30_000))).toBeNull();
    expect(diffOutputs('a', 'b', 0)).toBeNull();
  });
});
