import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { canAccessFeature } from '../../../shared/features';
import { LockedIcon } from './LockedIcon';

// Trophy icon sitting between the notification bell and the messages button.
// Non-admins on prod see it locked ("coming soon") like the other preview icons.
export function LeaderboardButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!canAccessFeature('leaderboard', user?.role, import.meta.env.PROD)) {
    return <LockedIcon emoji="🏆" label={t('nav.leaderboard')} />;
  }

  return (
    <button
      onClick={() => navigate('/leaderboard')}
      className="relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] bg-transparent border-none text-[17px] hover:bg-[var(--surface)] transition cursor-pointer"
      aria-label={t('nav.leaderboard')}
      title={t('nav.leaderboard')}
    >
      🏆
    </button>
  );
}
