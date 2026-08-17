import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Deco } from '../ui/Deco';
import { TopbarAction } from './TopbarAction';

// Shared "preview locked" treatment for the top-right actions (bell,
// leaderboard, messages). On prod a non-admin sees the control but can't enter
// the feature: hovering shows a tooltip, clicking opens a small "coming soon"
// hint. It wears the same shape as the live action it stands in for.
export function LockedIcon({
  emoji,
  label,
  short,
}: {
  emoji: string;
  label: string;
  short: string;
}) {
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
      <TopbarAction
        emoji={emoji}
        label={`${label} · ${t('common.comingSoon')}`}
        short={short}
        dimmed
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Deco className="absolute -bottom-0.5 -right-0.5 text-[9px] leading-none">🔒</Deco>
      </TopbarAction>
      {open && (
        <div
          role="dialog"
          className="fixed inset-x-2 top-[60px] w-auto sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-60 bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--radius)] shadow-[0_8px_32px_#0008] overflow-hidden z-50 fade-in-up p-3"
        >
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text)] mb-1.5">
            <Deco>{emoji}</Deco>
            <span className="truncate">{label}</span>
            <span className="ml-auto text-[9px] font-semibold tracking-wider px-1 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)]">
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
