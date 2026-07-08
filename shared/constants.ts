export function progressPct(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export const MAIN_COURSE_KEYS = ['python', 'java', 'c', 'kotlin'] as const;
export const ALGO_COURSE_KEYS = ['algo-python', 'algo-java', 'algo-c'] as const;
export const ALL_COURSE_KEYS = [...MAIN_COURSE_KEYS, ...ALGO_COURSE_KEYS] as const;

// Terminal courses run in a Linux sandbox, not the /api/code editor pipeline.
export const TERMINAL_COURSE_KEYS = ['linux'] as const;

// Forum categories where only moderators and admins may start threads or reply.
export const RESTRICTED_FORUM_CATEGORIES = new Set(['announcements']);

export function baseLanguage(key: string): string {
  return key.startsWith('algo-') ? key.slice(5) : key;
}
