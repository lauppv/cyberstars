import type { ReactNode } from 'react';
import { Navigate, matchPath, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

// The only pages a guest can open: the welcome page, the placement test,
// sign-in, the courses and algorithm challenges they can run code in, and the
// Almanac. Every other page,
// a new one included, takes an account.
const GUEST_PATHS = [
  '/',
  '/getstarted',
  '/placement',
  '/courses',
  '/courses/:course',
  '/algorithms',
  '/algorithms/:lang',
  '/lesson/:category/:lesson',
  '/almanac',
  '/almanac/:slug',
];

// Sends a guest from any other page to sign-in, which brings them back once
// they log in. Until the app knows who is signed in it shows nothing there, so
// a student who reloads isn't sent away and a guest never sees the page.
export function GuestGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const { pathname, search } = useLocation();
  if (user || GUEST_PATHS.some((path) => matchPath(path, pathname))) return <>{children}</>;
  if (isLoading) return null;
  return <Navigate to="/getstarted" replace state={{ from: pathname + search }} />;
}
