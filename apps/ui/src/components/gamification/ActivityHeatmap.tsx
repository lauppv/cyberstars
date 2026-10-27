import { useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { ActivityKind } from '@cyberstars/shared/profile';
import { localDateStr, type DayCounts } from './heatmap-utils';

// Six purple steps, from an empty day to the brightest. Index 0 is a day
// without activity, 1–5 are increasing activity.
const HEATMAP_COLORS = [
  'rgba(120,120,140,0.25)',
  '#3b2a6e',
  '#553aa3',
  '#7451d6',
  '#9d7cf4',
  '#cbb6ff',
];

// The order a day's tooltip names them in
const KINDS: ActivityKind[] = ['lesson', 'algo', 'recap'];

interface HeatmapDay {
  date: string;
  level: number;
  count: number;
  counts: DayCounts;
  // Before the period or after today: drawn as an empty slot, not a day
  outside: boolean;
  isFuture: boolean;
}

// Like GitHub, the steps follow the student's own busiest day in the period
// rather than fixed counts: the brightest purple is that day, whether it had
// 6 lessons or 100, and every other day gets its share of it
function countToLevel(count: number, max: number): number {
  if (count === 0) return 0;
  return Math.ceil((count / max) * (HEATMAP_COLORS.length - 1));
}

// Like "2 lessons · 1 recap", each kind done that day
function dayLabel(t: TFunction, counts: DayCounts): string {
  const parts = KINDS.filter((k) => counts[k]).map((k) =>
    t(`home.activityKinds.${k}`, { count: counts[k] }),
  );
  return parts.length ? parts.join(' · ') : t('home.noActivity');
}

// The weeks from the one holding the day `months` ago to the current one,
// Monday to Sunday
function buildHeatmapData(
  activityCounts: Record<string, DayCounts>,
  months: number,
): HeatmapDay[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = localDateStr(today);

  const first = new Date(today);
  first.setMonth(first.getMonth() - months);
  first.setDate(first.getDate() + 1);
  const firstStr = localDateStr(first);

  const start = new Date(first);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  const todayDow = today.getDay();
  const endSunday = new Date(today);
  endSunday.setDate(endSunday.getDate() + (todayDow === 0 ? 0 : 7 - todayDow));
  const endStr = localDateStr(endSunday);

  const days: Omit<HeatmapDay, 'level'>[] = [];
  for (const current = new Date(start); localDateStr(current) <= endStr; ) {
    const dateStr = localDateStr(current);
    const isFuture = dateStr > todayStr;
    const outside = isFuture || dateStr < firstStr;
    const counts = outside ? {} : (activityCounts[dateStr] ?? {});
    const count = KINDS.reduce((sum, k) => sum + (counts[k] ?? 0), 0);
    days.push({ date: dateStr, count, counts, outside, isFuture });
    current.setDate(current.getDate() + 1);
  }

  const max = Math.max(0, ...days.map((d) => d.count));
  const data: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    data.push(days.slice(i, i + 7).map((d) => ({ ...d, level: countToLevel(d.count, max) })));
  }
  return data;
}

function getMonthLabels(data: HeatmapDay[][], locale: string): { month: string; col: number }[] {
  const labels: { month: string; col: number }[] = [];
  let lastMonth = -1;
  data.forEach((week, i) => {
    const d = new Date(week[0].date);
    const m = d.getMonth();
    if (m !== lastMonth) {
      labels.push({ month: d.toLocaleString(locale, { month: 'short' }), col: i });
      lastMonth = m;
    }
  });
  return labels;
}

export function ActivityHeatmap({
  activityCounts,
  months = 3,
}: {
  activityCounts: Record<string, DayCounts>;
  months?: number;
}) {
  const { t, i18n } = useTranslation();
  const data = useMemo(() => buildHeatmapData(activityCounts, months), [activityCounts, months]);
  const weeks = data.length;
  const monthLabels = useMemo(() => getMonthLabels(data, i18n.language), [data, i18n.language]);
  const totalActive = data.flat().filter((d) => d.level > 0).length;
  const colWidth = 19;

  return (
    <div className="p-5 panel rounded-[var(--radius)]">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[11px] font-semibold tracking-[1px] text-[var(--text3)]">
          {t('home.activity')}
        </h3>
        <span className="text-xs text-[var(--text2)]">
          <Trans
            i18nKey="home.activeDays"
            values={{ count: totalActive, period: t('home.lastMonths', { count: months }) }}
            components={[<strong className="text-[var(--text)] font-semibold" />]}
          />
        </span>
      </div>

      {/* Month labels */}
      <div className="flex" style={{ paddingLeft: 30 }}>
        {monthLabels.map((m, i) => {
          const nextCol = monthLabels[i + 1]?.col ?? weeks;
          return (
            <div
              key={i}
              className="text-[9px] text-[var(--text3)] font-medium"
              style={{ width: (nextCol - m.col) * colWidth }}
            >
              {m.month}
            </div>
          );
        })}
      </div>

      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1.5 shrink-0">
          {['', t('home.dayTue'), '', t('home.dayThu'), '', t('home.daySat'), ''].map(
            (label, i) => (
              <div
                key={i}
                className="h-4 flex items-center text-[9px] text-[var(--text3)] font-medium"
              >
                {label}
              </div>
            ),
          )}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-1">
          {data.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-4 h-4 rounded-[3px] transition-all hover:outline hover:outline-2 hover:outline-[var(--accent)] hover:outline-offset-1"
                  style={{
                    background: day.outside ? 'transparent' : HEATMAP_COLORS[day.level],
                    border: day.isFuture ? '1px dashed rgba(102,102,128,0.15)' : 'none',
                    visibility: day.outside && !day.isFuture ? 'hidden' : undefined,
                  }}
                  title={`${new Date(`${day.date}T00:00`).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}: ${dayLabel(t, day.counts)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-2.5">
        <span className="text-[10px] text-[var(--text3)]">{t('home.less')}</span>
        <div className="flex gap-[3px]">
          {HEATMAP_COLORS.map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
          ))}
        </div>
        <span className="text-[10px] text-[var(--text3)]">{t('home.more')}</span>
      </div>
    </div>
  );
}
