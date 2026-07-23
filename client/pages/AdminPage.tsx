import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { courseTitle } from '../constants/courses';
import * as adminService from '../services/adminService';
import type { AdminStatsDTO } from '../../shared/admin';
import { isAdmin as isAdminRole } from '../../shared/auth';

const CARD_CLS = 'p-5 rounded-[var(--radius)] panel';

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[22px] font-bold tabular-nums text-[var(--text)]">{value}</span>
      <span className="text-[11px] text-[var(--text3)]">{label}</span>
    </div>
  );
}

export function AdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoggedIn, isLoading } = useAuth();
  const isAdmin = isAdminRole(user?.role);

  const [stats, setStats] = useState<AdminStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Client-side guard is UX only — the /api/admin routes are server-authoritative.
  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      navigate('/getstarted');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isLoading, isLoggedIn, isAdmin, navigate]);

  const load = useCallback((force = false) => {
    adminService
      .getStats(force)
      .then(setStats)
      .catch(() => {})
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
    load(true);
  };

  if (isLoading || !isAdmin) {
    return (
      <div className="h-screen flex flex-col bg-transparent">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[960px]">
          <div className="text-backdrop mb-8 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[24px] font-bold tracking-[-0.5px] mb-2">{t('admin.title')}</h1>
              <p className="text-[13px] text-[var(--text3)]">{t('admin.subtitle')}</p>
            </div>
            <button
              onClick={refresh}
              disabled={refreshing}
              className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {refreshing ? t('admin.refreshing') : t('admin.refresh')}
            </button>
          </div>

          {loading && !stats ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Users */}
              <section className={CARD_CLS}>
                <h2 className="text-[14px] font-semibold mb-4">{t('admin.users')}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Stat label={t('admin.totalUsers')} value={stats.users.total} />
                  <Stat label={t('admin.active')} value={stats.users.active} />
                  <Stat label={t('admin.new7')} value={stats.users.newLast7Days} />
                  <Stat label={t('admin.new30')} value={stats.users.newLast30Days} />
                </div>
                <div className="pt-3 border-t border-[var(--accent)]/20 flex gap-4 text-[12px] text-[var(--text2)]">
                  <span>FOUNDER {stats.users.byRole.FOUNDER}</span>
                  <span>ADMIN {stats.users.byRole.ADMIN}</span>
                  <span>MODERATOR {stats.users.byRole.MODERATOR}</span>
                  <span>USER {stats.users.byRole.USER}</span>
                </div>
              </section>

              {/* Code execution (live) */}
              <section className={CARD_CLS}>
                <h2 className="text-[14px] font-semibold mb-4">{t('admin.codeExec')}</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Stat
                    label={t('admin.activeContainers')}
                    value={`${stats.codeExec.activeContainers}/${stats.codeExec.maxContainers}`}
                  />
                  <Stat label={t('admin.runningNow')} value={stats.codeExec.runningNow} />
                  <Stat label={t('admin.openSessions')} value={stats.codeExec.openSessions} />
                </div>
                <div className="pt-3 border-t border-[var(--accent)]/20 text-[12px] text-[var(--text2)]">
                  <div className="text-[var(--text3)] mb-1">{t('admin.perLanguage')}</div>
                  {Object.keys(stats.codeExec.perLanguage).length === 0 ? (
                    <span className="text-[var(--text3)]">{t('admin.noData')}</span>
                  ) : (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(stats.codeExec.perLanguage).map(([lang, n]) => (
                        <span key={lang}>
                          {lang} {n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Progress */}
              <section className={CARD_CLS + ' md:col-span-2'}>
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
                              {c.completions} {t('admin.completions')} · {c.learners}{' '}
                              {t('admin.learners')}
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
                              {courseTitle(l.courseKey)} · {l.lessonSlug}
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

              {/* Forum & Support */}
              <section className={CARD_CLS + ' md:col-span-2'}>
                <h2 className="text-[14px] font-semibold mb-4">{t('admin.forum')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <Stat label={t('admin.threads')} value={stats.forum.threads} />
                  <Stat label={t('admin.posts')} value={stats.forum.posts} />
                  <Stat label={t('admin.reactions')} value={stats.forum.reactions} />
                  <Stat label={t('admin.tickets')} value={stats.support.total} />
                </div>
                <div className="pt-3 border-t border-[var(--accent)]/20 flex flex-wrap gap-4 text-[12px] text-[var(--text2)]">
                  {Object.entries(stats.support.byStatus).map(([status, n]) => (
                    <span key={status}>
                      {status} {n}
                    </span>
                  ))}
                </div>
              </section>

              <p className="md:col-span-2 text-[11px] text-[var(--text3)] text-center">
                {t('admin.generatedAt', {
                  time: new Date(stats.generatedAt).toLocaleTimeString(),
                })}
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
