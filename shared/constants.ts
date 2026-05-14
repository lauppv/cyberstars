export const XP_PER_LESSON = 15;

// Each level requires progressively more XP: level N needs 50*N XP to advance.
// Total XP to reach level N: 25 * N * (N - 1)
// Level 1→2: 50 XP (~3 lessons), 2→3: 100 XP, 3→4: 150 XP, etc.
export function computeLevel(xp: number): number {
  return Math.floor((1 + Math.sqrt(1 + (4 * xp) / 25)) / 2);
}

export function xpForLevel(level: number): number {
  return 25 * level * (level - 1);
}

export function xpToNextLevel(level: number): number {
  return 50 * level;
}
