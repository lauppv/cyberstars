import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Braces,
  ChevronsUpDown,
  Compass,
  Gauge,
  House,
  Library,
  LifeBuoy,
  LogIn,
  LogOut,
  Mail,
  MessagesSquare,
  ScrollText,
  Settings,
  ShieldCheck,
  Trophy,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { BrandMark } from '../ui/BrandMark';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessagesContext';
import { useGamification } from '../../hooks/useGamification';
import { isAdmin } from '../../../shared/auth';
import { canAccessFeature } from '../../../shared/features';

// "wide" is a sidebar that was left open, unfolded only where there is room
// for it beside the page
export type SidebarState = 'open' | 'wide' | 'closed';

// Visibility is held back until the panel has slid away, so it leaves the tab
// order only once it is out of sight
const PANEL: Record<SidebarState, string> = {
  open: 'translate-x-0',
  wide: 'max-md:invisible max-md:-translate-x-full',
  closed: 'invisible -translate-x-full',
};

const ICON_SIZE = 16;

function isActive(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  if (path === '/algorithms') {
    return pathname.startsWith('/algorithms') || pathname.startsWith('/lesson/algo');
  }
  if (path === '/courses') {
    return (
      pathname.startsWith('/courses') ||
      (pathname.startsWith('/lesson/') && !pathname.startsWith('/lesson/algo'))
    );
  }
  return pathname.startsWith(path);
}

const rowClass =
  'relative flex items-center gap-2.5 h-8 px-2.5 rounded-[var(--radius-sm)] text-[13px] transition-colors duration-150';

