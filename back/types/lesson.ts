export interface LessonContent {
  title: string;
  content: string;
}

export interface LessonRow {
  id: number;
  course_key: string;
  slug: string;
  title: string;
  sort_order: number;
  has_code_file: boolean;
}

export interface CurriculumRow {
  id: number;
  key: string;
  title: string;
  description: string;
  sort_order: number;
}
