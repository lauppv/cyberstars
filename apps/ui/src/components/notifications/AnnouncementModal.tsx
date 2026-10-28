import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { announcementDay } from './announcementDay';

// An official announcement read in full, over a dimmed and blurred page
export function AnnouncementModal({
  text,
  createdAt,
  onClose,
}: {
  text: string;
  createdAt: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // A portal, so the sticky topbar's stacking can't keep it under the page
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('notif.announcementTitle')}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--border)] rounded-xl"
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--bg2)]">
          <div className="min-w-0">
            <div className="text-base font-bold">{t('notif.announcementTitle')}</div>
            <div className="text-[12px] text-[var(--text3)]">{announcementDay(createdAt)}</div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('notif.close')}
            className="w-8 h-8 flex-shrink-0 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>
        <p className="m-0 px-6 py-5 text-[14px] leading-relaxed text-[var(--text)] whitespace-pre-wrap break-words">
          {text}
        </p>
      </div>
    </div>,
    document.body,
  );
}
