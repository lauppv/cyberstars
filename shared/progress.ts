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
  lessons: LessonProgressItem[];
}
