export type TestMode = "exact" | "contains" | "any" | "line";

export interface TestCase {
  name: string;
  input: string;
  expected: string;
  mode: TestMode;
  line?: number;
  overrides?: Record<string, string>;
  append?: string;
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
