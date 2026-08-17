import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EMOJIS } from './emojiPalette';

export function EmojiPicker({
  onSelect,
  disabled,
  label,
  triggerClassName,
  align = 'right',
}: {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
  label?: string;
  triggerClassName?: string;
  align?: 'left' | 'right';
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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-label={label ?? t('profile.addEmoji')}
        title={label ?? t('profile.addEmoji')}
        className={
          triggerClassName ??
          'px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--accent)]/10 text-[16px] leading-none cursor-pointer hover:bg-[var(--accent)]/20 transition disabled:opacity-50'
        }
      >
        😊
      </button>
      {open && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} z-20 mt-1 w-[224px] p-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--popover)] backdrop-blur-[var(--panel-blur)] shadow-lg grid grid-cols-8 gap-0.5`}
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
              className="w-6 h-6 flex items-center justify-center text-[16px] rounded hover:bg-[var(--accent)]/20 transition cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
