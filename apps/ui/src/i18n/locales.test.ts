import { describe, it, expect } from 'vitest';
import en from './locales/en.json';
import ro from './locales/ro.json';

function flatten(tree: unknown, prefix = ''): string[] {
  return Object.entries(tree as object).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? flatten(value, `${prefix}${key}.`)
      : [prefix + key],
  );
}

const PLURAL = /_(one|few|other)$/;
const plurals = (keys: string[]) =>
  new Set(keys.filter((k) => PLURAL.test(k)).map((k) => k.replace(PLURAL, '')));

describe('locales', () => {
  // Romanian counts in three forms (1, 0 and 2-19, 20 and up); a missing one
  // makes i18next fall back to English for those counts
  it('gives every counted Romanian text its one, few and other forms', () => {
    const keys = flatten(ro);
    const missing = [...plurals(keys)].flatMap((base) =>
      ['one', 'few', 'other'].map((f) => `${base}_${f}`).filter((k) => !keys.includes(k)),
    );
    expect(missing).toEqual([]);
  });

  it('counts in Romanian every text English counts', () => {
    const roKeys = flatten(ro);
    const missing = [...plurals(flatten(en))].filter(
      (base) => !roKeys.includes(`${base}_other`) && !roKeys.includes(base),
    );
    expect(missing).toEqual([]);
  });
});
