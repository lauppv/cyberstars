import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessagesContext';
import { LockedIcon } from './LockedIcon';

// Letter icon sitting to the right of the notification bell; carries the same
// unread badge the inbox does. Non-admins on prod see it locked ("coming soon").
export function MessagesButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enabled, totalUnread } = useMessages();

  if (!enabled) {
    if (!user) return null;
    return <LockedIcon emoji="✉️" label={t('messages.title')} />;
  }

  return (
    <button
      onClick={() => navigate('/messages')}
      className="relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] bg-transparent border-none text-[17px] hover:bg-[var(--surface)] transition cursor-pointer"
      aria-label={t('messages.title')}
    >
      ✉️
      {totalUnread > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold leading-[16px] text-center tabular-nums">
          {totalUnread > 9 ? '9+' : totalUnread}
        </span>
      )}
    </button>
  );
}
