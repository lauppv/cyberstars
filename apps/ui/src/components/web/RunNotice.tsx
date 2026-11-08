import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// The site follows the files by itself, so a web lesson's Run is only there
// for when it didn't. Its first press on a device opens this card, once.
export function RunNotice({ onClose }: { onClose: () => void }) {
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
      className="fixed inset-0 overlay z-[100] flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="web-run-notice-title"
        className="w-full max-w-[440px] bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius-lg)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          id="web-run-notice-title"
          className="px-6 py-4 border-b border-[var(--border)] text-base font-bold"
        >
          {t('web.runNotice.title')}
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <p className="m-0 text-[13px] leading-relaxed text-[var(--text2)]">
            {t('web.runNotice.body')}
          </p>
          <div className="flex items-center justify-end pt-1">
            {/* The card's one way out */}
            <button onClick={onClose} className="btn btn-primary" autoFocus>
              {t('web.runNotice.ok')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
