import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { canAccessFeature } from '../../../shared/features';
import { LockedIcon } from './LockedIcon';
import { TopbarAction } from './TopbarAction';

// Trophy icon sitting between the notification bell and the messages button.
// Non-admins on prod see it locked ("coming soon") like the other preview icons.
export function LeaderboardButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!canAccessFeature('leaderboard', user?.role, import.meta.env.PROD)) {
    return (
      <LockedIcon emoji="🏆" label={t('nav.leaderboard')} short={t('topbar.short.leaderboard')} />
    );
  }

  return (
    <TopbarAction
      emoji="🏆"
      label={t('nav.leaderboard')}
      short={t('topbar.short.leaderboard')}
      onClick={() => navigate('/leaderboard')}
    />
  );
}
