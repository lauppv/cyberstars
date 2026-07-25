import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { canAccessFeature } from '../../../shared/features';
import { LockedIcon } from './LockedIcon';

// People icon sitting between the leaderboard and messages buttons. Non-admins
// on prod see it locked ("coming soon") like the other preview icons. New
// requests surface through the notification bell, so this button carries no
// badge of its own.
export function ConnectionsButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!canAccessFeature('connections', user?.role, import.meta.env.PROD)) {
    return user ? <LockedIcon emoji="🤝" label={t('connections.title')} /> : null;
  }

  return (
    <button
      onClick={() => navigate('/connections')}
      className="relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] bg-transparent border-none text-[17px] hover:bg-[var(--surface)] transition cursor-pointer"
      aria-label={t('connections.title')}
      title={t('connections.title')}
    >
      🤝
    </button>
  );
}
