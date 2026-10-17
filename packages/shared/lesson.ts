export interface LessonContent {
  title: string;
  content: string;
}

export interface LessonMeta {
  slug: string;
  title: string;
  /** The title in Romanian, when it has one (packages/content/curriculum-ro.ts). */
  titleRo?: string;
  sortOrder: number;
  /** Present when the lesson ships a <slug>-tests.json validated by the server judge. */
  hasTests?: boolean;
  /** Present when the lesson ships a <slug>-solution.md, revealed via the usage API. */
  hasSolution?: boolean;
}

export interface Course {
  key: string;
  title: string;
  description: string;
  lessons: LessonMeta[];
}
