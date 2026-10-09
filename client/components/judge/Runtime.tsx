import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TestCaseResult } from '../../../shared/tests';
import { formatMs } from './format';

// Within this band the two programs count as equally fast: a few ms of
// container noise shouldn't read as a verdict on the student's code.
const EVEN_BAND = 0.1;
const PLOT_HEIGHT = 140;
const MAX_X_LABELS = 12;

// Ticks at 1, 2, 2.5 or 5 times a power of ten, about three of them.
function niceTop(max: number): { top: number; step: number } {
  if (max <= 0) return { top: 1, step: 1 };
  const rough = max / 3;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough)!;
  return { top: Math.ceil(max / step) * step, step };
}

interface RuntimeProps {
  // Absent for a stored submission, which keeps only the sums.
  cases?: TestCaseResult[];
  runtimeMs?: number | null;
  referenceMs?: number | null;
}

// How long the student's program took next to the reference solution, both
// measured in the same run. Renders nothing when the judge sent no timings.
export function Runtime({ cases = [], runtimeMs, referenceMs }: RuntimeProps) {
  const { t } = useTranslation();
  const paired = cases.filter(
    (c): c is TestCaseResult & { userMs: number; solutionMs: number } =>
      c.userMs !== undefined && c.solutionMs !== undefined,
  );
  const generated = cases
    .filter((c) => c.userMs !== undefined && c.solutionMs === undefined)
    .map((c) => c.userMs!);
  const hasSums = runtimeMs != null && referenceMs != null;
  if (!hasSums && paired.length === 0 && generated.length < 2) return null;

  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-[14px] font-semibold text-[var(--text)]">{t('tests.runtime.title')}</h3>
      {hasSums && <Totals runtimeMs={runtimeMs} referenceMs={referenceMs} count={paired.length} />}
      {paired.length > 0 && <SpeedChart cases={paired} />}
      {generated.length >= 2 && <GeneratedSparkline times={generated} />}
    </section>
  );
}

