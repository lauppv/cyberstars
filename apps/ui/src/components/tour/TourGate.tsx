import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { INTERESTS_PATH, TOUR_PATH } from '../../constants/tour';

// A new account sees nothing but the tour lesson until its tests pass and the
// server stamps onboardedAt, then nothing but the question of what it wants to
// learn until it answers. Every other route sends it back there.
export function TourGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (user && !user.onboardedAt && pathname !== TOUR_PATH) {
    return <Navigate to={TOUR_PATH} replace />;
  }
  if (user?.onboardedAt && !user.interests && pathname !== INTERESTS_PATH) {
    return <Navigate to={INTERESTS_PATH} replace />;
  }
  return <>{children}</>;
}
