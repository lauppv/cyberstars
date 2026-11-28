import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MailCheck, MailX } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

type Outcome = 'confirming' | 'confirmed' | 'failed';
type Send = 'idle' | 'sending' | 'sent' | 'error';

// Where the confirmation email's link lands (CYB-135). It sends the token once,
// then takes it out of the address so it stays in no history or screenshot.
// The link needs no session, since it is often opened on another device
export function ConfirmEmailPage() {
  const { t } = useTranslation();
  const { user, isLoading, refreshUser } = useAuth();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [token] = useState(() => new URLSearchParams(search).get('token'));
  const [outcome, setOutcome] = useState<Outcome>(token ? 'confirming' : 'failed');
  const [send, setSend] = useState<Send>('idle');
  const sent = useRef(false);

  useEffect(() => {
    if (!token || sent.current) return;
    sent.current = true;
    navigate(pathname, { replace: true });
    authService
      .confirmEmail(token)
      .then(() => {
        setOutcome('confirmed');
        refreshUser();
      })
      .catch(() => setOutcome('failed'));
  }, [token, pathname, navigate, refreshUser]);

  const sendLink = async () => {
    setSend('sending');
    try {
      await authService.resendConfirmation();
      setSend('sent');
    } catch {
      setSend('error');
    }
  };

  // A link opened twice (or a mail app that opened it first) fails the second
  // time, but the email it confirmed is still confirmed
  const confirmed = outcome === 'confirmed' || (outcome === 'failed' && !!user?.emailConfirmed);

  if (outcome === 'confirming' || (outcome === 'failed' && isLoading)) {
    return (
      <PageContainer width="narrow">
        <div className="panel p-6 text-center text-[13px] text-[var(--text2)]">
          {t('emailConfirm.confirming')}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="narrow">
      <div className="panel p-6 text-center">
        {confirmed ? (
          <>
            <MailCheck
              size={28}
              className="mx-auto mb-3 text-[var(--success)]"
              aria-hidden="true"
            />
            <h1 className="text-lg font-semibold mb-2">{t('emailConfirm.confirmedTitle')}</h1>
            <p className="text-[13px] text-[var(--text2)] mb-5">
              {t('emailConfirm.confirmedText')}
            </p>
            <Link to="/" className="btn btn-primary">
              {t('emailConfirm.continue')}
            </Link>
          </>
        ) : (
          <>
            <MailX size={28} className="mx-auto mb-3 text-[var(--error)]" aria-hidden="true" />
            <h1 className="text-lg font-semibold mb-2">{t('emailConfirm.failedTitle')}</h1>
            <p className="text-[13px] text-[var(--text2)] mb-5">{t('emailConfirm.failedText')}</p>
            {user ? (
              <>
                <button
                  type="button"
                  onClick={sendLink}
                  disabled={send === 'sending' || send === 'sent'}
                  className="btn btn-primary"
                >
                  {send === 'sending' ? '...' : t('emailConfirm.resend')}
                </button>
                {send === 'sent' && (
                  <p className="mt-3 text-[13px] text-[var(--success)]">
                    {t('emailConfirm.sent', { email: user.email })}
                  </p>
                )}
                {send === 'error' && (
                  <p className="mt-3 text-[13px] text-[var(--error)]">
                    {t('emailConfirm.sendFailed')}
                  </p>
                )}
              </>
            ) : (
              <Link to="/getstarted" className="btn btn-primary">
                {t('emailConfirm.signIn')}
              </Link>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}
