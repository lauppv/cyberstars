import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Shared "preview locked" treatment for the top-right action icons (bell,
// leaderboard, messages). On prod a non-admin sees the icon but can't enter the
// feature: hovering shows a tooltip, clicking opens a small "coming soon" hint.
export function LockedIcon({ emoji, label }: { emoji: string; label: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] bg-transparent border-none text-[17px] opacity-60 hover:bg-[var(--surface)] hover:opacity-80 transition cursor-pointer"
        title={`${label} · ${t('common.comingSoon')}`}
        aria-label={`${label} · ${t('common.comingSoon')}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {emoji}
        <span className="absolute -bottom-0.5 -right-0.5 text-[9px] leading-none">🔒</span>
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute top-full right-0 mt-2 w-60 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_32px_#0008] overflow-hidden z-50 fade-in-up p-3"
        >
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text)] mb-1.5">
            <span>{emoji}</span>
            <span className="truncate">{label}</span>
            <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)]">
              {t('common.comingSoon')}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text3)] leading-relaxed">
            {t('common.comingSoonHint')}
          </p>
        </div>
      )}
    </div>
  );
}
