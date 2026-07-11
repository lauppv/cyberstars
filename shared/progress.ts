interface LessonProgressItem {
  slug: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  lastAccessedAt: string | null;
}

export interface CourseProgress {
  courseKey: string;
  completed: number;
  total: number;
  // XP earned from completed lessons vs. the course's full XP, both derived
  // server-side from lesson positions — never written by or read from a client.
  earnedXp: number;
  totalXp: number;
  lessons: LessonProgressItem[];
}
