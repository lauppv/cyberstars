import { describe, it, expect } from 'vitest';
import { holdConnection } from './ws-connections.js';

describe('holdConnection', () => {
  it('lets an address hold up to the cap, then refuses', () => {
    const held = [1, 2, 3].map(() => holdConnection('203.0.113.1', 3));
    expect(held.every(Boolean)).toBe(true);
    expect(holdConnection('203.0.113.1', 3)).toBeNull();
    held.forEach((release) => release!());
  });

  it('gives the place back when a socket goes', () => {
    const first = holdConnection('203.0.113.2', 1)!;
    expect(holdConnection('203.0.113.2', 1)).toBeNull();
    first();
    const again = holdConnection('203.0.113.2', 1);
    expect(again).not.toBeNull();
    again!();
  });

  it('counts a place given back twice only once', () => {
    const first = holdConnection('203.0.113.3', 2)!;
    const second = holdConnection('203.0.113.3', 2)!;
    first();
    first();
    // The second socket still holds its place, so one more fits and no more
    const third = holdConnection('203.0.113.3', 2);
    expect(third).not.toBeNull();
    expect(holdConnection('203.0.113.3', 2)).toBeNull();
    second();
    third!();
  });

  it('counts each address on its own', () => {
    const a = holdConnection('203.0.113.4', 1)!;
    const b = holdConnection('203.0.113.5', 1);
    expect(b).not.toBeNull();
    a();
    b!();
  });

  it('counts a whole IPv6 block as one address', () => {
    const a = holdConnection('2001:db8:7:1::1', 2)!;
    const b = holdConnection('2001:db8:7:2::99', 2)!;
    expect(holdConnection('2001:db8:7:ff::5', 2)).toBeNull();
    // Another /56 has room of its own
    const other = holdConnection('2001:db8:8::1', 2);
    expect(other).not.toBeNull();
    a();
    b();
    other!();
  });

  it('reads an IPv4 address mapped into IPv6 as that IPv4 address', () => {
    const a = holdConnection('::ffff:203.0.113.6', 1)!;
    expect(holdConnection('203.0.113.6', 1)).toBeNull();
    a();
  });
});
