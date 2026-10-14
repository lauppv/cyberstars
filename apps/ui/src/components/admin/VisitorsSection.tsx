import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VISIT_RANGES } from '@cyberstars/shared/visits';
import type { AdminVisitsDTO, VisitCount, VisitRange } from '@cyberstars/shared/visits';
import { getVisits } from '../../services/visitsService';
import { DailyChart } from './DailyChart';

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

// Who visits and where they come from, counted by our own API (CYB-65). It
// loads on its own so the 30/90 day switch doesn't redo the rest of the page.
export function VisitorsSection({ className, reload }: { className: string; reload: number }) {
  const { t } = useTranslation();
  const [range, setRange] = useState<VisitRange>(VISIT_RANGES[0]);
  const [data, setData] = useState<AdminVisitsDTO | null>(null);

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
              {t('admin.lastDays', { count: r })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
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
        </>
      )}
    </section>
  );
}
