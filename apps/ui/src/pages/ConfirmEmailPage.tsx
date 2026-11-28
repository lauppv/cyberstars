import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MailCheck, MailWarning, MailX } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import { ApiClientError } from '../services/apiClient';

// failed: the server turned the link down (expired or used). error: the
// answer never said so (a dropped connection, too many tries, a server error),
// so the page keeps the token and lets it be tried again
type Outcome = 'confirming' | 'confirmed' | 'failed' | 'error';
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

  const confirm = useCallback(
    (value: string) => {
      setOutcome('confirming');
      authService
        .confirmEmail(value)
        .then(() => {
          setOutcome('confirmed');
          refreshUser();
        })
        .catch((err) =>
          setOutcome(err instanceof ApiClientError && err.status === 400 ? 'failed' : 'error'),
        );
    },
    [refreshUser],
  );

  useEffect(() => {
    if (!token || sent.current) return;
    sent.current = true;
    navigate(pathname, { replace: true });
    confirm(token);
  }, [token, pathname, navigate, confirm]);

  const sendLink = async () => {
    setSend('sending');
    try {
      await authService.resendConfirmation();
      setSend('sent');
    } catch {
      setSend('error');
    }
  };

  // A link opened twice fails the second time. The page can't tell whose link
  // it was, so it says only that the signed-in account's email is confirmed
  const alreadyConfirmed = outcome === 'failed' && !!user?.emailConfirmed;

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
        {outcome === 'error' && token ? (
          <>
            <MailWarning
              size={28}
              className="mx-auto mb-3 text-[var(--warning)]"
              aria-hidden="true"
            />
            <h1 className="text-lg font-semibold mb-2">{t('emailConfirm.errorTitle')}</h1>
            <p className="text-[13px] text-[var(--text2)] mb-5">{t('emailConfirm.errorText')}</p>
            <button type="button" onClick={() => confirm(token)} className="btn btn-primary">
              {t('emailConfirm.tryAgain')}
            </button>
          </>
        ) : alreadyConfirmed ? (
          <>
            <MailCheck
              size={28}
              className="mx-auto mb-3 text-[var(--success)]"
              aria-hidden="true"
            />
            <h1 className="text-lg font-semibold mb-2">{t('emailConfirm.alreadyTitle')}</h1>
            <p className="text-[13px] text-[var(--text2)] mb-5">
              {t('emailConfirm.alreadyText', { email: user?.email })}
            </p>
            <Link to="/" className="btn btn-primary">
              {t('emailConfirm.continue')}
            </Link>
          </>
        ) : outcome === 'confirmed' ? (
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
