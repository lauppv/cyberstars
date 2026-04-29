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

export interface TestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
}

export interface SubmitResult {
  passed: number;
  total: number;
  allPassed: boolean;
  results: TestResult[];
}
