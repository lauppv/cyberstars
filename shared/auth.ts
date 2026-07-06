export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

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
