import { useState, useEffect, useCallback, useId } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCurriculum } from '../context/CurriculumContext';
import i18next from 'i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { PageContainer, PageLoading } from '../components/layout/PageContainer';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { courseTitle } from '../constants/courses';
import * as adminService from '../services/adminService';
import { VisitorsSection } from '../components/admin/VisitorsSection';
import { NoticesSection } from '../components/admin/NoticesSection';
import type { AdminStatsDTO } from '@cyberstars/shared/admin';
import { isAdmin as isAdminRole } from '@cyberstars/shared/auth';

const CARD_CLS = 'p-5 rounded-[var(--radius)] panel';

// A column of the stats table: its title, then one line per count, the label on
// the left and the number on the right. The table is a grid so its columns wrap on
// narrow screens; the -mr-px/-mb-px tuck each cell's right and bottom lines under
// the frame where they meet it.
function StatsColumn({
  title,
  lines,
}: {
  title: string;
  lines: { label: string; value: number | string }[];
}) {
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="-mr-px -mb-px border-r border-b border-[var(--border)]"
    >
      <div
        id={id}
        className="px-3 py-2 border-b border-[var(--border)] text-[11px] text-[var(--text3)]"
      >
        {title}
      </div>
      <ul className="m-0 px-3 py-2 list-none flex flex-col gap-1">
        {lines.map(({ label, value }) => (
          <li key={label} className="flex justify-between gap-2">
            <span>{label}</span>
            <span className="tabular-nums text-[var(--text)]">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { courses } = useCurriculum();
  // A lesson by its title in the page's language, its slug while the curriculum loads
  const lessonName = (courseKey: string, slug: string) =>
    courses.find((c) => c.key === courseKey)?.lessons.find((l) => l.slug === slug)?.title ?? slug;
  const { user, isLoading } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  const [stats, setStats] = useState<AdminStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reloads, setReloads] = useState(0);

  // Client-side guard is UX only; the /api/admin routes are server-authoritative.
  // GuestGate already sends guests to sign-in.
  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/');
  }, [isLoading, isAdmin, navigate]);

  const load = useCallback((force = false) => {
    adminService
      .getStats(force)
      .then((dto) => {
        setStats(dto);
        setFailed(false);
      })
      .catch(() => setFailed(true))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const refresh = () => {
    setRefreshing(true);
    setReloads((n) => n + 1);
    load(true);
  };

  if (isLoading || !isAdmin) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <PageContainer>
        <div>
          <div className="mb-8 flex justify-end">
            <button onClick={refresh} disabled={refreshing} className="btn btn-primary">
              {refreshing ? t('admin.refreshing') : t('admin.refresh')}
            </button>
          </div>

          {failed && (
            <p role="alert" className="mt-0 mb-5 text-[13px] text-[var(--error)]">
              {t('admin.loadError')}
            </p>
          )}

          {loading && !stats ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-5">
              {/* One table on its own row above the visitors charts, a column per subject
                  and a line per count; Online now and Code execution are live, the rest cached */}
              <section
                aria-label={t('admin.users')}
                className="panel @2xl:col-span-3 grid grid-cols-2 @xl:grid-cols-3 @4xl:grid-cols-6 rounded-[var(--radius)] overflow-hidden text-[12px] text-[var(--text2)]"
              >
                <StatsColumn
                  title={t('admin.users')}
                  lines={[
                    { label: t('admin.total'), value: stats.users.total },
                    { label: t('admin.new7'), value: stats.users.newLast7Days },
                    { label: t('admin.new30'), value: stats.users.newLast30Days },
                  ]}
                />
                <StatsColumn
                  title={t('admin.accountsPerRole')}
                  lines={[
                    ...(['USER', 'FOUNDER', 'ADMIN'] as const).map((role) => ({
                      label: t(`forum.roles.${role}`),
                      value: stats.users.byRole[role],
                    })),
                    { label: t('admin.bots'), value: stats.users.byRole.BOT },
                  ]}
                />
                <StatsColumn
                  title={t('admin.emails')}
                  lines={[
                    { label: t('admin.verified'), value: stats.users.emailVerified },
                    {
                      label: t('admin.unverified'),
                      value: stats.users.total - stats.users.emailVerified,
                    },
                  ]}
                />
                {/* Students signed in (no moderators, admins, founder or bots) and guests */}
                <StatsColumn
                  title={t('admin.onlineNow')}
                  lines={[
                    { label: t('admin.signedIn'), value: stats.online.users },
                    { label: t('admin.guests'), value: stats.online.guests },
                  ]}
                />
                {/* Whether students talk to the tutor: a count only, never who */}
                <StatsColumn
                  title={t('admin.tutorMessages')}
                  lines={[
                    { label: t('admin.days7'), value: stats.tutor.promptsLast7Days },
                    { label: t('admin.days30'), value: stats.tutor.promptsLast30Days },
                  ]}
                />
                <StatsColumn
                  title={t('admin.codeExec')}
                  lines={[
                    {
                      label: t('admin.activeContainers'),
                      value: `${stats.codeExec.activeContainers}/${stats.codeExec.maxContainers}`,
                    },
                    {
                      label: t('admin.busySandboxes'),
                      value: `${stats.codeExec.busySlots}/${stats.codeExec.maxBusySlots}`,
                    },
                    // The runtimes running now, nothing when none is
                    ...Object.entries(stats.codeExec.perLanguage).map(([lang, n]) => ({
                      label: lang,
                      value: n,
                    })),
                  ]}
                />
              </section>

              <VisitorsSection
                chartsClassName={CARD_CLS + ' @2xl:col-span-3'}
                className={CARD_CLS + ' @2xl:col-span-3'}
                reload={reloads}
              />

              {/* Progress */}
              <section className={CARD_CLS + ' @2xl:col-span-3'}>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-[14px] font-semibold">{t('admin.progress')}</h2>
                  <span className="text-[12px] text-[var(--text3)]">
                    {t('admin.totalCompletions')}: {stats.progress.totalCompletions}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[12px] text-[var(--text3)] mb-2">
                      {t('admin.byCourse')}
                    </div>
                    {stats.progress.byCourse.length === 0 ? (
                      <span className="text-[12px] text-[var(--text3)]">{t('admin.noData')}</span>
                    ) : (
                      <ul className="flex flex-col gap-1.5 text-[12px]">
                        {stats.progress.byCourse.map((c) => (
                          <li key={c.courseKey} className="flex justify-between gap-2">
                            <span className="text-[var(--text2)]">{courseTitle(c.courseKey)}</span>
                            <span className="text-[var(--text3)] tabular-nums">
                              {c.completions} {t('admin.completions', { count: c.completions })} ·{' '}
                              {c.learners} {t('admin.learners', { count: c.learners })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="text-[12px] text-[var(--text3)] mb-2">
                      {t('admin.topLessons')}
                    </div>
                    {stats.progress.topLessons.length === 0 ? (
                      <span className="text-[12px] text-[var(--text3)]">{t('admin.noData')}</span>
                    ) : (
                      <ul className="flex flex-col gap-1.5 text-[12px]">
                        {stats.progress.topLessons.map((l) => (
                          <li
                            key={`${l.courseKey}/${l.lessonSlug}`}
                            className="flex justify-between gap-2"
                          >
                            <span className="text-[var(--text2)] truncate">
                              {courseTitle(l.courseKey)} · {lessonName(l.courseKey, l.lessonSlug)}
                            </span>
                            <span className="text-[var(--text3)] tabular-nums">
                              {l.completions}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {/* After the stats, since they are rare; outside them so they work without them */}
          <NoticesSection className={CARD_CLS + ' mt-5'} />

          {/* Always the page's last line, under the announcements and polls too */}
          {stats && (
            <p className="mt-5 mb-0 text-[11px] text-[var(--text3)] text-center">
              {t('admin.generatedAt', {
                time: new Date(stats.generatedAt).toLocaleTimeString(i18next.language),
              })}
            </p>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
