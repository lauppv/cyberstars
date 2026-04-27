export interface UserLessonProgress {
  id: number;
  user_id: number;
  course_key: string;
  lesson_slug: string;
  completed: boolean;
  completed_at: Date | null;
  last_accessed_at: Date;
}

export interface UserSavedCode {
  id: number;
  user_id: number;
  course_key: string;
  lesson_slug: string;
  code: string;
  updated_at: Date;
}

export interface CourseProgressSummary {
  courseKey: string;
  completed: number;
  total: number;
  lessons: {
    slug: string;
    title: string;
    completed: boolean;
    completedAt: string | null;
  }[];
}
