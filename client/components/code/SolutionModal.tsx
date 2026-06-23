import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from '../markdown/MarkdownRenderer';

export function SolutionModal({ solution, onClose }: { solution: string; onClose: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[680px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--accent)]/30 rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--accent)]/20 sticky top-0 bg-[var(--bg2)] z-[1]">
          <div className="text-base font-bold flex items-center gap-2">
            {t('lesson.solutionTitle')}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4 lesson-body">
          <MarkdownRenderer content={solution} />
        </div>
      </div>
    </div>
  );
}
