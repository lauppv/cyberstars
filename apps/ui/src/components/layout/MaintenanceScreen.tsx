import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { checkMaintenance, useMaintenance } from '../../hooks/useMaintenance';

const ASK_EVERY_MS = 3000;

// The look of deploy/maintenance.html, which a reload during a deploy gets
// instead of the app: same sky, orbit and type, so both read as one page.
// Change one, change the other
const SKY = 'radial-gradient(ellipse at 50% 50%, #1a0d3d 0%, #0a0518 55%, #000 100%)';
const TYPE = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

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
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center overflow-hidden p-6 text-center"
      style={{ background: SKY, fontFamily: TYPE }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="maintenance-title"
        className="max-w-[460px]"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-7 h-[88px] w-[88px] rounded-full border-2 border-[rgba(108,92,231,0.25)] border-t-[var(--accent)] animate-[spin_1.1s_linear_infinite] motion-reduce:animate-none"
        />
        <h1
          id="maintenance-title"
          className="m-0 mb-3 text-[1.5rem] font-bold tracking-[0.2px] text-[#e7e7ef]"
        >
          {t('maintenance.title')}
        </h1>
        <p className="m-0 leading-[1.6] text-[#9a9ab0]">{t('maintenance.body')}</p>
      </div>
    </div>
  );
}
