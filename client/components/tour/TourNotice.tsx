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
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  // On body, so it sits above the tour's overlay rather than inside the page.
  return createPortal(
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-[100] flex items-start gap-3.5 w-[min(400px,calc(100vw-48px))] pl-4 pr-3 py-4 bg-[var(--popover)] border border-[var(--warning)] rounded-[var(--radius)] shadow-[0_12px_48px_#000c]"
      style={{ animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)' }}
    >
      <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[color-mix(in_srgb,var(--warning)_18%,transparent)] text-[var(--warning)]">
        <Lock size={18} strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[var(--text)]">{t('tour.locked.title')}</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--text2)]">
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
