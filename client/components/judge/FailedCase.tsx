import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { TestCaseResult } from '../../../shared/tests';
import { formatValue } from './format';

function Field({ label, tone, children }: { label: string; tone?: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[12px] text-[var(--text3)] mb-1">{label}</div>
      <div
        className={`px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--glass)] font-mono text-[13px] whitespace-pre-wrap break-words ${tone ?? 'text-[var(--text)]'}`}
      >
        {children}
      </div>
    </div>
  );
}

// The test a run stopped on. A hidden test shows what went in and what came
// out, never what was expected, so it can't be read off and hardcoded.
export function FailedCase({ result }: { result: TestCaseResult }) {
  const { t } = useTranslation();
  const label = `${t('tests.caseN', { n: result.index + 1 })}${result.visible ? '' : ` (${t('tests.hidden')})`}`;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] font-semibold text-[var(--text)] m-0">{label}</h3>
      {result.inject && (
        <Field label={t('tests.input')}>
          {Object.entries(result.inject).map(([name, value]) => (
            <div key={name}>
              {name} ={' '}
              {Array.isArray(value) ? value.map(formatValue).join(' → ') : formatValue(value)}
            </div>
          ))}
        </Field>
      )}
      {result.stdin !== undefined && (
        <Field label={t('tests.input')}>{result.stdin.replace(/\n$/, '') || '∅'}</Field>
      )}
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
