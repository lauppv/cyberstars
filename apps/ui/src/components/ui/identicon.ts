import { minidenticon } from 'minidenticons';

// The library's own hash gives many short numeric seeds the same pattern
// (296 different ones for ids 1-500), so the seed goes through FNV-1a with a
// final mix instead, which gives every one of them its own.
function hash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  // minidenticon draws only from the 15 lowest bits, so when they are all 0
  // (id 14026 is the first) it would draw nothing. Light the centre cell.
  if ((h & 0x7fff) === 0) h |= 1 << 12;
  return h >>> 0;
}

// Saturation and lightness picked to read on the dark --surface2 circle.
export function identiconUri(userId: number): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(String(userId), 70, 62, hash))}`;
}
