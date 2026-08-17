import { useTranslation } from 'react-i18next';
import type {
  InjectValue,
  RunTestsResponse,
  StructureFailure,
  TestCaseResult,
} from '../../../shared/tests';
import { Deco } from '../ui/Deco';

interface TestResultsProps {
  results: RunTestsResponse;
  onClose: () => void;
}

function structureMessage(
  failure: StructureFailure,
  t: (key: string, opts?: Record<string, unknown>) => string,
): string {
  return t(`tests.structure.${failure.type}.${failure.rule.kind}`, {
    name: failure.rule.name,
    values: failure.rule.values?.join(', '),
    contains: failure.rule.contains,
  });
}

// Booleans render as Python literals — that's what the student would type.
function formatValue(value: InjectValue): string {
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

function CaseRow({ result }: { result: TestCaseResult }) {
  const { t } = useTranslation();
  const label = `${t('tests.caseN', { n: result.index + 1 })}${result.visible ? '' : ` (${t('tests.hidden')})`}`;

  return (
    <div className="border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2">
      <div className="flex items-center gap-2 text-[12px] font-semibold">
        <span className={result.passed ? 'text-[var(--success)]' : 'text-[var(--error)]'}>
          {result.passed ? '✓' : '✗'}
        </span>
        <span className="text-[var(--text2)]">{label}</span>
        <span className={result.passed ? 'text-[var(--success)]' : 'text-[var(--error)]'}>
          {result.passed ? t('tests.passed') : t('tests.failed')}
        </span>
      </div>
      {!result.passed && (
        <div className="mt-2 flex flex-col gap-1.5 text-[12px] font-mono">
          {result.inject && (
            <div>
              <span className="text-[var(--text3)]">{t('tests.input')}:</span>
              {Object.entries(result.inject).map(([name, value]) => (
                <div key={name} className="pl-3 text-[var(--text2)]">
                  {name} ={' '}
                  {Array.isArray(value) ? value.map(formatValue).join(' → ') : formatValue(value)}
                </div>
              ))}
            </div>
          )}
          {result.stdin !== undefined && (
            <div>
              <span className="text-[var(--text3)]">{t('tests.input')}:</span>
              <pre className="pl-3 text-[var(--text2)] whitespace-pre-wrap m-0">
                {result.stdin.replace(/\n$/, '') || '∅'}
              </pre>
            </div>
          )}
          {result.error === 'timeout' ? (
            <div className="text-[var(--error)]">{t('tests.timeout')}</div>
          ) : result.error ? (
            <div>
              <span className="text-[var(--text3)]">{t('tests.runtimeError')}:</span>
              <pre className="pl-3 text-[var(--error)] whitespace-pre-wrap m-0">{result.error}</pre>
            </div>
          ) : (
            <>
              {result.expected !== undefined && (
                <div>
                  <span className="text-[var(--text3)]">{t('tests.expected')}:</span>
                  <pre className="pl-3 text-[var(--success)] whitespace-pre-wrap m-0">
                    {result.expected}
                  </pre>
                </div>
              )}
              {result.actual !== undefined && (
                <div>
                  <span className="text-[var(--text3)]">{t('tests.actual')}:</span>
                  <pre className="pl-3 text-[var(--text)] whitespace-pre-wrap m-0">
                    {result.actual || '∅'}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function TestResults({ results, onClose }: TestResultsProps) {
  const { t } = useTranslation();
  const passed = results.status === 'passed';

  return (
    <div className="flex-1 min-h-0 overflow-y-auto rounded-[var(--radius-sm)] panel p-3">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`flex items-center gap-2 font-bold text-[14px] ${passed ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}
        >
          <Deco className="text-[18px]">{passed ? '✅' : '❌'}</Deco>
          <Deco only="min" className="text-[16px]">
            {passed ? '✓' : '✗'}
          </Deco>
          {passed ? t('tests.passedTitle') : t('tests.failedTitle')}
        </div>
        <button
          onClick={onClose}
          aria-label={t('tests.close')}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border border-[var(--border)]"
        >
          ✕
        </button>
      </div>

      {results.syntaxError && (
        <div className="text-[12px] font-mono text-[var(--error)] mb-3">
          {t('tests.syntaxError', { message: results.syntaxError })}
        </div>
      )}

      {results.structureFailures.length > 0 && (
        <div className="mb-3">
          <div className="text-[11px] font-semibold tracking-[1px] text-[var(--text3)] mb-1.5">
            {t('tests.structureTitle')}
          </div>
          <ul className="flex flex-col gap-1 m-0 pl-0 list-none">
            {results.structureFailures.map((failure, i) => (
              <li key={i} className="text-[12px] text-[var(--warning)]">
                ⚠ {structureMessage(failure, t)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.cases.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.cases.map((result) => (
            <CaseRow key={result.index} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
