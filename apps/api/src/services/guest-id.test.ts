import { describe, it, expect } from 'vitest';
import { guestKey, isGuestId } from './guest-id.js';

const ID = '3f2c8a4e-9b1d-4c7a-8e5f-0a6b2d9c1e74';

describe('isGuestId', () => {
  it('accepts the UUID the server hands out, in either case', () => {
    expect(isGuestId(crypto.randomUUID())).toBe(true);
    expect(isGuestId(ID.toUpperCase())).toBe(true);
  });

  it('refuses anything else a client can send', () => {
    for (const value of ['user:42', 'guest-abc', '', `${ID}x`, ` ${ID}`, undefined, 42]) {
      expect(isGuestId(value)).toBe(false);
    }
  });
});

describe('guestKey', () => {
  it('keys a valid id as guest:<id>', () => {
    expect(guestKey(ID)).toBe(`guest:${ID}`);
  });

  it('gives no key for a missing or made-up id', () => {
    expect(guestKey(undefined)).toBeNull();
    expect(guestKey('user:42')).toBeNull();
  });
});
