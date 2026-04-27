export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface TokenPayload {
  id: number;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
}
