import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsage } from '../../context/UsageContext';
import * as usageService from '../../services/usageService';
import { UsageMeter } from '../usage/UsageMeter';

// Gate shown before the solution is revealed: confirms intent, spends one of the
// daily Show Solution reveals and hands back the solution, which only the server
// has. Only rendered for signed-in students.
export function SolutionConfirmModal({
  courseKey,
  lessonSlug,
  lang,
  onConfirmed,
  onClose,
}: {
  courseKey: string;
  lessonSlug: string;
  lang: 'en' | 'ro';
  onConfirmed: (solution: string) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { summary, applySummary } = useUsage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const state = summary?.showSolution;
  const depleted = !!state && !state.unlimited && state.remaining <= 0;

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      const { solution, usage } = await usageService.revealSolution(courseKey, lessonSlug, lang);
      applySummary(usage);
      onConfirmed(solution);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('usage.solutionError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-[var(--bg2)] border border-[var(--border)] rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[var(--border)] text-base font-bold">
          {t('lesson.solutionConfirmTitle')}
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed text-[var(--text2)]">
            {t('lesson.solutionConfirmBody')}
          </p>
          {state && <UsageMeter state={state} label={t('usage.solution')} />}
          {depleted && (
            <span className="text-[12px] text-[var(--error)] font-semibold">
              {t('usage.solutionDepleted')}
            </span>
          )}
          {error && <span className="text-[12px] text-[var(--error)] font-semibold">{error}</span>}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-transparent border border-[var(--border)] text-[var(--text2)] font-semibold text-[13px] hover:text-[var(--text)] hover:border-[var(--text3)] transition cursor-pointer"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={confirm}
              disabled={busy || depleted}
              className="px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold text-[13px] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {t('lesson.solutionConfirmCta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
