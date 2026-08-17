import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const BENEFITS = [
  'Save your progress and pick up where you left off',
  'Run code without limits',
  'Message and connect with other people',
  'Post and reply on the forum',
  'Earn XP and badges, and climb the leaderboard',
];

// Guest-only nudge shown after the first successful run. Intentionally
// English-only: guests can't change the language (it's English by default).
export function GuestSignupModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const goSignup = () => {
    onClose();
    navigate('/getstarted', { state: { mode: 'signup' } });
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[120] flex items-center justify-center p-4 animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-signup-title"
        className="w-full max-w-[480px] max-h-[85vh] overflow-y-auto bg-[var(--bg2)] border border-[var(--border)] rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-[var(--border)]">
          <div>
            <div id="guest-signup-title" className="text-base font-bold">
              Nice — your code just ran!
            </div>
            <div className="text-[13px] text-[var(--text3)] mt-1">
              Create a free account to get the most out of CyberStars.
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 shrink-0 rounded-full border border-[var(--border)] bg-transparent text-[var(--text3)] text-base flex items-center justify-center cursor-pointer hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4">
          <ul className="flex flex-col gap-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[14px] text-[var(--text)]">
                <span className="text-[var(--accent)] mt-0.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] font-semibold cursor-pointer border border-[var(--border)] bg-transparent text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            Maybe later
          </button>
          <button
            onClick={goSignup}
            className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] font-semibold cursor-pointer border border-[var(--border)] bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 transition"
          >
            Create free account
          </button>
        </div>
      </div>
    </div>
  );
}
