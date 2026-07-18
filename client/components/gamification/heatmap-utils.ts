// Local calendar day as YYYY-MM-DD. Bucketing on the client's own timezone keeps
// a user's own heatmap and their public-profile heatmap identical.
export function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Count completed-lesson timestamps per local day.
export function bucketByLocalDay(timestamps: (string | Date)[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ts of timestamps) {
    const day = localDateStr(new Date(ts));
    counts[day] = (counts[day] ?? 0) + 1;
  }
  return counts;
}
