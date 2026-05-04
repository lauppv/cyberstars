import { useEffect } from "react";

interface AchievementToastProps {
  icon: string;
  title: string;
  xp: number;
  visible: boolean;
  onClose: () => void;
}

export function AchievementToast({ icon, title, xp, visible, onClose }: AchievementToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 flex items-center gap-3 px-5 py-3.5 bg-[var(--surface)] border border-[var(--accent)] rounded-[var(--radius)] z-[100]"
      style={{
        boxShadow: '0 8px 32px #0008, 0 0 24px var(--accent-glow)',
        animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
      }}
    >
      <span className="text-3xl">{icon}</span>
      <div className="flex flex-col gap-[2px]">
        <span className="text-sm font-bold text-[var(--text)]">{title}</span>
        <span className="text-[13px] font-semibold text-[var(--accent)]">+{xp} XP</span>
      </div>
      <button
        onClick={onClose}
        className="bg-transparent border-none text-[var(--text3)] text-base cursor-pointer ml-2 hover:text-[var(--text)]"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
