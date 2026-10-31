import { describe, it, expect } from 'vitest';
import { signupSchema } from './auth.schema.js';

const signup = (name: string) => ({ name, email: 'ada@test.com', password: 'secret123' });

describe('signupSchema name', () => {
  it.each(['Adam', 'Ana Maria', 'Stefan Razvan', 'dev_42.x-y', '*Star*', 'Al Bo'])(
    'takes %s',
    (name) => {
      expect(signupSchema.safeParse(signup(name)).success).toBe(true);
    },
  );

  it('trims the spaces around it', () => {
    expect(signupSchema.parse(signup('  Adam  ')).name).toBe('Adam');
  });

  it.each([
    ['two characters and two spaces', 'dy  '],
    ['three characters', 'Ion'],
    ['three characters between spaces', 'a b c'],
  ])('refuses %s', (_, name) => {
    const result = signupSchema.safeParse(signup(name));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      'Name is too short, must have at least 4 characters besides spaces',
    );
  });

  it('asks for a name when it is only spaces', () => {
    const result = signupSchema.safeParse(signup('   '));
    expect(result.error?.issues[0].message).toBe('Name is required');
  });

  it.each([
    ['Chinese characters', '睡不醒的小辉'],
    ['Romanian diacritics', 'Ștefan Răzvan'],
    ['German umlauts', 'Jürgen Müller'],
    ['Hungarian accents', 'Erdős Gergő'],
    ['an emoji', 'Ada 🚀'],
    ['an apostrophe', "O'Brien"],
    ['two spaces in a row', 'Ana  Maria'],
    ['a tab', 'Ana\tMaria'],
    ['markup', '<b>Ada</b>'],
  ])('refuses %s', (_, name) => {
    const result = signupSchema.safeParse(signup(name));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Name has invalid characters');
  });
});
