import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ListTree, PanelLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from './NotificationBell';
import { useSidebar } from './AppShell';

interface TopbarProps {
  breadcrumb?: { course?: string; lesson?: string; courseHref?: string };
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

// What the header names when a page passes no breadcrumb, matched by prefix
const TITLES: [string, string][] = [
  ['/courses', 'nav.courses'],
  ['/algorithms', 'nav.algorithms'],
  ['/forum', 'nav.forum'],
  ['/almanac', 'nav.almanac'],
  ['/leaderboard', 'nav.leaderboard'],
  ['/messages', 'messages.title'],
  ['/connections', 'connections.title'],
  ['/profile', 'topbar.profile'],
  ['/settings', 'topbar.settings'],
  ['/usage', 'usage.title'],
  ['/support', 'topbar.support'],
  ['/rules', 'topbar.rules'],
  ['/admin', 'topbar.admin'],
];

function titleKey(pathname: string): string | null {
  if (pathname === '/') return 'nav.dashboard';
  return TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? null;
}

const iconButton =
  'w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer flex-shrink-0';

export function Topbar({
  breadcrumb,
  showSidebarToggle,
  sidebarOpen,
  onSidebarToggle,
}: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();
  const sidebar = useSidebar();
  const title = titleKey(location.pathname);

  return (
    <header className="flex items-center justify-between gap-3 px-3 sm:px-4 h-12 bg-[var(--chrome)] border-b border-[var(--border)] flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-1.5 min-w-0">
        {sidebar && (
          <button
            onClick={sidebar.toggle}
            className={iconButton}
            aria-label={t(sidebar.state === 'closed' ? 'sidebar.show' : 'sidebar.hide')}
            aria-expanded={sidebar.state !== 'closed'}
            title={t(sidebar.state === 'closed' ? 'sidebar.show' : 'sidebar.hide')}
          >
            <PanelLeft size={16} strokeWidth={1.75} />
          </button>
        )}

        {showSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className={`${iconButton} ${sidebarOpen ? 'text-[var(--text)]' : ''}`}
            aria-label={t('topbar.toggleSidebar')}
            aria-pressed={sidebarOpen}
            title={t('topbar.toggleSidebar')}
          >
            <ListTree size={16} strokeWidth={1.75} />
          </button>
        )}

        {breadcrumb ? (
          <div className="flex items-center gap-2 ml-1 text-[13px] text-[var(--text3)] min-w-0">
            {breadcrumb.course && (
              <span
                className="hidden sm:inline text-[var(--text2)] hover:text-[var(--text)] cursor-pointer transition whitespace-nowrap"
                onClick={() => navigate(breadcrumb.courseHref ?? '/courses')}
              >
                {breadcrumb.course}
              </span>
            )}
            {breadcrumb.course && breadcrumb.lesson && (
              <span className="hidden sm:inline opacity-40">/</span>
            )}
            {breadcrumb.lesson && (
              <span className="text-[var(--text)] truncate">{breadcrumb.lesson}</span>
            )}
          </div>
        ) : (
          title && (
            <span className="ml-1 text-[13px] font-medium text-[var(--text)] truncate">
              {t(title)}
            </span>
          )
        )}
      </div>

      <div className="flex items-center gap-2">
        {isLoggedIn && user ? (
          <NotificationBell />
        ) : (
          <button
            onClick={() => navigate('/getstarted')}
            className="h-7 px-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-medium border-none hover:brightness-110 transition cursor-pointer"
          >
            {t('topbar.signIn')}
          </button>
        )}
      </div>
    </header>
  );
}
