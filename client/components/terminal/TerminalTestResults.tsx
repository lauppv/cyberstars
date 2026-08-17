import { useTranslation } from 'react-i18next';
import type { TerminalTestResult } from '../../../shared/terminal';
import { Deco } from '../ui/Deco';

interface Props {
  results: TerminalTestResult;
  onClose: () => void;
}

export function TerminalTestResults({ results, onClose }: Props) {
  const { t } = useTranslation();
  const passed = results.status === 'passed';

  return (
    <div className="border-t border-[var(--border)] bg-[var(--glass)] p-3 max-h-[45%] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`flex items-center gap-2 font-bold text-[14px] ${passed ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}
        >
          <Deco className="text-[18px]">{passed ? '✅' : '❌'}</Deco>
          <Deco only="min" className="text-[16px]">
            {passed ? '✓' : '✗'}
          </Deco>
          {passed ? t('terminalTests.passedTitle') : t('terminalTests.failedTitle')}
        </div>
        <button
          onClick={onClose}
          aria-label={t('tests.close')}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border border-[var(--border)]"
        >
          ✕
        </button>
      </div>
      <ul className="flex flex-col gap-1.5 m-0 pl-0 list-none">
        {results.checks.map((check, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px]">
            <span
              className={`shrink-0 font-semibold ${check.passed ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}
            >
              {check.passed ? '✓' : '✗'}
            </span>
            <span className={check.passed ? 'text-[var(--text2)]' : 'text-[var(--text)]'}>
              {t(check.messageKey, check.params)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
