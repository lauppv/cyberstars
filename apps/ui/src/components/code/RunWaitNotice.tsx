import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hourglass, X } from 'lucide-react';
import { Corner } from '../layout/Corner';
import { dismissBusy, useRunWait } from '../../hooks/useRunWait';

const LINE_EVERY_MS = 5000;

function pickLine(count: number, not?: number): number {
  const picked = Math.floor(Math.random() * (not === undefined ? count : count - 1));
  return not !== undefined && picked >= not ? picked + 1 : picked;
}

// While a run waits for a free sandbox, a light line under the notice, a new
// one every few seconds
function WaitingLine() {
  const { t } = useTranslation();
  const lines = t('runWait.lines', { returnObjects: true }) as string[];
  const [line, setLine] = useState(() => pickLine(lines.length));
  useEffect(() => {
    const timer = setInterval(
      () => setLine((shown) => pickLine(lines.length, shown)),
      LINE_EVERY_MS,
    );
    return () => clearInterval(timer);
  }, [lines.length]);
  return <p className="m-0 mt-1 text-xs text-[var(--text3)]">{lines[line]}</p>;
}

// Bottom right, above the tutor's toasts: a run is waiting for a free sandbox,
// or waited in vain and can be tried again
export function RunWaitNotice() {
  const { t } = useTranslation();
  const wait = useRunWait();
  if (!wait) return null;
  return (
    <Corner first>
      <div
        role="status"
        className="flex items-start gap-3 pl-3 pr-2 py-2.5 w-[360px] max-w-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]"
        style={{
          boxShadow: '0 8px 32px #0008',
          animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <Hourglass size={18} className="shrink-0 mt-0.5 text-[var(--accent)]" aria-hidden="true" />
        {wait.kind === 'waiting' ? (
          <div className="min-w-0 pr-1">
            <p className="m-0 text-sm font-semibold text-[var(--text)]">{t('runWait.waiting')}</p>
            <WaitingLine />
          </div>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-sm font-semibold text-[var(--text)]">{t('runWait.busy')}</p>
              <button
                type="button"
                onClick={wait.retry}
                className="mt-1 bg-transparent border-none p-0 text-sm font-semibold text-[var(--accent)] hover:underline cursor-pointer"
              >
                {t('runWait.tryAgain')}
              </button>
            </div>
            <button
              type="button"
              onClick={dismissBusy}
              aria-label={t('common.close')}
              className="grid place-items-center w-7 h-7 rounded bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] cursor-pointer"
            >
              <X size={14} />
            </button>
          </>
        )}
      </div>
    </Corner>
  );
}
