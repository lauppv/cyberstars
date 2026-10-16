import type { Interest } from './interests.js';
import type { PlacementLevel } from './placement.js';

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'FOUNDER';

// Admin-level privilege. FOUNDER is a superset of ADMIN, so every admin-gated
// check must accept both. Use this instead of `role === 'ADMIN'` everywhere a
// capability (not the exact role) is what matters.
export function isAdmin(role: UserRole | undefined | null): boolean {
  return role === 'ADMIN' || role === 'FOUNDER';
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  bio: string | null;
  status: string | null;
  statusExpiresAt: string | null;
  pendingEmail: string | null;
  createdAt: string;
  showBio: boolean;
  showStats: boolean;
  showProgress: boolean;
  showActivity: boolean;
  showConnections: boolean;
  // When the first-lesson tour was finished; null holds the account on it.
  onboardedAt: string | null;
  // From the landing page's placement test; null when it wasn't taken.
  placementLevel: PlacementLevel | null;
  // What they want to learn, from the screen after the tour; null until asked.
  interests: Interest[] | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  placementScore?: number;
}

export interface TokenPayload {
  id: number;
}
