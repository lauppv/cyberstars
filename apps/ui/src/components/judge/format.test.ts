import { describe, it, expect } from 'vitest';
import type { TFunction } from 'i18next';
import en from '../../i18n/locales/en.json';
import { structureMessage } from './format';

// The first key the locale has, as i18next picks it.
const t = ((keys: string[], vars: Record<string, string | undefined>) => {
  const structure = en.tests.structure as Record<string, Record<string, string>>;
  for (const key of keys) {
    const [, , type, kind] = key.split('.');
    const text = structure[type]?.[kind];
    if (text) return text.replace('{{name}}', vars.name ?? '');
  }
  return keys[keys.length - 1];
}) as unknown as TFunction;

describe('structureMessage', () => {
  it('names the method a recursion rule wants recursive', () => {
    expect(
      structureMessage({ type: 'require', rule: { kind: 'recursion', name: 'open' } }, t),
    ).toBe('Solve it with recursion: open() has to call itself');
    expect(structureMessage({ type: 'require', rule: { kind: 'recursion' } }, t)).toBe(
      'Solve it with recursion: a function that calls itself',
    );
  });

  it('tells the student which Java construct a lesson does without', () => {
    expect(structureMessage({ type: 'forbid', rule: { kind: 'if' } }, t)).toBe("Don't use if here");
  });
});
