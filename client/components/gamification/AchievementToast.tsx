import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AchievementToastProps {
  icon: string;
  title: string;
  visible: boolean;
  onClose: () => void;
}

export function AchievementToast({ icon, title, visible, onClose }: AchievementToastProps) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 bg-[var(--surface)] border border-[var(--accent)] rounded-[var(--radius)]"
      style={{
        boxShadow: '0 8px 32px #0008, 0 0 24px var(--accent-glow)',
        animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
      }}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-bold text-[var(--text)]">{title}</span>
      <button
        onClick={onClose}
        className="bg-transparent border-none text-[var(--text3)] text-base cursor-pointer ml-2 hover:text-[var(--text)]"
        aria-label={t('common.close')}
      >
        ×
      </button>
    </div>
  );
}
