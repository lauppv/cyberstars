import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as hintsService from '../../services/hintsService';
import { MAX_HINT_LEVEL, type HintLevel } from '../../../shared/hints';

interface Hint {
  level: HintLevel;
  text: string;
}

export function HintModal({
  courseKey,
  lessonSlug,
  code,
  lang,
  onClose,
}: {
  courseKey: string;
  lessonSlug: string;
  code: string;
  lang: 'en' | 'ro';
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [hints, setHints] = useState<Hint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestedRef = useRef(false);

  const fetchLevel = useCallback(
    async (level: HintLevel) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await hintsService.getHint(courseKey, lessonSlug, code, level, lang);
        setHints((prev) => [...prev, { level, text: res.hint }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('hints.error'));
      } finally {
        setIsLoading(false);
      }
    },
    [courseKey, lessonSlug, code, lang, t],
  );

  // Fetch the first hint on open. Guard against React 18 StrictMode double-invoke.
  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    fetchLevel(1);
  }, [fetchLevel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const nextLevel = (hints.length + 1) as HintLevel;
  const canGetMore = hints.length > 0 && hints.length < MAX_HINT_LEVEL;
  const retryLevel = (hints.length === 0 ? 1 : hints.length) as HintLevel;

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[560px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--accent)]/30 rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--accent)]/20 sticky top-0 bg-[var(--bg2)] z-[1]">
          <div className="text-base font-bold flex items-center gap-2">💡 {t('hints.title')}</div>
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {hints.map((h) => (
            <div key={h.level} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold tracking-[1px] text-[var(--accent)] uppercase">
                {t('hints.levelOf', { n: h.level, max: MAX_HINT_LEVEL })}
              </span>
              <p className="text-[14px] leading-relaxed text-[var(--text)] whitespace-pre-wrap">
                {h.text}
              </p>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-[13px] text-[var(--text3)]">
              <span className="inline-block w-3.5 h-3.5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              {t('hints.loading')}
            </div>
          )}

          {error && (
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-[var(--error)] font-semibold">{error}</span>
              <button
                onClick={() => fetchLevel(retryLevel)}
                className="self-start px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold text-[13px] hover:brightness-110 transition cursor-pointer"
              >
                {t('hints.retry')}
              </button>
            </div>
          )}

          {!isLoading && !error && canGetMore && (
            <button
              onClick={() => fetchLevel(nextLevel)}
              className="self-start px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-semibold text-[13px] hover:brightness-110 transition cursor-pointer"
            >
              {t('hints.next')}
            </button>
          )}

          {!isLoading && !error && hints.length >= MAX_HINT_LEVEL && (
            <span className="text-[13px] italic text-[var(--text3)]">{t('hints.noMore')}</span>
          )}

          <span className="text-[11px] text-[var(--text3)] border-t border-[var(--accent)]/15 pt-3">
            {t('hints.disclaimer')}
          </span>
        </div>
      </div>
    </div>
  );
}
