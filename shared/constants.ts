export function xpForLesson(position: number): number {
  return 10 + position;
}

export function progressPct(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export const MAIN_COURSE_KEYS = ["python", "java", "c"] as const;
export function computeLevel(xp: number): number {
  return Math.floor((1 + Math.sqrt(1 + (4 * xp) / 25)) / 2);
}

export function xpForLevel(level: number): number {
  return 25 * level * (level - 1);
}

export function xpToNextLevel(level: number): number {
  return 50 * level;
}
