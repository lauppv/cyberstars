import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Corner } from '../layout/Corner';

interface AchievementToastProps {
  title: string;
  visible: boolean;
  onClose: () => void;
}

// In the bottom-right corner with the other toasts, so a lesson's XP and the
// badge it earns, which come together, stack instead of covering each other.
export function AchievementToast({ title, visible, onClose }: AchievementToastProps) {
  const { t } = useTranslation();
  // The page renders again while the toast is up (the student keeps typing),
  // often with a new onClose, so the timer reads the latest without starting over.
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => close.current(), 5000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Corner>
      <div
        role="status"
        className="flex items-center gap-3 px-5 py-3.5 bg-[var(--surface)] border border-[var(--accent)] rounded-[var(--radius)]"
        style={{
          boxShadow: '0 8px 32px #0008, 0 0 24px var(--accent-glow)',
          animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <span className="text-sm font-bold text-[var(--text)]">{title}</span>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-[var(--text3)] text-base cursor-pointer ml-2 hover:text-[var(--text)]"
          aria-label={t('common.close')}
        >
          ×
        </button>
      </div>
    </Corner>
  );
}
