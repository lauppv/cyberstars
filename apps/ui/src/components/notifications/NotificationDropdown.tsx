import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import i18next from 'i18next';
import { useNotifications } from '../../context/NotificationContext';
import type { NotificationDTO } from '@cyberstars/shared/notifications';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return i18next.t('forum.time.justNow');
  if (mins < 60) return i18next.t('forum.time.minAgo', { count: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return i18next.t('forum.time.hourAgo', { count: hrs });
  const days = Math.floor(hrs / 24);
  if (days < 30) return i18next.t('forum.time.dayAgo', { count: days });
  return new Date(iso).toLocaleDateString(i18next.language);
}

// The bell lists only announcements, polls and, for the admins, written poll
// answers; everything else counts on its sidebar row
function describe(n: NotificationDTO): string {
  const t = i18next.t;
  switch (n.type) {
    case 'ANNOUNCEMENT':
      return t('notif.announcement', { text: n.data?.text ?? '' });
    case 'POLL':
      return t('notif.poll', { text: n.data?.text ?? '' });
    case 'POLL_ANSWER':
      return t('notif.pollAnswer', { title: n.data?.title ?? '', text: n.data?.text ?? '' });
    default:
      return '';
  }
}

// One row of the bell, also drawn as the admin's preview of an announcement
export function NotificationItem({ n, onClick }: { n: NotificationDTO; onClick: () => void }) {
  const { t } = useTranslation();
  const poll = n.type === 'POLL';
  // Both open in a window, so the row shows two lines and a button
  const windowed = n.type === 'ANNOUNCEMENT' || poll;
  // A written answer can run long too, but its whole text waits on the admin page
  const clamped = windowed || n.type === 'POLL_ANSWER';
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-x-0 border-t-0 ${
        n.readAt ? 'opacity-60' : ''
      }`}
    >
      <span className="min-w-0 flex-1">
        {/* line-clamp sets its own display, which block would override and undo */}
        <span
          className={`text-[12.5px] text-[var(--text)] leading-snug ${clamped ? 'line-clamp-2' : 'block'}`}
        >
          {describe(n)}
        </span>
        <span className="block text-[11px] text-[var(--text3)] mt-0.5">{timeAgo(n.createdAt)}</span>
      </span>
      {windowed && (
        // The whole row opens it, this just says there's more than two lines to read
        <span className="flex-shrink-0 self-center px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[11px] font-semibold">
          {poll ? t('notif.vote') : t('notif.view')}
        </span>
      )}
      {!n.readAt && (
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0 mt-1.5" />
      )}
    </button>
  );
}

export function NotificationDropdown({
  onClose,
  onAnnouncement,
  onPoll,
}: {
  onClose: () => void;
  onAnnouncement: (n: NotificationDTO) => void;
  onPoll: (n: NotificationDTO) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    unreadCount,
    loading,
    hasMore,
    loadFailed,
    reload,
    moreError,
    loadMore,
    markAllRead,
    markOneRead,
  } = useNotifications();

  const onItemClick = (n: NotificationDTO) => {
    markOneRead(n.id);
    onClose();
    // A written answer waits whole on the admin page; an announcement or a poll
    // has no page of its own, it opens in a window over this one
    if (n.type === 'POLL_ANSWER') navigate('/admin');
    else if (n.type === 'POLL') onPoll(n);
    else onAnnouncement(n);
  };

  return (
    <div
      role="menu"
      className="fixed inset-x-2 top-[60px] w-auto sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_32px_#0008] overflow-hidden z-50 fade-in-up"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <span className="text-[13px] font-semibold text-[var(--text)]">{t('notif.title')}</span>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] font-medium text-[var(--accent)] bg-transparent border-none cursor-pointer hover:brightness-125 transition"
          >
            {t('notif.markAllRead')}
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {loadFailed && (
          <div
            role="alert"
            className="px-4 py-3 flex items-center justify-between gap-3 border-b border-[var(--border)] text-[12px] text-[var(--error)]"
          >
            <span className="min-w-0">{t('notif.loadFailed')}</span>
            <button
              onClick={reload}
              className="shrink-0 text-[12px] font-medium text-[var(--accent)] bg-transparent border-none cursor-pointer hover:brightness-125 transition"
            >
              {t('notif.retry')}
            </button>
          </div>
        )}
        {items.length === 0
          ? !loadFailed && (
              <div className="px-4 py-8 text-center text-[13px] text-[var(--text3)]">
                {loading ? '…' : t('notif.empty')}
              </div>
            )
          : items.map((n) => <NotificationItem key={n.id} n={n} onClick={() => onItemClick(n)} />)}
        {moreError && (
          <p role="alert" className="px-4 pt-2.5 text-[12px] text-[var(--error)] text-center">
            {moreError}
          </p>
        )}
        {hasMore && (
          <button
            onClick={loadMore}
            className="w-full px-4 py-2.5 text-[12px] font-medium text-[var(--accent)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-none"
          >
            {t('notif.loadMore')}
          </button>
        )}
      </div>
    </div>
  );
}
