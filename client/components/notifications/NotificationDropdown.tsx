import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18next from 'i18next';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import type { NotificationDTO, NotificationType } from '../../../shared/notifications';
import { isAdmin } from '../../../shared/auth';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return i18next.t('forum.time.justNow');
  if (mins < 60) return i18next.t('forum.time.minAgo', { count: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return i18next.t('forum.time.hourAgo', { count: hrs });
  const days = Math.floor(hrs / 24);
  if (days < 30) return i18next.t('forum.time.dayAgo', { count: days });
  return new Date(iso).toLocaleDateString();
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
  }
}

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, unreadCount, loading, hasMore, loadMore, markAllRead, markOneRead } =
    useNotifications();

  const targetFor = (n: NotificationDTO): { path: string; state?: unknown } => {
    switch (n.type) {
      case 'FORUM_REPLY':
      case 'FORUM_SOLUTION':
      case 'FORUM_REACTION':
        return { path: '/forum', state: { openThreadId: n.entityId } };
      case 'SUPPORT_TICKET_NEW':
        return { path: '/admin' };
      case 'SUPPORT_REPLY':
        return { path: isAdmin(user?.role) ? '/admin' : '/support' };
      case 'SUPPORT_STATUS':
        return { path: '/support' };
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED':
        return { path: '/connections' };
    }
  };

  const onItemClick = (n: NotificationDTO) => {
    markOneRead(n.id);
    const { path, state } = targetFor(n);
    onClose();
    navigate(path, state ? { state } : undefined);
  };

  return (
    <div
      role="menu"
      className="fixed inset-x-2 top-[60px] w-auto sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80 bg-[var(--bg2)] border border-[var(--accent)]/30 rounded-[var(--radius)] shadow-[0_8px_32px_#0008] overflow-hidden z-50 fade-in-up"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--accent)]/20">
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
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--text3)]">
            {loading ? '…' : t('notif.empty')}
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              role="menuitem"
              onClick={() => onItemClick(n)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-[var(--accent)]/10 last:border-b-0 hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border-x-0 border-t-0 ${
                n.readAt ? 'opacity-60' : ''
              }`}
            >
              <span className="text-[15px] leading-none mt-0.5 flex-shrink-0">{ICONS[n.type]}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] text-[var(--text)] leading-snug">
                  {describe(n)}
                </span>
                <span className="block text-[11px] text-[var(--text3)] mt-0.5">
                  {timeAgo(n.createdAt)}
                </span>
              </span>
              {!n.readAt && (
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] flex-shrink-0 mt-1.5" />
              )}
            </button>
          ))
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
