import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from '../markdown/MarkdownRenderer';
import { CodeEditor } from './CodeEditor';

function extractCodeFromSolution(solution: string): string {
  const match = solution.match(/```[^\n]*\n([\s\S]*?)\n?```/);
  return match ? match[1] : solution;
}

export function SolutionModal({
  solution,
  currentCode,
  language,
  onClose,
}: {
  solution: string;
  currentCode?: string;
  language?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canCompare = typeof currentCode === 'string';
  const solutionCode = extractCodeFromSolution(solution);
  const userCode = currentCode ?? '';
  const editorLang = language ?? '';

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className={`w-full ${compare ? 'max-w-[1100px]' : 'max-w-[680px]'} max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--accent)]/30 rounded-xl transition-[max-width] duration-200`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--accent)]/20 sticky top-0 bg-[var(--bg2)] z-[1]">
          <div className="text-base font-bold flex items-center gap-2">
            {t('lesson.solutionTitle')}
          </div>
          <div className="flex items-center gap-3">
            {canCompare && (
              <button
                onClick={() => setCompare((v) => !v)}
                aria-pressed={compare}
                className={`text-[12px] px-3 py-1 rounded-[var(--radius-sm)] font-semibold cursor-pointer border transition ${
                  compare
                    ? 'bg-[var(--accent)]/20 border-[var(--accent)]/50 text-[var(--accent)]'
                    : 'bg-transparent border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--text3)]'
                }`}
              >
                {t('lesson.compare')}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
            >
              ×
            </button>
          </div>
        </div>
        {compare && canCompare ? (
          <div className="grid grid-cols-2 gap-0 border-t border-[var(--accent)]/10">
            <div className="border-r border-[var(--accent)]/20">
              <div className="px-4 py-2 text-[11px] font-semibold tracking-[1px] text-[var(--text3)] border-b border-[var(--accent)]/20 bg-[rgba(30,30,40,0.3)]">
                {t('lesson.yourCode')}
              </div>
              <div className="bg-[rgba(13,17,23,0.3)]">
                {userCode.trim().length === 0 ? (
                  <div className="px-4 py-3 text-[13px] italic text-[var(--text3)] font-mono">
                    {t('lesson.yourCodeEmpty')}
                  </div>
                ) : (
                  <CodeEditor value={userCode} language={editorLang} fontSize="13px" readOnly />
                )}
              </div>
            </div>
            <div>
              <div className="px-4 py-2 text-[11px] font-semibold tracking-[1px] text-[var(--text3)] border-b border-[var(--accent)]/20 bg-[rgba(30,30,40,0.3)]">
                {t('lesson.solutionTitle')}
              </div>
              <div className="bg-[rgba(13,17,23,0.3)]">
                <CodeEditor value={solutionCode} language={editorLang} fontSize="13px" readOnly />
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 lesson-body">
            <MarkdownRenderer content={solution} />
          </div>
        )}
      </div>
    </div>
  );
}
