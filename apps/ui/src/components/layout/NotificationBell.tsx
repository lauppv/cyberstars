import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
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
    return <LockedIcon icon={<Bell size={16} strokeWidth={1.75} />} label={t('notif.title')} />;
  }

  return (
    <div className="relative" ref={ref}>
      <TopbarAction
        icon={<Bell size={16} strokeWidth={1.75} />}
        label={t('notif.title')}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-[var(--accent)] text-white text-[9px] font-semibold leading-[15px] text-center tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </TopbarAction>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
