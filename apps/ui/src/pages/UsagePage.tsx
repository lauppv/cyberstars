import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Topbar } from '../components/layout/Topbar';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/layout/PageHeader';
import { UsageMeter } from '../components/usage/UsageMeter';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useUsage } from '../context/UsageContext';
import { canAccessFeature } from '@cyberstars/shared/features';

export function UsagePage() {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  // The tutor session shows only to those who can open the tutor.
  const tutor = !!user && canAccessFeature('tutorChat', user.role, import.meta.env.PROD);
  const { summary, loading, refresh } = useUsage();

  // Pull fresh numbers when the page opens rather than trusting whatever the
  // context cached at login.
  useEffect(() => {
    if (isLoggedIn) refresh();
  }, [isLoggedIn, refresh]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <PageContainer width="narrow">
        <PageHeader title={t('usage.pageTitle')} subtitle={t('usage.pageSubtitle')} />
        <div>
          {!isLoggedIn ? (
            <div className="panel p-4 text-[13px] text-[var(--text2)]">
              {t('usage.signInPrompt')}
            </div>
          ) : !summary && loading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner />
            </div>
          ) : summary ? (
            <div className="flex flex-col gap-6">
              <div className="panel p-5 flex flex-col gap-5">
                <UsageMeter
                  state={summary.showSolution}
                  label={t('usage.solution')}
                  period={t('usage.day')}
                />
                {tutor && (
                  <UsageMeter
                    state={summary.tutorMessage}
                    label={t('usage.tutor')}
                    period={t('usage.session')}
                  />
                )}
              </div>
              <p className="panel p-4 text-[12px] text-[var(--text3)] leading-relaxed">
                {t('usage.about')}
              </p>
            </div>
          ) : null}
        </div>
      </PageContainer>
    </div>
  );
}
