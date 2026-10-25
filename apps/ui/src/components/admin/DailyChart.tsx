import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { VisitDay } from '@cyberstars/shared/visits';
import { axisTicks } from './axisTicks';

const H = 150;
const PAD = { top: 12, right: 12, bottom: 22, left: 30 };
const PLOT_H = H - PAD.top - PAD.bottom;

// The chart is drawn at its real width, so the axis text stays 10px on a phone
// instead of shrinking with a scaled viewBox.
function useWidth(fallback: number) {
  const ref = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

// A week's day comes with its year, since the weekly ranges span a year or two.
function shortDay(day: string, lang: string, withYear = false) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString(lang, {
    day: 'numeric',
    month: 'short',
    ...(withYear && { year: 'numeric' }),
  });
}

// One series a day (or a week, with weekly) over the range, as a 2px line over
// a faint wash. The pointer or the arrow keys pick a point, and the readout
// shows both visitors and new accounts for it, whichever chart you're on.
export function DailyChart({
  days,
  field,
  title,
  weekly = false,
}: {
  days: VisitDay[];
  field: 'visitors' | 'newAccounts';
  title: string;
  weekly?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<number | null>(null);
  const [ref, W] = useWidth(440);
  const PLOT_W = W - PAD.left - PAD.right;

  const ticks = axisTicks(Math.max(...days.map((d) => d[field])));
  const top = ticks[ticks.length - 1];
  const x = (i: number) => PAD.left + (days.length > 1 ? (i / (days.length - 1)) * PLOT_W : 0);
  const y = (v: number) => PAD.top + PLOT_H - (v / top) * PLOT_H;
  const points = days.map((d, i) => `${x(i)},${y(d[field])}`).join(' ');
  const area = `${x(0)},${y(0)} ${points} ${x(days.length - 1)},${y(0)}`;
  const last = days.length - 1;

  const pick = (e: PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const share = box.width ? (e.clientX - box.left) / box.width : 0;
    setActive(Math.min(last, Math.max(0, Math.round(share * last))));
  };
  const keys = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const from = active ?? last;
    setActive(Math.min(last, Math.max(0, from + (e.key === 'ArrowLeft' ? -1 : 1))));
  };

  const shown = active === null ? null : days[active];

  return (
    <figure className="relative m-0" ref={ref}>
      <figcaption className="text-[12px] text-[var(--text3)] mb-2">{title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-[var(--radius-sm)]"
        role="img"
        aria-label={title}
        tabIndex={0}
        onKeyDown={keys}
        onBlur={() => setActive(null)}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="var(--text3)"
            >
              {tick}
            </text>
          </g>
        ))}
        {[0, last].map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 6}
            textAnchor={i === 0 ? 'start' : 'end'}
            fontSize={10}
            fill="var(--text3)"
          >
            {shortDay(days[i].day, i18n.language, weekly)}
          </text>
        ))}
        <polygon points={area} fill="var(--accent)" fillOpacity={0.1} />
        <polyline
          points={points}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {shown && active !== null && (
          <line
            x1={x(active)}
            x2={x(active)}
            y1={PAD.top}
            y2={PAD.top + PLOT_H}
            stroke="var(--text3)"
            strokeWidth={1}
          />
        )}
        <circle
          cx={x(active ?? last)}
          cy={y(days[active ?? last][field])}
          r={4}
          fill="var(--accent)"
          stroke="var(--panel-bg)"
          strokeWidth={2}
        />
        <rect
          x={PAD.left}
          y={0}
          width={PLOT_W}
          height={H}
          fill="transparent"
          onPointerMove={pick}
          onPointerLeave={() => setActive(null)}
        />
      </svg>
      {shown && active !== null && (
        <div
          className="absolute top-6 px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--popover)] border border-[var(--border)] text-[11px] pointer-events-none whitespace-nowrap shadow-sm"
          style={{
            left: `${(x(active) / W) * 100}%`,
            transform: active > last / 2 ? 'translateX(calc(-100% - 8px))' : 'translateX(8px)',
          }}
          role="status"
        >
          <div className="text-[var(--text3)] mb-0.5">
            {weekly
              ? t('admin.weekOf', { day: shortDay(shown.day, i18n.language, true) })
              : shortDay(shown.day, i18n.language)}
          </div>
          <div>
            <strong className="tabular-nums">{shown.visitors}</strong>{' '}
            <span className="text-[var(--text2)]">
              {t('admin.visitorsWord', { count: shown.visitors })}
            </span>
          </div>
          <div>
            <strong className="tabular-nums">{shown.newAccounts}</strong>{' '}
            <span className="text-[var(--text2)]">
              {t('admin.newAccountsWord', { count: shown.newAccounts })}
            </span>
          </div>
        </div>
      )}
    </figure>
  );
}
