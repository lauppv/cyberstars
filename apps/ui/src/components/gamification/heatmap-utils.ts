import type { ActivityItem, ActivityKind } from '@cyberstars/shared/profile';

// What was done on one day, by kind
export type DayCounts = Partial<Record<ActivityKind, number>>;

// Local calendar day as YYYY-MM-DD. Bucketing on the client's own timezone keeps
// a user's own heatmap and their public-profile heatmap identical.
export function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Count what was done per local day, each kind on its own
export function bucketByLocalDay(items: ActivityItem[]): Record<string, DayCounts> {
  const counts: Record<string, DayCounts> = {};
  for (const { at, kind } of items) {
    const day = (counts[localDateStr(new Date(at))] ??= {});
    day[kind] = (day[kind] ?? 0) + 1;
  }
  return counts;
}
