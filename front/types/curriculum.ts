export interface Course {
  key: string;
  title: string;
  description: string;
  lessons: LessonMeta[];
}

export interface LessonMeta {
  slug: string;
  title: string;
  sortOrder: number;
}

export interface LessonContent {
  title: string;
  content: string;
}
