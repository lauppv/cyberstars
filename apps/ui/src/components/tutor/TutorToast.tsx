import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { TutorMark, type TutorMood } from './TutorMark';

// The tutor speaking up on its own, bottom right: its face and one line,
// client-side only, so it costs no message. With onOpen the line is a button;
// without it the toast goes by itself after a few seconds.
export function TutorToast({
  text,
  mood,
  onOpen,
  onClose,
}: {
  text: string;
  mood: TutorMood;
  onOpen?: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    if (onOpen) return;
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onOpen, onClose]);

  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-[100] flex items-center gap-3 pl-3 pr-2 py-2.5 max-w-[calc(100vw-40px)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]"
      style={{
        boxShadow: '0 8px 32px #0008',
        animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
      }}
    >
      <TutorMark size="md" mood={mood} />
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          className="bg-transparent border-none p-0 text-sm font-semibold text-[var(--accent)] hover:underline cursor-pointer"
        >
          {text}
        </button>
      ) : (
        <span className="text-sm font-semibold text-[var(--text)]">{text}</span>
      )}
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="grid place-items-center w-7 h-7 rounded bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
