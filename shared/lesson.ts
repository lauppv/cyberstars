export interface LessonContent {
  title: string;
  content: string;
}

export interface LessonMeta {
  slug: string;
  title: string;
  sortOrder: number;
}

export interface Course {
  key: string;
  title: string;
  description: string;
  lessons: LessonMeta[];
}
