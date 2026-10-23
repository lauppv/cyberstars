import { describe, it, expect } from 'vitest';
import { settings } from './settings.js';

describe('settings', () => {
  it('returns a required setting and stops on a missing or empty one', () => {
    const read = settings({ SECRET: 's', EMPTY: '' });
    expect(read.required('SECRET')).toBe('s');
    expect(() => read.required('NOPE')).toThrow('Missing required environment variable: NOPE');
    expect(() => read.required('EMPTY')).toThrow('Missing required environment variable: EMPTY');
  });

  it('falls back on an optional setting that is missing or empty', () => {
    const read = settings({ NAME: 'x', EMPTY: '' });
    expect(read.optional('NAME', 'd')).toBe('x');
    expect(read.optional('NOPE', 'd')).toBe('d');
    expect(read.optional('EMPTY', 'd')).toBe('d');
  });

  it('reads a number and falls back when it is missing or not a number', () => {
    const read = settings({ PORT: '9000', BAD: 'abc' });
    expect(read.number('PORT', 1)).toBe(9000);
    expect(read.number('NOPE', 1)).toBe(1);
    expect(read.number('BAD', 1)).toBe(1);
  });

  it('reads process.env by default', () => {
    process.env.SERVER_KIT_SETTING = 'here';
    expect(settings().required('SERVER_KIT_SETTING')).toBe('here');
    delete process.env.SERVER_KIT_SETTING;
  });
});
