import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsage } from '../../context/UsageContext';
import * as usageService from '../../services/usageService';
import { UsageMeter } from '../usage/UsageMeter';
import type { CodeLanguage } from '@cyberstars/shared/constants';

// Gate shown before the solution is revealed: confirms intent, spends one of the
// daily Show Solution reveals and hands back the solution, which only the server
// has. Only rendered for signed-in students.
export function SolutionConfirmModal({
  courseKey,
  lessonSlug,
  lang,
  language,
  onConfirmed,
  onClose,
}: {
  courseKey: string;
  lessonSlug: string;
  lang: 'en' | 'ro';
  // The language on screen, on a multi-language course.
  language?: CodeLanguage;
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
      const { solution, usage } = await usageService.revealSolution(
        courseKey,
        lessonSlug,
        lang,
        language,
      );
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
      className="fixed inset-0 overlay z-[100] flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius-lg)]"
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
            <button onClick={onClose} className="btn btn-secondary">
              {t('common.cancel')}
            </button>
            <button onClick={confirm} disabled={busy || depleted} className="btn btn-primary">
              {t('lesson.solutionConfirmCta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
