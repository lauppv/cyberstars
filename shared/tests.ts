// Lesson test-case validation: shapes shared by the server judge
// (lesson-tests.service) and the client results panel. A lesson opts in by
// shipping a <slug>-tests.json next to its markdown (server-side only — the
// static-content generator does not copy it into public/).

export type TestComparator = 'exact' | 'trimmed';

type StructureKind = 'call' | 'variable' | 'function' | 'loop' | 'fstring' | 'int_literal';

interface StructureRule {
  kind: StructureKind;
  /** call / variable / function name */
  name?: string;
  /** int_literal: forbidden constant values */
  values?: number[];
}

type InjectValue = string | number | boolean;

interface LessonTestCase {
  /** Visible cases show expected vs actual on failure; hidden ones only the input. */
  visible?: boolean;
  /**
   * Values written into the lesson's input variables before the run. A list
   * feeds successive assignments of that variable (reassignment lessons), so
   * the value a student picked never matters — only the behavior.
   */
  inject?: Record<string, InjectValue | InjectValue[]>;
}

export interface LessonTestsSpec {
  comparator?: TestComparator;
  structure?: {
    requires?: StructureRule[];
    forbids?: StructureRule[];
  };
  cases: LessonTestCase[];
}

export interface StructureFailure {
  type: 'require' | 'forbid';
  rule: StructureRule;
}

export interface TestCaseResult {
  index: number;
  visible: boolean;
  passed: boolean;
  inject?: Record<string, InjectValue | InjectValue[]>;
  /** Only present on failed visible cases. */
  expected?: string;
  actual?: string;
  /** Runtime problem: 'timeout' or the program's stderr. */
  error?: string;
}

export interface RunTestsResponse {
  status: 'passed' | 'failed';
  syntaxError?: string;
  structureFailures: StructureFailure[];
  cases: TestCaseResult[];
}
