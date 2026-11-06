export interface LeaderboardEntry {
  rank: number; // 1-based, one place per user; a tie goes to whoever reached the XP first
  userId: number;
  name: string;
  avatarUrl: string | null;
  totalXp: number;
  lessonsDone: number;
  level: number; // derived via levelFromXp(totalXp)
  titleKey: string; // i18n key for the cosmos level title
}

export interface LeaderboardPage {
  entries: LeaderboardEntry[];
  total: number; // total ranked users, for pagination / "load more"
}