function NavItem({
  to,
  icon: Icon,
  label,
  badge,
  onNavigate,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  onNavigate: () => void;
}) {
  const { pathname } = useLocation();
  const active = isActive(pathname, to);
  return (
    <Link
      to={to}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`${rowClass} no-underline ${
        active
          ? 'bg-[var(--surface2)] text-[var(--text)]'
          : 'text-[var(--text2)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
      }`}
    >
      <Icon size={ICON_SIZE} strokeWidth={1.75} className="flex-shrink-0 opacity-80" />
      <span className="truncate">{label}</span>
      {badge != null && badge > 0 && (
        <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-semibold leading-[18px] text-center tabular-nums">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}

// A preview feature that is not open to this person yet. It keeps its place in
// the list so people know it is coming, but leads nowhere
function LockedItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  const { t } = useTranslation();
  return (
    <div
      className={`${rowClass} text-[var(--text3)] cursor-default`}
      title={t('common.comingSoonHint')}
      aria-disabled="true"
    >
      <Icon size={ICON_SIZE} strokeWidth={1.75} className="flex-shrink-0 opacity-60" />
      <span className="truncate">{label}</span>
      <span className="ml-auto text-[10px] px-1.5 py-px rounded border border-[var(--border)]">
        {t('common.comingSoon')}
      </span>
    </div>
  );
}

function Section({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-px mt-4 first:mt-0">
      {label && (
        <div className="px-2.5 pb-1 text-[11px] font-medium text-[var(--text3)]">{label}</div>
      )}
      {children}
    </div>
  );
}

function UserMenu({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { xp } = useGamification();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const go = (path: string) => {
    setOpen(false);
    onNavigate();
    navigate(path);
  };

  const items: { icon: LucideIcon; label: string; path: string; show?: boolean }[] = [
    { icon: User, label: t('topbar.profile'), path: '/profile' },
    { icon: Gauge, label: t('usage.title'), path: '/usage' },
    { icon: ScrollText, label: t('topbar.rules'), path: '/rules' },
    { icon: Compass, label: t('topbar.welcomeTour'), path: '/welcome' },
    { icon: ShieldCheck, label: t('topbar.admin'), path: '/admin', show: isAdmin(user.role) },
  ];

  return (
    <div className="relative" ref={ref}>
      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 mb-1 py-1 bg-[var(--popover)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_24px_#0006] z-10 fade-in-up"
        >
          <div className="px-3 py-2 text-[11px] text-[var(--text3)] truncate">{user.email}</div>
          {items
            .filter((item) => item.show !== false)
            .map((item) => (
              <button
                key={item.path}
                role="menuitem"
                onClick={() => go(item.path)}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-[13px] text-[var(--text)] bg-transparent border-none hover:bg-[var(--surface2)] transition cursor-pointer"
              >
                <item.icon size={ICON_SIZE} strokeWidth={1.75} className="text-[var(--text3)]" />
                {item.label}
              </button>
            ))}
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await logout();
              navigate('/getstarted');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-[13px] text-[var(--text)] bg-transparent border-none hover:bg-[var(--surface2)] transition cursor-pointer"
          >
            <LogOut size={ICON_SIZE} strokeWidth={1.75} className="text-[var(--text3)]" />
            {t('topbar.signOut')}
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-sm)] bg-transparent border-none hover:bg-[var(--surface)] transition cursor-pointer text-left"
      >
        <Avatar url={user.avatarUrl} name={user.name} size={26} />
        <span className="flex flex-col min-w-0 flex-1">
          <span className="text-[13px] text-[var(--text)] truncate">{user.name}</span>
          <span className="text-[11px] text-[var(--text3)] truncate" title={t(xp.titleKey)}>
            {t('level.short', { n: xp.level })} · {xp.xpIntoLevel}/{xp.xpForLevelSpan} XP
          </span>
        </span>
        <ChevronsUpDown size={14} className="text-[var(--text3)] flex-shrink-0" />
      </button>
    </div>
  );
}

export function Sidebar({ state, onNavigate }: { state: SidebarState; onNavigate: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enabled: messagesEnabled, totalUnread } = useMessages();
  const isProd = import.meta.env.PROD;

  return (
    <aside
      aria-label={t('sidebar.label')}
      className={`fixed inset-y-0 left-0 z-50 w-[240px] flex flex-col bg-[var(--bg2)] border-r border-[var(--border)] transition-[transform,visibility] duration-200 ${PANEL[state]}`}
    >
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 h-12 px-4 flex-shrink-0 no-underline text-[var(--text)]"
      >
        <BrandMark />
        <span className="font-semibold text-[14px] tracking-[-0.2px]">CyberStars</span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <Section>
          <NavItem to="/" icon={House} label={t('nav.dashboard')} onNavigate={onNavigate} />
          <NavItem to="/courses" icon={BookOpen} label={t('nav.courses')} onNavigate={onNavigate} />
          <NavItem
            to="/algorithms"
            icon={Braces}
            label={t('nav.algorithms')}
            onNavigate={onNavigate}
          />
          <NavItem to="/almanac" icon={Library} label={t('nav.almanac')} onNavigate={onNavigate} />
        </Section>

        <Section label={t('sidebar.community')}>
          <NavItem
            to="/forum"
            icon={MessagesSquare}
            label={t('nav.forum')}
            onNavigate={onNavigate}
          />
          {user &&
            (messagesEnabled ? (
              <NavItem
                to="/messages"
                icon={Mail}
                label={t('messages.title')}
                badge={totalUnread}
                onNavigate={onNavigate}
              />
            ) : (
              <LockedItem icon={Mail} label={t('messages.title')} />
            ))}
          {user &&
            (canAccessFeature('connections', user.role, isProd) ? (
              <NavItem
                to="/connections"
                icon={Users}
                label={t('connections.title')}
                onNavigate={onNavigate}
              />
            ) : (
              <LockedItem icon={Users} label={t('connections.title')} />
            ))}
          {user &&
            (canAccessFeature('leaderboard', user.role, isProd) ? (
              <NavItem
                to="/leaderboard"
                icon={Trophy}
                label={t('nav.leaderboard')}
                onNavigate={onNavigate}
              />
            ) : (
              <LockedItem icon={Trophy} label={t('nav.leaderboard')} />
            ))}
        </Section>
      </nav>

      <div className="flex flex-col gap-px px-2 pt-2 pb-2 border-t border-[var(--border)] flex-shrink-0">
        {user ? (
          <>
            <NavItem
              to="/support"
              icon={LifeBuoy}
              label={t('topbar.support')}
              onNavigate={onNavigate}
            />
            <NavItem
              to="/settings"
              icon={Settings}
              label={t('topbar.settings')}
              onNavigate={onNavigate}
            />
            <div className="mt-1">
              <UserMenu onNavigate={onNavigate} />
            </div>
          </>
        ) : (
          <NavItem
            to="/getstarted"
            icon={LogIn}
            label={t('topbar.signIn')}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </aside>
  );
}
