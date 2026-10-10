import { useTranslation } from 'react-i18next';
import { formatMs } from './format';

// Within this band the two programs count as equally fast: a few percent of
// noise shouldn't read as a verdict on the student's code.
const EVEN_BAND = 0.1;

interface RuntimeProps {
  runtimeMs?: number | null;
  referenceMs?: number | null;
}

// How long the student's code ran on the load test next to our solution, both
// timed in the same run as CPU time of the code alone. Renders nothing when
// the judge sent no runtime (no load test, or the run never passed it).
export function Runtime({ runtimeMs, referenceMs }: RuntimeProps) {
  const { t, i18n } = useTranslation();
  if (runtimeMs == null || referenceMs == null) return null;
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
    <section className="flex flex-col gap-4">
      <h3 className="text-[14px] font-semibold text-[var(--text)]">{t('tests.runtime.title')}</h3>
      {/* Bottom-aligned, so the two times sit on one line even when the longer
          label wraps. */}
      <dl className="grid grid-cols-2 items-end gap-4">
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
      {comparison && <p className="-mt-2 text-[13px] text-[var(--text2)]">{comparison}</p>}
    </section>
  );
}
