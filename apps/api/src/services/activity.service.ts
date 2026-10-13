// Streak = consecutive days (ending at the most recent activity day) with at
// least one completed lesson. UTC-based day boundaries so timezone drift
// doesn't split a single session across two calendar days. Extracted so both
// the self activity endpoint and the public profile compute it identically.

const MS_PER_DAY = 86_400_000;

function utcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function computeStreak(rows: { completedAt: Date | null }[]): number {
  const days = new Set<number>();
  for (const r of rows) {
    if (r.completedAt) days.add(utcDay(r.completedAt));
  }
  if (days.size === 0) return 0;

  const sortedDays = [...days].sort((a, b) => b - a);
  const today = utcDay(new Date());
  const mostRecent = sortedDays[0];
  // Only count if the last activity day is today or yesterday; an older gap
  // means the streak is broken (0).
  if (mostRecent !== today && mostRecent !== today - MS_PER_DAY) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === sortedDays[i - 1] - MS_PER_DAY) streak++;
    else break;
  }
  return streak;
}
