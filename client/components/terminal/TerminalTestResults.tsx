import { useTranslation } from 'react-i18next';
import type { TerminalTestResult } from '../../../shared/terminal';

interface Props {
  results: TerminalTestResult;
  onClose: () => void;
}

export function TerminalTestResults({ results, onClose }: Props) {
  const { t } = useTranslation();
  const passed = results.status === 'passed';

  return (
    <div className="border-t border-[var(--accent)]/20 bg-[rgba(22,22,29,0.4)] backdrop-blur-[12px] p-3 max-h-[45%] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div
          className={`flex items-center gap-2 font-bold text-[14px] ${passed ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}
        >
          <span className="text-[18px]">{passed ? '✅' : '❌'}</span>
          {passed ? t('terminalTests.passedTitle') : t('terminalTests.failedTitle')}
        </div>
        <button
          onClick={onClose}
          aria-label={t('tests.close')}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition cursor-pointer bg-transparent border border-[var(--accent)]/30"
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
