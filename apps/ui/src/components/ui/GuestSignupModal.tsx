import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const BENEFITS = ['progress', 'runs', 'people', 'forum', 'xp'];

// Guest-only nudge shown after the first successful run, in the page's language
export function GuestSignupModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
              {t('guestSignup.title')}
            </div>
            <div className="text-[13px] text-[var(--text3)] mt-1">{t('guestSignup.subtitle')}</div>
          </div>
          <button
            data-track="signup-prompt-close"
            onClick={onClose}
            aria-label={t('common.close')}
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
                <span>{t(`guestSignup.benefits.${b}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            data-track="signup-prompt-later"
            onClick={onClose}
            className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] font-semibold cursor-pointer border border-[var(--border)] bg-transparent text-[var(--text3)] hover:text-[var(--text)] hover:border-[var(--text3)] transition"
          >
            {t('guestSignup.later')}
          </button>
          <button
            data-track="signup-prompt-sign-up"
            onClick={goSignup}
            className="text-[13px] px-4 py-2 rounded-[var(--radius-sm)] font-semibold cursor-pointer border border-[var(--border)] bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 transition"
          >
            {t('guestSignup.signUp')}
          </button>
        </div>
      </div>
    </div>
  );
}
