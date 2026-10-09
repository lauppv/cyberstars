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

// Short runs keep a decimal so 0.4 ms and 0.9 ms don't both read as 1 ms.
export function formatMs(ms: number, locale: string): string {
  const digits = ms < 10 ? 1 : 0;
  return ms.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: digits });
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

export function timeAgo(iso: string, t: TFunction): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('forum.time.justNow');
  if (mins < 60) return t('forum.time.minAgo', { count: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('forum.time.hourAgo', { count: hrs });
  const days = Math.floor(hrs / 24);
  if (days < 30) return t('forum.time.dayAgo', { count: days });
  return new Date(iso).toLocaleDateString();
}

// "Test 3", or "Test 3 (hidden)" for a case the student can't see in the lesson.
export function caseLabel(result: TestCaseResult, t: TFunction): string {
  return `${t('tests.caseN', { n: result.index + 1 })}${result.visible ? '' : ` (${t('tests.hidden')})`}`;
}
