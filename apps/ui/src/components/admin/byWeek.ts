import type { VisitDay } from '@cyberstars/shared/visits';

// The days added up seven at a time, oldest first, each week named by its first
// day. The ranges charted this way are whole weeks, so none comes out short.
export function byWeek(days: VisitDay[]): VisitDay[] {
  const weeks: VisitDay[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const week = days.slice(i, i + 7);
    const sum = (field: 'visitors' | 'views' | 'newAccounts') =>
      week.reduce((n, d) => n + d[field], 0);
    weeks.push({
      day: week[0].day,
      visitors: sum('visitors'),
      views: sum('views'),
      newAccounts: sum('newAccounts'),
    });
  }
  return weeks;
}
