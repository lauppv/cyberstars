export interface LessonProgressItem {
  slug: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
}

export interface CourseProgress {
  courseKey: string;
  completed: number;
  total: number;
  lessons: LessonProgressItem[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser: boolean;
}
