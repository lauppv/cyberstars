import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { LogIn, X } from 'lucide-react';
import { Corner } from './Corner';
import { useAuth } from '../../context/AuthContext';

// Bottom right once the server ended the session, so the student knows why the
// app now shows them as a guest. Sign in brings them back to this page
export function SessionEndedNotice() {
  const { t } = useTranslation();
  const { sessionEnded, dismissSessionEnded } = useAuth();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  if (!sessionEnded) return null;
  return (
    <Corner first>
      <div
        role="alert"
        className="flex items-start gap-3 pl-3 pr-2 py-2.5 w-[360px] max-w-full bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)]"
        style={{
          boxShadow: '0 8px 32px #0008',
          animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <LogIn size={18} className="shrink-0 mt-0.5 text-[var(--accent)]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="m-0 text-sm font-semibold text-[var(--text)]">
            {t('sessionEnded.message')}
          </p>
          {pathname !== '/getstarted' && (
            <button
              type="button"
              onClick={() => navigate('/getstarted', { state: { from: pathname + search } })}
              className="mt-1 bg-transparent border-none p-0 text-sm font-semibold text-[var(--accent)] hover:underline cursor-pointer"
            >
              {t('sessionEnded.signIn')}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={dismissSessionEnded}
          aria-label={t('common.close')}
          className="grid place-items-center w-7 h-7 rounded bg-transparent border-none text-[var(--text3)] hover:text-[var(--text)] cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    </Corner>
  );
}
