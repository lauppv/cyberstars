import { useCallback, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { INTERESTS_PATH, TOUR_PATH } from '../../constants/tour';
import { TourNotice } from './TourNotice';

// A new account sees nothing but the tour lesson until its tests pass and the
// server stamps onboardedAt, then nothing but the question of what it wants to
// learn until it answers. Every other route sends it back there.
export function TourGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const inTour = !!user && !user.onboardedAt;
  // A link that leads off the tour lesson (one in a tutor's answer, the post
  // a shared code opens) brings the student straight back, and the notice says
  // why. Bumped on every return, so it replays.
  const [returned, setReturned] = useState(0);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (inTour && lastPath === TOUR_PATH) setReturned((n) => n + 1);
  }
  const hideNotice = useCallback(() => setReturned(0), []);
  const notice = <TourNotice key={returned} visible={returned > 0} onClose={hideNotice} />;

  if (inTour && pathname !== TOUR_PATH) {
    return (
      <>
        <Navigate to={TOUR_PATH} replace />
        {notice}
      </>
    );
  }
  if (user?.onboardedAt && !user.interests && pathname !== INTERESTS_PATH) {
    return <Navigate to={INTERESTS_PATH} replace />;
  }
  return (
    <>
      {children}
      {notice}
    </>
  );
}
