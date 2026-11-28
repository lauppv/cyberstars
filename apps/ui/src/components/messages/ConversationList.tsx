import { useTranslation } from 'react-i18next';
import type { ConversationDTO } from '@cyberstars/shared/messages';
import { Avatar } from '../ui/Avatar';
import { Link } from 'react-router';
import { Inbox } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import i18next from 'i18next';

// When the last message came: its time today, else its day ("22 nov.")
function shortWhen(iso: string): string {
  const at = new Date(iso);
  const today = new Date().toDateString() === at.toDateString();
  return today
    ? at.toLocaleTimeString(i18next.language, { hour: '2-digit', minute: '2-digit' })
    : at.toLocaleDateString(i18next.language, { day: 'numeric', month: 'short' });
}

export function ConversationList({
  conversations,
  selectedId,
  currentUserId,
  onSelect,
}: {
  conversations: ConversationDTO[];
  selectedId: number | null;
  currentUserId: number;
  onSelect: (id: number) => void;
}) {
  const { t } = useTranslation();

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={t('messages.emptyInbox')}
        hint={t('messages.emptyInboxHint')}
        action={
          <Link to="/connections" className="btn btn-secondary btn-sm">
            {t('connections.title')}
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-y-auto">
      {conversations.map((c) => {
        const preview = c.lastMessage
          ? c.lastMessage.deleted
            ? t('messages.deletedMessage')
            : `${c.lastMessage.senderId === currentUserId ? t('messages.youPrefix') : ''}${c.lastMessage.content}`
          : t('messages.noMessagesYet');
        const unread = c.unreadCount > 0;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-3 py-3 flex items-center gap-3 border-b border-[var(--border)] last:border-b-0 transition cursor-pointer bg-transparent border-x-0 border-t-0 hover:bg-[var(--surface2)] ${
              selectedId === c.id
                ? 'bg-[var(--accent)]/10 shadow-[inset_2px_0_0_var(--accent)]'
                : ''
            }`}
          >
            <Avatar url={c.other.avatarUrl} userId={c.other.id} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`truncate text-[13.5px] text-[var(--text)] ${unread ? 'font-bold' : 'font-semibold'}`}
                >
                  {c.other.name}
                </span>
                {c.lastMessage && (
                  <span
                    className={`flex-shrink-0 text-[11px] tabular-nums ${unread ? 'text-[var(--text)]' : 'text-[var(--text3)]'}`}
                  >
                    {shortWhen(c.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span
                  className={`truncate text-[12.5px] ${unread ? 'text-[var(--text)] font-medium' : 'text-[var(--text3)]'}`}
                >
                  {preview}
                </span>
                {unread && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold leading-[18px] text-center tabular-nums flex-shrink-0">
                    {c.unreadCount > 9 ? '9+' : c.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
