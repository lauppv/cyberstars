import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { TestCaseResult } from '../../../shared/tests';
import { formatValue } from './format';

export function Field({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: string;
  children: ReactNode;
}) {
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

// What a test fed the program: injected values or stdin.
export function CaseInput({ result }: { result: TestCaseResult }) {
  const { t } = useTranslation();
  return (
    <>
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
    </>
  );
}
