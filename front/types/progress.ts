export interface LessonProgress {
  courseKey: string;
  lessonSlug: string;
  completed: boolean;
  completedAt: string | null;
}

export interface CourseProgress {
  courseKey: string;
  completed: number;
  total: number;
  lessons: LessonProgress[];
}
