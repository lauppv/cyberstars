import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EMOJIS } from '../ui/emojiPalette';

// Always-visible "⋮" trigger opening a per-message menu: react (emoji grid) plus
// edit/delete for the owner. Always visible (not hover-only) so it's tappable on
// touch devices, where hover-reveal actions are unreachable.
export function MessageActions({
  align,
  canModify,
  onReact,
  onEdit,
  onDelete,
}: {
  align: 'left' | 'right';
  canModify: boolean;
  onReact: (emoji: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('messages.actions')}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-6 h-6 flex items-center justify-center rounded-full text-[13px] leading-none text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--accent)]/15 transition cursor-pointer bg-transparent border-none"
      >
        ⋮
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full z-20 mt-1 w-[224px] p-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--popover)] shadow-lg`}
        >
          <div className="grid grid-cols-8 gap-0.5">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onReact(emoji);
                  setOpen(false);
                }}
                className="w-6 h-6 flex items-center justify-center text-[16px] rounded hover:bg-[var(--accent)]/20 transition cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
          {canModify && (
            <div className="mt-1 pt-1 border-t border-[var(--border)] flex flex-col">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
                className="text-left px-2 py-1.5 rounded text-[12px] text-[var(--text)] hover:bg-[var(--accent)]/15 transition cursor-pointer bg-transparent border-none"
              >
                {t('messages.edit')}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                className="text-left px-2 py-1.5 rounded text-[12px] text-[var(--error)] hover:bg-[var(--error)]/10 transition cursor-pointer bg-transparent border-none"
              >
                {t('messages.delete')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
