import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { LockedIcon } from './LockedIcon';
import { TopbarAction } from './TopbarAction';

export function NotificationBell() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enabled, unreadCount } = useNotifications();
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

  if (!enabled) {
    if (!user) return null;
    return (
      <LockedIcon emoji="🔔" label={t('notif.title')} short={t('topbar.short.notifications')} />
    );
  }

  return (
    <div className="relative" ref={ref}>
      <TopbarAction
        emoji="🔔"
        label={t('notif.title')}
        short={t('topbar.short.notifications')}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold leading-[16px] text-center tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </TopbarAction>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
