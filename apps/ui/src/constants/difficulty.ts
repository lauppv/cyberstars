export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFF_FILTERS = ['all', 'easy', 'medium', 'hard'] as const;
export type DifficultyFilter = (typeof DIFF_FILTERS)[number];

// The colours of each difficulty, on a list's numbers, pills and filters
export const DIFF_COLORS: Record<Difficulty, { bg: string; border: string; text: string }> = {
  easy: { bg: 'rgba(0,214,143,0.12)', border: 'rgba(0,214,143,0.5)', text: 'var(--success)' },
  medium: { bg: 'rgba(255,170,0,0.12)', border: 'rgba(255,170,0,0.5)', text: 'var(--warning)' },
  hard: { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.5)', text: 'var(--error)' },
};
