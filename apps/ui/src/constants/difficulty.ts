export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFF_FILTERS = ['all', 'easy', 'medium', 'hard'] as const;
export type DifficultyFilter = (typeof DIFF_FILTERS)[number];

// The colours of each difficulty, on a list's numbers, pills and filters: the
// theme's success, warning and error, so Easy is the same green as a solved ✓
const tint = (token: string) => ({
  bg: `color-mix(in srgb, var(${token}) 14%, transparent)`,
  border: `color-mix(in srgb, var(${token}) 50%, transparent)`,
  text: `var(${token})`,
});

export const DIFF_COLORS: Record<Difficulty, { bg: string; border: string; text: string }> = {
  easy: tint('--success'),
  medium: tint('--warning'),
  hard: tint('--error'),
};
