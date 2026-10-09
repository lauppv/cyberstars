// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { getReference, putReference, referenceKey } from './reference-cache.js';

const PARTS = {
  courseKey: 'python',
  lang: 'en',
  slug: 'loops',
  solutionCode: 'print(1)',
  testCase: { generated: true, stdin: '3\n' },
  comparator: 'trimmed' as const,
};

describe('referenceKey', () => {
  it('is stable for the same parts and changes with any of them', () => {
    const key = referenceKey(PARTS);
    expect(referenceKey({ ...PARTS })).toBe(key);
    expect(key).toMatch(/^[0-9a-f]{64}$/);
    const variants = [
      { courseKey: 'algo-python' },
      { lang: 'ro' },
      { slug: 'other' },
      { solutionCode: 'print(2)' },
      { testCase: { generated: true, stdin: '4\n' } },
      { comparator: 'exact' as const },
    ];
    for (const change of variants) expect(referenceKey({ ...PARTS, ...change })).not.toBe(key);
  });
});

describe('reference cache', () => {
  it('returns what was stored and misses unknown keys', () => {
    putReference('k-hit', 'out\n');
    expect(getReference('k-hit')).toBe('out\n');
    expect(getReference('k-miss')).toBeUndefined();
  });

  it('replaces an entry stored again under the same key', () => {
    putReference('k-again', 'a');
    putReference('k-again', 'bb');
    expect(getReference('k-again')).toBe('bb');
  });

  it('evicts the least recently used entries past 4096 entries', () => {
    putReference('lru-0', 'x');
    putReference('lru-1', 'x');
    // Reading lru-0 makes lru-1 the oldest of the two.
    getReference('lru-0');
    for (let i = 0; i < 4096; i++) putReference(`fill-${i}`, 'x');
    expect(getReference('lru-1')).toBeUndefined();
    expect(getReference('fill-4095')).toBe('x');
  });

  it('evicts by total size and refuses an output larger than the whole budget', () => {
    const mb = 'y'.repeat(1024 * 1024);
    for (let i = 0; i < 5; i++) putReference(`big-${i}`, mb);
    // 5 MB stored against a 4 MB budget: the oldest entries go first (the
    // small ones above, then the first big one).
    expect(getReference('fill-4095')).toBeUndefined();
    expect(getReference('big-0')).toBeUndefined();
    expect(getReference('big-1')).toBe(mb);
    expect(getReference('big-4')).toBe(mb);

    putReference('huge', 'z'.repeat(4 * 1024 * 1024 + 1));
    expect(getReference('huge')).toBeUndefined();
    expect(getReference('big-4')).toBe(mb);
  });
});
