import type { ActivityItem, ActivityKind } from '@cyberstars/shared/profile';

// Streak = consecutive days (ending at the most recent activity day) with at
// least one lesson, algorithm or Laniakea test done. UTC-based day boundaries so
// timezone drift doesn't split a single session across two calendar days.
// Extracted so both the self activity endpoint and the public profile compute
// it identically.

const MS_PER_DAY = 86_400_000;
// A little over the heatmap's 20-week span, so days near the left edge still
// fill in.
const HEATMAP_WINDOW_DAYS = 150;

export interface Done {
  at: Date;
  kind: ActivityKind;
}

// Every lesson and algorithm completed and every Laniakea test that moved its planet
export function listDone(
  lessons: { courseKey: string; completedAt: Date | null }[],
  passes: Date[],
): Done[] {
  const done: Done[] = passes.map((at) => ({ at, kind: 'recap' }));
  for (const l of lessons) {
    if (!l.completedAt) continue;
    done.push({ at: l.completedAt, kind: l.courseKey.startsWith('algo-') ? 'algo' : 'lesson' });
  }
  return done;
}

// Only the window the heatmap draws, to bound the payload. The client buckets
// these by its own local day.
export function recentActivity(done: Done[], now = new Date()): ActivityItem[] {
  const cutoff = now.getTime() - HEATMAP_WINDOW_DAYS * MS_PER_DAY;
  return done
    .filter((d) => d.at.getTime() >= cutoff)
    .map((d) => ({ at: d.at.toISOString(), kind: d.kind }));
}

function utcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function computeStreak(done: { at: Date }[]): number {
  const days = new Set<number>();
  for (const d of done) days.add(utcDay(d.at));
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
