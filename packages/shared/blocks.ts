// Someone the student blocked, as Settings lists them (CYB-140)
export interface BlockedUser {
  id: number;
  name: string;
  avatarUrl: string | null;
  blockedAt: string;
}
