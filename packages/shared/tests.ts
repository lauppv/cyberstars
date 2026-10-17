// Lesson test-case validation: shapes shared by the server judge
// (lesson-tests.service) and the client results panel. A lesson opts in by
// shipping a <slug>-tests.json next to its markdown (server-side only; the
// static-content generator does not copy it into public/).
import type { CodeLanguage } from './constants.js';

// 'masked' ignores integer runs (nondeterministic PIDs); 'unordered' compares
// the set of lines (thread/process output whose line order is nondeterministic);
// 'template' checks the output against the spec's `template`, whose blanks the
// student fills with anything (their own name and age).
export type TestComparator = 'exact' | 'trimmed' | 'masked' | 'unordered' | 'template';

// A template's text has to match as written, while each `<word>` blank takes
// any text on its line with at least one visible character. The judge holds
// the output to it, and the result panel fills the blanks from it.
export function templateRegex(template: string): RegExp {
  const pattern = template
    .split(/<\w+>/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^\\n]*?\\S[^\\n]*?');
  return new RegExp(`^${pattern}$`);
}

// Which language knows which kind lives in STRUCTURE_KINDS (validate-tests);
// a runner treats a kind it doesn't know as present, so a spec must not use one.
type StructureKind =
  | 'call'
  | 'variable'
  | 'function'
  | 'loop'
  | 'recursion'
  | 'fstring'
  | 'int_literal'
  | 'comment'
  | 'string_expr'
  // statements: switch is Python's match
  | 'if'
  | 'switch'
  | 'break'
  | 'continue'
  | 'try'
  | 'nested_loop'
  /** an operator by its spelling: '&&', 'and', '%', '<<', 'not in' ... */
  | 'operator'
  // classes: a class of the student's own (optionally by name), and an object made from one
  | 'class'
  | 'object'
  | 'extends'
  | 'implements'
  | 'interface'
  | 'enum'
  | 'override'
  | 'overload'
  /** java: a field, method, local or class carrying `name` (static, final, private, abstract) */
  | 'modifier'
  | 'instanceof'
  | 'cast'
  // python
  | 'return'
  | 'default_param'
  | 'slice'
  // c
  | 'struct'
  | 'typedef'
  | 'pointer'
  /** c: reading or writing through a pointer (*p, p->field) */
  | 'deref'
  | 'sizeof'
  | 'define';

type LoopType = 'for' | 'while' | 'do_while' | 'comprehension';

interface StructureRule {
  kind: StructureKind;
  /**
   * call / variable / function / class name, operator spelling, modifier
   * keyword, or define name. A function or class rule without one asks for any
   * function / class of the student's own (main aside), named however they like.
   */
  name?: string;
  /**
   * loop: the loop statement the lesson teaches. Without it any loop counts;
   * with it only that statement does (Java's for-each counts as 'for'), so a
   * for lesson can't be passed with a while. 'comprehension' is Python's
   * [x for x in ...] (any comprehension or generator); C and Java have none.
   */
  type?: LoopType;
  /** python: check the rule only inside the function with this name. */
  in?: string;
  /** int_literal: forbidden constant values */
  values?: number[];
  /**
   * comment: substring that must appear inside a comment (whitespace-
   * insensitive), so "comment out this line" missions can verify the line
   * really became a comment. string_expr (forbid) blocks the counterfeit:
   * wrapping the line in quotes to make a dead "floating string" statement.
   */
  contains?: string;
}

/**
 * A scalar, `{ $list: [...] }` to inject a whole list as one value, or
 * `{ $dict: {...} }` to inject a whole dict (insertion order preserved).
 */
export type InjectValue =
  | string
  | number
  | boolean
  | { $list: InjectValue[] }
  | { $dict: Record<string, InjectValue> };

interface LessonTestCase {
  /** Visible cases show expected vs actual on failure; hidden ones only the input. */
  visible?: boolean;
  /**
   * Values written into the lesson's input variables before the run. A list
   * feeds successive assignments of that variable (reassignment lessons), so
   * the value a student picked never matters, only the behavior.
   */
  inject?: Record<string, InjectValue | InjectValue[]>;
  /**
   * Text fed to the program's stdin (for lessons that read with input(),
   * including loops that read repeatedly, since injection only reaches module-level
   * assignments). The reference solution receives the same stdin, so the value
   * the student typed never matters, only the behavior. Combinable with inject.
   */
  stdin?: string;
  /**
   * Bulk case produced offline by a generator script and stored concretely
   * (always hidden), appended after the hand-written cases.
   */
  generated?: boolean;
  /**
   * The load test: the lesson's one large input, always hidden and last. The
   * runtime the student sees comes from this case alone, since small inputs
   * run in hundredths of a millisecond and say nothing about speed.
   */
  load?: boolean;
}

export interface LessonTestsSpec {
  comparator?: TestComparator;
  /**
   * template: the expected output, where each `<word>` is a blank that any
   * text of at least one character on that line fills. It is what the student
   * sees as the expected output, in place of our solution's.
   */
  template?: string;
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
  /** stdin fed to the program, shown on failed visible cases so the student can debug. */
  stdin?: string;
  /** Present on passed cases and on failed visible ones, never on a failed hidden one. */
  expected?: string;
  actual?: string;
  /** Runtime problem: 'timeout' or the program's stderr. */
  error?: string;
  generated?: boolean;
  /**
   * The load test. Its input and outputs are too large to show, so it carries
   * none of them, only whether it passed, its error and its times.
   */
  load?: true;
  /**
   * How long the student's program's own code ran on this case, in ms
   * (startup and compile excluded); absent when it crashed or skipped its exit.
   */
  userMs?: number;
  /** The same for the reference solution, measured in the same run. */
  solutionMs?: number;
}

export interface RunTestsResponse {
  status: 'passed' | 'failed';
  /**
   * How the lesson compares outputs. The page marks the difference between
   * expected and actual only when they were compared as text ('trimmed',
   * 'exact', and 'template' once its blanks are filled from the student's
   * output): a lesson that ignores numbers or line order would show a false one.
   */
  comparator: TestComparator;
  syntaxError?: string;
  structureFailures: StructureFailure[];
  /**
   * Cases in the order they ran. The judge stops at the first failing case, so
   * this holds every passed case plus at most one failed case, which is last.
   */
  cases: TestCaseResult[];
  /** Number of cases in the spec, run or not (the Y in "X / Y passed"). */
  total: number;
  /** Cases passed before the run stopped (the X in "X / Y passed"). */
  passedCount: number;
  /**
   * The load test's userMs / solutionMs, once the student's program passed it.
   * Absent when the lesson has no load test or the run never got through it.
   */
  runtimeMs?: number;
  referenceMs?: number;
  /** The stored attempt, for a logged-in student (guests keep no history). */
  submission?: SubmissionSummary;
}

/** One judge attempt, as listed in the lesson's submission history. */
export interface SubmissionSummary {
  id: number;
  status: 'passed' | 'failed';
  passedCount: number;
  total: number;
  runtimeMs: number | null;
  referenceMs: number | null;
  lang: 'en' | 'ro';
  /** The language the code ran in. */
  language: CodeLanguage;
  /** ISO timestamp. */
  createdAt: string;
}

/** A stored attempt with the code that was judged and why it stopped. */
export interface SubmissionDetail extends SubmissionSummary {
  code: string;
  syntaxError: string | null;
  structureFailures: StructureFailure[];
  /** The case the run stopped on, when a case failed. */
  failedCase: TestCaseResult | null;
  /** The lesson's comparator, read when the attempt is opened; absent once the lesson has no tests. */
  comparator?: TestComparator;
}
