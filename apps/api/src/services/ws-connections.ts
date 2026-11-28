import { ipKeyGenerator } from 'express-rate-limit';

// The WebSockets each client address holds open (CYB-141). Every one keeps
// memory and a file handle on the server for as long as it stays open, so one
// address may hold only so many, whatever it opens them as: a guest, any
// account, or nothing a browser would send. An IPv6 holder picks any address in
// their block at will, so the block (/56, like the HTTP limiters) is what counts.
const held = new Map<string, number>();

/**
 * Counts one more socket from `ip`, if its address holds fewer than `max`, and
 * hands back what gives the place back once the socket is gone; null past `max`.
 * Giving it back twice counts once.
 */
export function holdConnection(ip: string, max: number): (() => void) | null {
  const key = ipKeyGenerator(ip);
  const count = held.get(key) ?? 0;
  if (count >= max) return null;
  held.set(key, count + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const left = (held.get(key) ?? 1) - 1;
    if (left <= 0) held.delete(key);
    else held.set(key, left);
  };
}
