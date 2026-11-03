import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { AnnouncementModal } from '../notifications/AnnouncementModal';
import { PollModal } from '../notifications/PollModal';
import { LockedIcon } from './LockedIcon';
import { TopbarAction } from './TopbarAction';
import type { NotificationDTO } from '@cyberstars/shared/notifications';

export function NotificationBell() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { enabled, unreadCount, noteBellWindow } = useNotifications();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<NotificationDTO | null>(null);
  const [pollId, setPollId] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // While one is open here, the dashboard's window waits for it
  const windowOpen = announcement !== null || pollId !== null;
  useEffect(() => {
    if (!windowOpen) return;
    noteBellWindow(true);
    return () => noteBellWindow(false);
  }, [windowOpen, noteBellWindow]);

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
      {open && (
        <NotificationDropdown
          onClose={() => setOpen(false)}
          onAnnouncement={setAnnouncement}
          onPoll={(n) => setPollId(n.entityId)}
        />
      )}
      {announcement && (
        <AnnouncementModal
          text={announcement.data?.text ?? ''}
          createdAt={announcement.createdAt}
          onClose={() => setAnnouncement(null)}
        />
      )}
      {pollId !== null && <PollModal pollId={pollId} onClose={() => setPollId(null)} />}
    </div>
  );
}
