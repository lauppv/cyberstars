import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canAccessFeature } from '../../../shared/features';

// Wraps a user's name (or avatar) in a link to their public profile. Profiles
// are logged-in only (they ride the `leaderboard` gate), so for guests — or
// while the gate is closed — the children render as plain text instead of a
// dead link. stopPropagation lets the link live inside clickable rows (thread
// lists, inbox rows) without triggering the row's own navigation.
export function UserLink({
  userId,
  className,
  children,
}: {
  userId: number;
  className?: string;
  children: ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !canAccessFeature('leaderboard', user.role, import.meta.env.PROD)) {
    return <span className={className}>{children}</span>;
  }
  return (
    <Link
      to={`/u/${userId}`}
      className={`no-underline text-inherit hover:text-[var(--accent)] transition-colors cursor-pointer ${className ?? ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
}
