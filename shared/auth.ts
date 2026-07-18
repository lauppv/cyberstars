export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'FOUNDER';

// Admin-level privilege. FOUNDER is a superset of ADMIN, so every admin-gated
// check must accept both — use this instead of `role === 'ADMIN'` everywhere a
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
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface TokenPayload {
  id: number;
}
