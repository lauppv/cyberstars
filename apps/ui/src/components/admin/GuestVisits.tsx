import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuestVisitDTO, VisitRange, VisitStep } from '@cyberstars/shared/visits';
import { PLACEMENT_QUESTION_COUNT } from '@cyberstars/shared/placement';
import { getGuestVisits } from '../../services/visitsService';

interface Shown {
  step: VisitStep;
  times: number;
  // In the placement test: how many questions the guest got past
  placement?: number;
}

// How far into the placement test a press says the guest got: past question N
// for its Next, past the last for its Submit.
function placementAnswered(step: VisitStep): number | undefined {
  if (step.kind !== 'click') return undefined;
  if (step.target === 'placement-submit') return PLACEMENT_QUESTION_COUNT;
  const next = /^placement-q(\d+)$/.exec(step.target);
  return next ? Number(next[1]) : undefined;
}

// The same button pressed again and again reads as one press with a count, a
// run of scrolls on one page as the deepest it got, and a run through the
// placement test's questions as how far it went.
function collapse(steps: VisitStep[]): Shown[] {
  const shown: Shown[] = [];
  for (const step of steps) {
    const last = shown[shown.length - 1];
    const answered = placementAnswered(step);
    if (answered !== undefined) {
      if (last?.placement !== undefined) last.placement = Math.max(last.placement, answered);
      else shown.push({ step, times: 1, placement: answered });
    } else if (
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
      {collapse(steps).map(({ step, times, placement }, i) => (
        <li key={i} className="flex gap-1.5">
          {i > 0 && (
            <span className="text-[var(--text3)]" aria-hidden="true">
              →
            </span>
          )}
          {step.kind === 'page' && <span className="text-[var(--text2)]">{step.target}</span>}
          {placement !== undefined && (
            <span className="text-[var(--accent)] font-semibold">
              {t('admin.placementProgress', { n: placement, total: PLACEMENT_QUESTION_COUNT })}
            </span>
          )}
          {step.kind === 'click' && placement === undefined && (
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

// When the visit started, in Romania's time like its day: 14:05.
function startTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Bucharest',
  });
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
  const [loadingMore, setLoadingMore] = useState(false);
  // Which list is current: an answer for an older range or source is dropped.
  const asked = useRef(0);

  useEffect(() => {
    const query = ++asked.current;
    getGuestVisits(range, source || undefined)
      .then((page) => {
        if (query !== asked.current) return;
        setVisits(page.visits);
        setNext(page.next);
      })
      .catch(() => {});
  }, [range, source, reload]);

  // A source picked on another range or before a refresh may have left the top
  // ten; it stays an option so the filter still shows what it's filtering by.
  const options = source && !sources.includes(source) ? [...sources, source] : sources;

  function more(before: number) {
    const query = asked.current;
    setLoadingMore(true);
    getGuestVisits(range, source || undefined, before)
      .then((page) => {
        if (query !== asked.current) return;
        setVisits((shown) => [...(shown ?? []), ...page.visits]);
        setNext(page.next);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
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
          {options.map((key) => (
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
                {[
                  visit.day,
                  visit.startedAt && startTime(visit.startedAt),
                  visit.source && sourceName(visit.source),
                  visit.lang,
                ]
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
          disabled={loadingMore}
          className="mt-3 px-2.5 py-1 rounded-[var(--radius-sm)] text-[12px] border border-[var(--border)] bg-transparent text-[var(--text2)] hover:text-[var(--text)] cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {t('admin.showMore')}
        </button>
      )}
    </div>
  );
}
