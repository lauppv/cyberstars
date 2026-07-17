import { useTranslation } from 'react-i18next';
import type { ConversationDTO } from '../../../shared/messages';

function Avatar({ url }: { url: string | null }) {
  return url ? (
    <img
      src={url}
      alt=""
      className="w-10 h-10 rounded-full object-cover border-2 border-[var(--accent)]/50 flex-shrink-0"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-[var(--surface2)] flex items-center justify-center text-base border-2 border-[var(--accent)]/50 flex-shrink-0">
      🚀
    </div>
  );
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
      <div className="px-4 py-10 text-center text-[13px] text-[var(--text3)]">
        {t('messages.emptyInbox')}
      </div>
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
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-3 py-3 flex items-center gap-3 border-b border-[var(--accent)]/15 last:border-b-0 transition cursor-pointer bg-transparent border-x-0 border-t-0 hover:bg-[var(--surface)] ${
              selectedId === c.id ? 'bg-[var(--accent)]/10' : ''
            }`}
          >
            <Avatar url={c.other.avatarUrl} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold text-[13.5px] text-[var(--text)]">
                  {c.other.name}
                </span>
                {c.unreadCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold leading-[18px] text-center tabular-nums flex-shrink-0">
                    {c.unreadCount > 9 ? '9+' : c.unreadCount}
                  </span>
                )}
              </div>
              <span className="block truncate text-[12px] text-[var(--text3)] mt-0.5">
                {preview}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