function Totals({
  runtimeMs,
  referenceMs,
  count,
}: {
  runtimeMs: number;
  referenceMs: number;
  count: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const ratio = referenceMs > 0 ? runtimeMs / referenceMs : null;
  let comparison: string | null = null;
  if (ratio !== null) {
    const fmt = (r: number) => r.toLocaleString(lang, { maximumFractionDigits: 1 });
    if (Math.abs(ratio - 1) <= EVEN_BAND) comparison = t('tests.runtime.even');
    else if (ratio > 1) comparison = t('tests.runtime.slower', { ratio: fmt(ratio) });
    else comparison = t('tests.runtime.faster', { ratio: fmt(1 / ratio) });
  }

  return (
    <div>
      <dl className="grid grid-cols-2 gap-4">
        {[
          { label: t('tests.runtime.yours'), ms: runtimeMs },
          { label: t('tests.runtime.reference'), ms: referenceMs },
        ].map(({ label, ms }) => (
          <div key={label}>
            <dt className="text-[12px] text-[var(--text3)]">{label}</dt>
            <dd className="text-[22px] font-semibold text-[var(--text)]">
              {formatMs(ms, lang)}
              <span className="ml-1 text-[13px] font-normal text-[var(--text3)]">ms</span>
            </dd>
          </div>
        ))}
      </dl>
      {comparison && <p className="mt-2 text-[13px] text-[var(--text2)]">{comparison}</p>}
      {count > 0 && (
        <p className="mt-0.5 text-[12px] text-[var(--text3)]">
          {t('tests.runtime.scope', { count })}
        </p>
      )}
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-2.5 h-2.5 rounded-[2px]"
      style={{ background: color }}
    />
  );
}

// Paired columns per test: the student's time in the accent, the reference
// in a recessive gray, so the eye lands on the student's own bars.
function SpeedChart({
  cases,
}: {
  cases: (TestCaseResult & { userMs: number; solutionMs: number })[];
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [hovered, setHovered] = useState<number | null>(null);
  const { top, step } = niceTop(Math.max(...cases.flatMap((c) => [c.userMs, c.solutionMs])));
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const labelEvery = Math.ceil(cases.length / MAX_X_LABELS);
  const pct = (ms: number) => `${(ms / top) * 100}%`;
  const caption = (c: (typeof cases)[number]) =>
    t('tests.chart.caseTimes', {
      n: c.index + 1,
      user: formatMs(c.userMs, lang),
      ref: formatMs(c.solutionMs, lang),
    });
  const active = hovered === null ? null : cases[hovered];

  return (
    <figure>
      <figcaption className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <span className="text-[12px] text-[var(--text3)]">{t('tests.chart.title')}</span>
        <span className="flex items-center gap-3 text-[12px] text-[var(--text2)]">
          <span className="flex items-center gap-1.5">
            <Swatch color="var(--chart-user)" />
            {t('tests.chart.you')}
          </span>
          <span className="flex items-center gap-1.5">
            <Swatch color="var(--chart-reference)" />
            {t('tests.chart.reference')}
          </span>
        </span>
      </figcaption>

      <div className="grid grid-cols-[auto_1fr] gap-x-2" aria-hidden="true">
        <div className="relative" style={{ height: PLOT_HEIGHT }}>
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 translate-y-1/2 text-[11px] leading-none text-[var(--text3)] tabular-nums whitespace-nowrap"
              style={{ bottom: pct(tick) }}
            >
              {formatMs(tick, lang)} ms
            </span>
          ))}
          {/* Holds the column as wide as its longest label. */}
          <span className="invisible text-[11px] tabular-nums whitespace-nowrap">
            {formatMs(top, lang)} ms
          </span>
        </div>
        <div className="relative" style={{ height: PLOT_HEIGHT }}>
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute left-0 right-0 h-px bg-[var(--border)]"
              style={{ bottom: pct(tick) }}
            />
          ))}
          <div className="absolute inset-0 flex items-end">
            {cases.map((c, i) => (
              <button
                key={c.index}
                type="button"
                tabIndex={-1}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setHovered(i)}
                className={`flex-1 min-w-0 h-full flex items-end justify-center gap-[2px] px-[2px] border-none cursor-default rounded-t-[4px] transition-colors ${hovered === i ? 'bg-[var(--glass)]' : 'bg-transparent'}`}
              >
                <span
                  className="block rounded-t-[4px] bg-[var(--chart-user)]"
                  style={{ height: pct(c.userMs), width: 'min(12px, 40%)' }}
                />
                <span
                  className="block rounded-t-[4px] bg-[var(--chart-reference)]"
                  style={{ height: pct(c.solutionMs), width: 'min(12px, 40%)' }}
                />
              </button>
            ))}
          </div>
        </div>
        <div />
        <div className="flex mt-1.5">
          {cases.map((c, i) => (
            <span
              key={c.index}
              className="flex-1 min-w-0 text-center text-[11px] text-[var(--text3)] tabular-nums"
            >
              {i % labelEvery === 0 ? c.index + 1 : ''}
            </span>
          ))}
        </div>
      </div>

      <p
        className="mt-2 min-h-[18px] text-[12px] text-[var(--text2)] tabular-nums"
        aria-live="polite"
      >
        {active ? caption(active) : ''}
      </p>

      <table className="sr-only">
        <caption>{t('tests.chart.title')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('tests.caseN', { n: '' }).trim()}</th>
            <th scope="col">{t('tests.chart.you')}</th>
            <th scope="col">{t('tests.chart.reference')}</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.index}>
              <th scope="row">{c.index + 1}</th>
              <td>{formatMs(c.userMs, lang)} ms</td>
              <td>{formatMs(c.solutionMs, lang)} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

// Generated tests carry no reference time (their expected output is cached),
// so they get a quiet line of the student's own times: flat is good.
function GeneratedSparkline({ times }: { times: number[] }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const min = Math.min(...times);
  const max = Math.max(...times);
  const span = max - min || 1;
  const points = times.map((ms, i) => `${i},${92 - ((ms - min) / span) * 84}`).join(' ');

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5 text-[12px]">
        <span className="text-[var(--text3)]">
          {t('tests.chart.generated', { count: times.length })}
        </span>
        <span className="text-[var(--text2)] tabular-nums">
          {t('tests.chart.range', { min: formatMs(min, lang), max: formatMs(max, lang) })}
        </span>
      </div>
      <svg
        className="block w-full h-8"
        viewBox={`0 0 ${times.length - 1} 100`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke="var(--chart-generated)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
