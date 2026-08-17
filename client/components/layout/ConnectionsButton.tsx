import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { canAccessFeature } from '../../../shared/features';
import { LockedIcon } from './LockedIcon';
import { TopbarAction } from './TopbarAction';

// People icon sitting between the leaderboard and messages buttons. Non-admins
// on prod see it locked ("coming soon") like the other preview icons. New
// requests surface through the notification bell, so this button carries no
// badge of its own.
export function ConnectionsButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!canAccessFeature('connections', user?.role, import.meta.env.PROD)) {
    return user ? (
      <LockedIcon emoji="🤝" label={t('connections.title')} short={t('topbar.short.connections')} />
    ) : null;
  }

  return (
    <TopbarAction
      emoji="🤝"
      label={t('connections.title')}
      short={t('topbar.short.connections')}
      onClick={() => navigate('/connections')}
    />
  );
}
