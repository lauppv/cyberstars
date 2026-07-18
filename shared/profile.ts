// Public-profile DTO returned by GET /api/users/:id/profile. Each optional
// section is present only when the target user's matching privacy flag is on
// (own view always sees everything). Name/avatar/memberSince are always public.

interface PublicProfileCourse {
  courseKey: string;
  lessons: string[]; // completed lesson slugs; the client resolves titles from curriculum
}

interface PublicProfileStats {
  lessonsDone: number;
  activeCourses: number;
  streak: number;
  courses: PublicProfileCourse[]; // per-course completed lessons, most completed first
}

interface PublicProfileProgress {
  level: number;
  totalXp: number; // earned XP (same figure the leaderboard ranks on)
  titleKey: string; // i18n key for the cosmos level title
  rank: number | null; // leaderboard rank, null if unranked (0 XP)
  badges: number; // count of earned badges across all courses
}

export interface PublicProfile {
  userId: number;
  name: string;
  avatarUrl: string | null;
  memberSince: string; // ISO
  isSelf: boolean; // true when the viewer is looking at their own profile
  status: string | null; // null when hidden or unset
  bio: string | null; // null when hidden or unset
  stats: PublicProfileStats | null; // null when hidden
  progress: PublicProfileProgress | null; // null when hidden
  // ISO timestamps of completed lessons in the recent window, for the activity
  // heatmap. Null when hidden; the client buckets them by local day.
  activity: string[] | null;
}
