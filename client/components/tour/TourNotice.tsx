import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Lock, X } from 'lucide-react';

interface TourNoticeProps {
  visible: boolean;
  onClose: () => void;
}

// Shown when a student still in the tour tries to leave the tour lesson.
export function TourNotice({ visible, onClose }: TourNoticeProps) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  // On body, so it sits above the tour's overlay rather than inside the page.
  return createPortal(
    <div
      role="status"
      className="fixed bottom-5 right-5 z-[100] flex items-start gap-3 w-[min(340px,calc(100vw-40px))] px-4 py-3.5 bg-[var(--popover)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_32px_#0008]"
      style={{ animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)' }}
    >
      <Lock size={18} strokeWidth={1.75} className="shrink-0 mt-0.5 text-[var(--warning)]" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[var(--text)]">{t('tour.locked.title')}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--text2)]">
          {t('tour.locked.body')}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="shrink-0 bg-transparent border-none p-0 text-[var(--text3)] hover:text-[var(--text)] cursor-pointer"
      >
        <X size={16} strokeWidth={1.75} />
      </button>
    </div>,
    document.body,
  );
}
