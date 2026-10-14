import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuestVisitDTO, VisitRange, VisitStep } from '@cyberstars/shared/visits';
import { getGuestVisits } from '../../services/visitsService';

interface Shown {
  step: VisitStep;
  times: number;
}

// The same button pressed again and again reads as one press with a count, and
// a run of scrolls on one page as the deepest it got.
function collapse(steps: VisitStep[]): Shown[] {
  const shown: Shown[] = [];
  for (const step of steps) {
    const last = shown[shown.length - 1];
    if (
      last &&
      step.kind === 'click' &&
      last.step.kind === 'click' &&
      last.step.target === step.target
    ) {
      last.times++;
    } else if (last && step.kind === 'scroll' && last.step.kind === 'scroll') {
      last.step = step;
    } else {
      shown.push({ step, times: 1 });
    }
  }
  return shown;
}

function Steps({ steps }: { steps: VisitStep[] }) {
  const { t } = useTranslation();
  return (
    <ol className="m-0 p-0 list-none flex flex-wrap gap-x-1.5 gap-y-0.5 text-[12px] leading-relaxed">
      {collapse(steps).map(({ step, times }, i) => (
        <li key={i} className="flex gap-1.5">
          {i > 0 && (
            <span className="text-[var(--text3)]" aria-hidden="true">
              →
            </span>
          )}
          {step.kind === 'page' && <span className="text-[var(--text2)]">{step.target}</span>}
          {step.kind === 'click' && (
            <span className="text-[var(--text)] font-semibold">
              {step.target}
              {times > 1 && ` ×${times}`}
            </span>
          )}
          {step.kind === 'scroll' && (
            <span className="text-[var(--text3)]">
              {t('admin.scrolled', { depth: step.target })}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

// Each guest's day on the site, newest first: where they came from and what
// they did, in order (CYB-66). The source filter offers the places the totals
// above already list.
export function GuestVisits({
  range,
  sources,
  sourceName,
  reload,
}: {
  range: VisitRange;
  sources: string[];
  sourceName: (key: string) => string;
  reload: number;
}) {
  const { t } = useTranslation();
  const [source, setSource] = useState('');
  const [visits, setVisits] = useState<GuestVisitDTO[] | null>(null);
  const [next, setNext] = useState<number | null>(null);

  useEffect(() => {
    getGuestVisits(range, source || undefined)
      .then((page) => {
        setVisits(page.visits);
        setNext(page.next);
      })
      .catch(() => {});
  }, [range, source, reload]);

  function more(before: number) {
    getGuestVisits(range, source || undefined, before)
      .then((page) => {
        setVisits((shown) => [...(shown ?? []), ...page.visits]);
        setNext(page.next);
      })
      .catch(() => {});
  }

  return (
    <div className="pt-4 mt-4 border-t border-[var(--border)]">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="text-[13px] font-semibold m-0">{t('admin.guestVisits')}</h3>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          aria-label={t('admin.sources')}
          className="px-2 py-1 rounded-[var(--radius-sm)] text-[12px] border border-[var(--border)] bg-[var(--glass)] text-[var(--text2)] cursor-pointer"
        >
          <option value="">{t('admin.allSources')}</option>
          {sources.map((key) => (
            <option key={key} value={key}>
              {sourceName(key)}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-0 mb-3 text-[11px] text-[var(--text3)]">{t('admin.guestVisitsHint')}</p>

      {!visits || visits.length === 0 ? (
        <span className="text-[12px] text-[var(--text3)]">{t('admin.noData')}</span>
      ) : (
        <ul className="m-0 p-0 list-none flex flex-col">
          {visits.map((visit) => (
            <li key={visit.id} className="py-2.5 border-b border-[var(--border)] last:border-b-0">
              <div className="text-[11px] text-[var(--text3)] mb-1 tabular-nums">
                {[visit.day, visit.source && sourceName(visit.source), visit.lang]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
              <Steps steps={visit.steps} />
            </li>
          ))}
        </ul>
      )}

      {next !== null && (
        <button
          onClick={() => more(next)}
          className="mt-3 px-2.5 py-1 rounded-[var(--radius-sm)] text-[12px] border border-[var(--border)] bg-transparent text-[var(--text2)] hover:text-[var(--text)] cursor-pointer transition"
        >
          {t('admin.showMore')}
        </button>
      )}
    </div>
  );
}
