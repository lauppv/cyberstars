import { useTranslation } from 'react-i18next';
import type { TestCaseResult } from '../../../shared/tests';
import { CaseInput, Field } from './CaseFields';
import { caseLabel } from './format';

// The test a run stopped on. A hidden test shows what went in and what came
// out, never what was expected, so it can't be read off and hardcoded.
export function FailedCase({ result }: { result: TestCaseResult }) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] font-semibold text-[var(--text)] m-0">{caseLabel(result, t)}</h3>
      {result.load && (
        <p className="m-0 text-[13px] text-[var(--text3)]">{t('tests.loadTooLarge')}</p>
      )}
      <CaseInput result={result} />
      {result.error === 'timeout' ? (
        <p className="m-0 text-[13px] text-[var(--error)]">{t('tests.timeout')}</p>
      ) : result.error ? (
        <Field label={t('tests.runtimeError')} tone="text-[var(--error)]">
          {result.error}
        </Field>
      ) : (
        <>
          {result.visible && result.expected !== undefined && (
            <Field label={t('tests.expected')}>{result.expected}</Field>
          )}
          {result.actual !== undefined && (
            <Field label={t('tests.actual')}>{result.actual || '∅'}</Field>
          )}
        </>
      )}
    </section>
  );
}
