import { useTranslation } from 'react-i18next';
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import type { StructureFailure, TestCaseResult } from '../../../shared/tests';
import { structureMessage, verdictOf } from './format';

interface VerdictProps {
  status: 'passed' | 'failed';
  syntaxError?: string | null;
  structureFailures: StructureFailure[];
  failedCase: TestCaseResult | null;
  passedCount: number;
  total: number;
}

// The head of a judged run: what stopped it, how far it got, and the reasons
// that aren't a single test (code that doesn't parse, failed code checks).
export function Verdict({
  status,
  syntaxError,
  structureFailures,
  failedCase,
  passedCount,
  total,
}: VerdictProps) {
  const { t } = useTranslation();
  const verdict = verdictOf({ status, syntaxError, structureFailures, failedCase });
  const accepted = verdict === 'accepted';
  const Icon = accepted ? CircleCheck : CircleX;
  const share = total > 0 ? Math.min(passedCount / total, 1) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2
          className={`flex items-center gap-2 text-[20px] font-semibold tracking-[-0.3px] m-0 ${accepted ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}
        >
          <Icon size={22} strokeWidth={2} aria-hidden="true" />
          {t(`tests.verdict.${verdict}`)}
        </h2>
        {failedCase && (
          <p className="mt-1 text-[13px] text-[var(--text2)]">
            {t('tests.stoppedAt', { n: failedCase.index + 1 })}
            {!failedCase.visible && ` (${t('tests.hidden')})`}
          </p>
        )}
      </div>

      {!syntaxError && (
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-semibold text-[var(--text)]">
              {passedCount} / {total}
            </span>
            <span className="text-[13px] text-[var(--text3)]">{t('tests.testsPassed')}</span>
          </div>
          <div
            className="mt-2 h-1.5 rounded-full bg-[var(--surface2)] overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-[var(--success)]"
              style={{ width: `${share * 100}%` }}
            />
          </div>
        </div>
      )}

      {syntaxError && (
        <pre className="m-0 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--glass)] text-[13px] font-mono text-[var(--error)] whitespace-pre-wrap break-words">
          {syntaxError}
        </pre>
      )}

      {structureFailures.length > 0 && (
        <div>
          <h3 className="text-[12px] font-semibold text-[var(--text3)] mb-2">
            {t('tests.structureTitle')}
          </h3>
          <ul className="flex flex-col gap-1.5 m-0 pl-0 list-none">
            {structureFailures.map((failure, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--text)]">
                <TriangleAlert
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="shrink-0 mt-0.5 text-[var(--warning)]"
                />
                {structureMessage(failure, t)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
