import type { TFunction } from 'i18next';
import type { InjectValue, StructureFailure, TestCaseResult } from '../../../shared/tests';

export function structureMessage(failure: StructureFailure, t: TFunction): string {
  return t(`tests.structure.${failure.type}.${failure.rule.kind}`, {
    name: failure.rule.name,
    values: failure.rule.values?.join(', '),
    contains: failure.rule.contains,
  });
}

// Booleans render as Python literals, since that's what the student would type.
export function formatValue(value: InjectValue): string {
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (value !== null && typeof value === 'object' && '$list' in value) {
    return `[${value.$list.map(formatValue).join(', ')}]`;
  }
  if (value !== null && typeof value === 'object' && '$dict' in value) {
    const pairs = Object.entries(value.$dict).map(
      ([k, v]) => `${JSON.stringify(k)}: ${formatValue(v)}`,
    );
    return `{${pairs.join(', ')}}`;
  }
  return JSON.stringify(value);
}

type Verdict =
  | 'accepted'
  | 'syntaxError'
  | 'wrongAnswer'
  | 'runtimeError'
  | 'timeLimit'
  | 'checksFailed'
  | 'failed';

// What stopped the run, in the order a student has to fix things: code that
// doesn't parse, then the first failing test, then the code checks.
export function verdictOf(run: {
  status: 'passed' | 'failed';
  syntaxError?: string | null;
  structureFailures: StructureFailure[];
  failedCase: TestCaseResult | null;
}): Verdict {
  if (run.status === 'passed') return 'accepted';
  if (run.syntaxError) return 'syntaxError';
  const failed = run.failedCase;
  if (failed) {
    if (failed.error === 'timeout') return 'timeLimit';
    if (failed.error) return 'runtimeError';
    return 'wrongAnswer';
  }
  if (run.structureFailures.length > 0) return 'checksFailed';
  return 'failed';
}
