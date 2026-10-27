import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { checkMaintenance, useMaintenance } from '../../hooks/useMaintenance';

const ASK_EVERY_MS = 3000;

// The maintenance page, over the app instead of in its place: reading carries on
// through a deploy, but the first run or page change meets this, and the page
// underneath keeps what it holds. It goes away once the backend answers again
export function MaintenanceScreen() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const on = useMaintenance();
  const shownPath = useRef(pathname);

  useEffect(() => {
    if (shownPath.current === pathname) return;
    shownPath.current = pathname;
    void checkMaintenance();
  }, [pathname]);

  useEffect(() => {
    if (!on) return;
    const timer = setInterval(() => void checkMaintenance(), ASK_EVERY_MS);
    return () => clearInterval(timer);
  }, [on]);

  if (!on) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 text-center bg-[var(--page-bg)]">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="maintenance-title"
        className="max-w-[460px]"
      >
        <LoadingSpinner />
        <h1 id="maintenance-title" className="m-0 mb-3 text-2xl font-semibold text-[var(--text)]">
          {t('maintenance.title')}
        </h1>
        <p className="m-0 leading-relaxed text-[var(--text2)]">{t('maintenance.body')}</p>
      </div>
    </div>
  );
}
