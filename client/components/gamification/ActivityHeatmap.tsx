import { useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { localDateStr } from './heatmap-utils';

// GitHub-style green scale — reads far better over the dark cosmos than purple,
// which blended into the accent-tinted panels. Index 0 is the empty/no-activity
// cell; 1–3 are increasing activity.
const HEATMAP_COLORS = ['rgba(120,120,140,0.25)', '#0e6b3a', '#1f9d54', '#39d353'];

interface HeatmapDay {
  date: string;
  level: number;
  count: number;
  isFuture: boolean;
}

function countToLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
}

function buildHeatmapData(activityCounts: Record<string, number>, weeks: number): HeatmapDay[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = localDateStr(today);

  const todayDow = today.getDay();
  const endSunday = new Date(today);
  endSunday.setDate(endSunday.getDate() + (todayDow === 0 ? 0 : 7 - todayDow));

  const start = new Date(endSunday);
  start.setDate(start.getDate() - weeks * 7 + 1);

  const data: HeatmapDay[][] = [];
  const current = new Date(start);
  for (let w = 0; w < weeks; w++) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = localDateStr(current);
      const isFuture = dateStr > todayStr;
      const count = isFuture ? 0 : (activityCounts[dateStr] ?? 0);
      const level = countToLevel(count);
      week.push({ date: dateStr, level, count, isFuture });
      current.setDate(current.getDate() + 1);
    }
    data.push(week);
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
  weeks = 20,
}: {
  activityCounts: Record<string, number>;
  weeks?: number;
}) {
  const { t, i18n } = useTranslation();
  const data = useMemo(() => buildHeatmapData(activityCounts, weeks), [activityCounts, weeks]);
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
            values={{ count: totalActive, weeks }}
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
                    background: day.isFuture ? 'transparent' : HEATMAP_COLORS[day.level],
                    border: day.isFuture ? '1px dashed rgba(102,102,128,0.15)' : 'none',
                  }}
                  title={`${day.date}: ${day.count === 0 ? t('home.noActivity') : t('home.lessonsCompleted', { count: day.count })}`}
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
