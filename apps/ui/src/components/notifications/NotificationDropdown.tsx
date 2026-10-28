import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import i18next from 'i18next';
import { useNotifications } from '../../context/NotificationContext';
import { forumRoutes } from '../../constants/forumRoutes';
import type { NotificationDTO, NotificationType } from '@cyberstars/shared/notifications';

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

const ICONS: Record<NotificationType, string> = {
  FORUM_REPLY: '💬',
  FORUM_SOLUTION: '✅',
  FORUM_REACTION: '❤️',
  SUPPORT_TICKET_NEW: '🎫',
  SUPPORT_REPLY: '🎫',
  SUPPORT_STATUS: '🔖',
  CONNECTION_REQUEST: '🤝',
  CONNECTION_ACCEPTED: '🌟',
  LANIAKEA_RECAP: '🪐',
  ANNOUNCEMENT: '📣',
};

function describe(n: NotificationDTO): string {
  const t = i18next.t;
  const name = n.actor?.name ?? t('notif.someone');
  const title = n.data?.title ?? '';
  const count = n.data?.count ?? 1;
  switch (n.type) {
    case 'FORUM_REPLY':
      return t('notif.forumReply', { count, name, title });
    case 'FORUM_SOLUTION':
      return t('notif.forumSolution', { name, title });
    case 'FORUM_REACTION':
      return t('notif.forumReaction', { name, title });
    case 'SUPPORT_TICKET_NEW':
      return t('notif.ticketNew', { title });
    case 'SUPPORT_REPLY':
      return t('notif.ticketReply', { title });
    case 'SUPPORT_STATUS':
      return t('notif.status', {
        title,
        status: n.data?.status ? t(`support.status.${n.data.status}`) : '',
      });
    case 'CONNECTION_REQUEST':
      return t('notif.connectionRequest', { name });
    case 'CONNECTION_ACCEPTED':
      return t('notif.connectionAccepted', { name });
    case 'LANIAKEA_RECAP':
      return t('notif.laniakeaRecap', { count });
    case 'ANNOUNCEMENT':
      return t('notif.announcement', { text: n.data?.text ?? '' });
  }
}

// One row of the bell, also drawn as the admin's preview of an announcement
export function NotificationItem({ n, onClick }: { n: NotificationDTO; onClick: () => void }) {
  const { t } = useTranslation();
  const announcement = n.type === 'ANNOUNCEMENT';
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
          className={`text-[12.5px] text-[var(--text)] leading-snug ${announcement ? 'line-clamp-2' : 'block'}`}
        >
          {describe(n)}
        </span>
        <span className="block text-[11px] text-[var(--text3)] mt-0.5">{timeAgo(n.createdAt)}</span>
      </span>
      {announcement && (
        // The whole row opens it, this just says there's more than two lines to read
        <span className="flex-shrink-0 self-center px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[11px] font-semibold">
          {t('notif.view')}
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
}: {
  onClose: () => void;
  onAnnouncement: (n: NotificationDTO) => void;
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

  const targetFor = (n: NotificationDTO): string | null => {
    switch (n.type) {
      case 'FORUM_REPLY':
      case 'FORUM_SOLUTION':
      case 'FORUM_REACTION':
        return forumRoutes.thread(n.entityId);
      case 'SUPPORT_TICKET_NEW':
      case 'SUPPORT_REPLY':
      case 'SUPPORT_STATUS':
        return `/support?ticket=${n.entityId}`;
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return '/connections';
      case 'LANIAKEA_RECAP':
        return '/laniakea';
      case 'ANNOUNCEMENT':
        return null;
    }
  };

  const onItemClick = (n: NotificationDTO) => {
    markOneRead(n.id);
    onClose();
    const to = targetFor(n);
    // An announcement has no page of its own, it opens in a window over this one
    if (to) navigate(to);
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
