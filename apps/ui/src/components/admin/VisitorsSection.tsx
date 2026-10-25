import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VISIT_RANGES } from '@cyberstars/shared/visits';
import type {
  AdminVisitsDTO,
  PlacementFunnel,
  VisitCount,
  VisitRange,
} from '@cyberstars/shared/visits';
import { getVisits } from '../../services/visitsService';
import { isCounted, setCounted } from '../../services/visitCounting';
import { DailyChart } from './DailyChart';
import { GuestVisits } from './GuestVisits';

// The places CYB-64 posts to, by their own names; any other site shows as its
// domain, which is already readable.
const SOURCE_NAMES: Record<string, string> = {
  google: 'Google',
  bing: 'Bing',
  reddit: 'Reddit',
  hackernews: 'Hacker News',
  devto: 'dev.to',
  github: 'GitHub',
};

// Each range by the months the buttons call it.
const MONTHS: Record<VisitRange, number> = { 30: 1, 90: 3, 182: 6, 364: 12, 728: 24 };

function count(rows: VisitCount[], key: string) {
  return rows.find((r) => r.key === key)?.visitors ?? 0;
}

function Ranked({
  title,
  rows,
  label,
  value,
}: {
  title: string;
  rows: VisitCount[];
  label: (key: string) => string;
  value: (row: VisitCount) => string;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-[12px] text-[var(--text3)] mb-2">{title}</div>
      {rows.length === 0 ? (
        <span className="text-[12px] text-[var(--text3)]">{t('admin.noData')}</span>
      ) : (
        <ul className="flex flex-col gap-1.5 text-[12px]">
          {rows.map((row) => (
            <li key={row.key} className="flex justify-between gap-2">
              <span className="text-[var(--text2)] truncate">{label(row.key)}</span>
              <span className="text-[var(--text3)] tabular-nums shrink-0">{value(row)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// How many guest visits reached each step of the landing page's placement test
// (CYB-68), each bar against the visits that opened it.
function PlacementFunnelTable({ funnel }: { funnel: PlacementFunnel }) {
  const { t } = useTranslation();
  const rows: [label: string, visits: number][] = [
    [t('admin.placementOpened'), funnel.opened],
    [t('admin.placementStarted'), funnel.started],
    ...funnel.answered.map((visits, i): [string, number] => [
      i === funnel.answered.length - 1
        ? t('admin.placementSubmitted')
        : t('admin.placementQuestion', { n: i + 1 }),
      visits,
    ]),
    [t('admin.placementGetStarted'), funnel.getStarted],
  ];
  const most = Math.max(funnel.opened, 1);
  return (
    <div className="pt-4 mt-4 border-t border-[var(--border)]">
      <h3 className="text-[13px] font-semibold m-0 mb-1">{t('admin.placementTest')}</h3>
      <p className="mt-0 mb-3 text-[11px] text-[var(--text3)]">{t('admin.placementHint')}</p>
      <ul className="m-0 p-0 list-none flex flex-col gap-1 text-[12px]">
        {rows.map(([label, visits]) => (
          <li key={label} className="grid grid-cols-[minmax(0,10rem)_1fr_3rem] items-center gap-3">
            <span className="text-[var(--text2)] truncate">{label}</span>
            <span className="h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden">
              <span
                className="block h-full bg-[var(--accent)]"
                style={{ width: `${(visits / most) * 100}%` }}
              />
            </span>
            <span className="text-[var(--text3)] tabular-nums text-right">{visits}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Who visits and where they come from, counted by our own API (CYB-65). It
// loads on its own so the range switch doesn't redo the rest of the page.
export function VisitorsSection({ className, reload }: { className: string; reload: number }) {
  const { t } = useTranslation();
  const [range, setRange] = useState<VisitRange>(VISIT_RANGES[0]);
  const [data, setData] = useState<AdminVisitsDTO | null>(null);
  const [counted, setCountedHere] = useState(isCounted);

  function toggleCounted() {
    setCounted(!counted);
    setCountedHere(!counted);
  }

  useEffect(() => {
    getVisits(range)
      .then(setData)
      .catch(() => {});
  }, [range, reload]);

  const sourceName = (key: string) =>
    SOURCE_NAMES[key] ?? (key === 'direct' || key === 'other' ? t(`admin.source.${key}`) : key);

  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-[14px] font-semibold">{t('admin.visits')}</h2>
        <div className="flex gap-1" role="group" aria-label={t('admin.range')}>
          {VISIT_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-[12px] border cursor-pointer transition ${
                range === r
                  ? 'border-[var(--accent)] text-[var(--text)]'
                  : 'border-[var(--border)] text-[var(--text3)] hover:text-[var(--text2)]'
              }`}
            >
              {t('admin.lastMonths', { count: MONTHS[r] })}
            </button>
          ))}
        </div>
      </div>

      {!data ? (
        <span className="text-[12px] text-[var(--text3)]">{t('admin.noData')}</span>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <DailyChart days={data.days} field="visitors" title={t('admin.visitorsADay')} />
            <DailyChart days={data.days} field="newAccounts" title={t('admin.newAccountsADay')} />
          </div>
          <table className="sr-only">
            <caption>{t('admin.visits')}</caption>
            <thead>
              <tr>
                <th>{t('admin.day')}</th>
                <th>{t('admin.visitorsWord', { count: 2 })}</th>
                <th>{t('admin.viewsWord', { count: 2 })}</th>
                <th>{t('admin.newAccountsWord', { count: 2 })}</th>
              </tr>
            </thead>
            <tbody>
              {data.days.map((d) => (
                <tr key={d.day}>
                  <td>{d.day}</td>
                  <td>{d.visitors}</td>
                  <td>{d.views}</td>
                  <td>{d.newAccounts}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid grid-cols-1 sm:grid-cols-2 @3xl:grid-cols-3 gap-6 mb-4">
            <Ranked
              title={t('admin.topPages')}
              rows={data.pages}
              label={(key) => key}
              value={(row) =>
                `${row.views} ${t('admin.viewsWord', { count: row.views })} · ${row.visitors} ${t('admin.visitorsWord', { count: row.visitors })}`
              }
            />
            <Ranked
              title={t('admin.sources')}
              rows={data.sources}
              label={sourceName}
              value={(row) => `${row.visitors} ${t('admin.visitorsWord', { count: row.visitors })}`}
            />
            <Ranked
              title={t('admin.topClicks')}
              rows={data.clicks}
              label={(key) => key}
              value={(row) =>
                `${row.views} ${t('admin.pressesWord', { count: row.views })} · ${row.visitors} ${t('admin.visitsWord', { count: row.visitors })}`
              }
            />
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text2)]">
            <span>
              {t('admin.guests')} {count(data.auth, 'guest')}
            </span>
            <span>
              {t('admin.signedIn')} {count(data.auth, 'signedIn')}
            </span>
            <span>
              {t('admin.english')} {count(data.lang, 'en')}
            </span>
            <span>
              {t('admin.romanian')} {count(data.lang, 'ro')}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-[var(--text3)]">{t('admin.visitorDays')}</p>

          <PlacementFunnelTable funnel={data.placement} />

          <GuestVisits
            range={range}
            sources={data.sources.map((s) => s.key)}
            sourceName={sourceName}
            reload={reload}
          />
        </>
      )}

      <p className="mt-4 mb-0 text-[11px] text-[var(--text3)]">
        {counted ? t('admin.browserCounted') : t('admin.browserNotCounted')}{' '}
        <button
          onClick={toggleCounted}
          className="p-0 bg-transparent border-none text-[11px] text-[var(--accent)] underline cursor-pointer"
        >
          {counted ? t('admin.stopCounting') : t('admin.countBrowser')}
        </button>
      </p>
    </section>
  );
}
