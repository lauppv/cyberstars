import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { MailWarning, X } from 'lucide-react';
import type { AuthenticatedUser } from '@cyberstars/shared/auth';
import { useAuth } from '../../context/AuthContext';
import { useUserSocketFrames } from '../../context/UserSocketContext';
import * as authService from '../../services/authService';
import { CONFIRM_EMAIL_PATH } from '../../constants/confirmEmail';

// How long the X puts the banner away: it is the price of an unconfirmed
// email, so it comes back, on this device, twice a day until the link is opened
export const BANNER_AWAY_MS = 12 * 60 * 60 * 1000;

// When the X put the banner away until, per account, on this device
const awayKey = (userId: number) => `cyberstars.emailBanner.${userId}`;

function readAwayUntil(userId: number): number {
  try {
    return Number(localStorage.getItem(awayKey(userId))) || 0;
  } catch {
    return 0;
  }
}

function writeAwayUntil(userId: number, until: number): void {
  try {
    localStorage.setItem(awayKey(userId), String(until));
  } catch {
    // storage may be blocked; the banner then stays away until the page reloads
  }
}

type Send = { state: 'idle' | 'sending' | 'sent' } | { state: 'error'; message: string };

// Over the top of every page while the signed-in account's email isn't
// confirmed (CYB-135), covering what is under it on purpose, the windows too
// (z-[100], the tour's cards) and everything but the maintenance screen
// (z-[130]). Those are portals on <body>, above the whole of #root (an
// isolated stacking context), so the banner is one too. Red, its words slowly
// pulsing (.email-alert-text), like a critical warning. Its X puts it away for
// 12 hours on this device; the link, opened anywhere, takes it off every open
// page at once
export function EmailConfirmBanner() {
  const { user, refreshUser } = useAuth();
  const { pathname } = useLocation();

  // The link opened on another device: the server says so on the account's socket
  useUserSocketFrames((frame) => {
    if (frame.channel === 'account' && frame.type === 'email-confirmed') refreshUser();
  });

  const unconfirmed = !!user && !user.emailConfirmed;

  // And when the socket was down then, coming back to the tab reads it again
  useEffect(() => {
    if (!unconfirmed) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshUser();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [unconfirmed, refreshUser]);

  // A new account meets it once the tour and the question of what it wants to
  // learn are behind it (TourGate), not over its first lesson
  const pastTour = !!user?.onboardedAt && !!user.interests;
  if (!unconfirmed || !pastTour || pathname === CONFIRM_EMAIL_PATH) return null;
  return <Banner key={user.id} user={user} />;
}

function Banner({ user }: { user: AuthenticatedUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [awayUntil, setAwayUntil] = useState(() => readAwayUntil(user.id));
  const [now, setNow] = useState(() => Date.now());
  const [send, setSend] = useState<Send>({ state: 'idle' });

  // Put away, it comes back by itself once its 12 hours are up, also on a page
  // left open all that time
  useEffect(() => {
    if (awayUntil <= now) return;
    const timer = setTimeout(() => setNow(Date.now()), awayUntil - now);
    return () => clearTimeout(timer);
  }, [awayUntil, now]);

  const dismiss = useCallback(() => {
    const until = Date.now() + BANNER_AWAY_MS;
    writeAwayUntil(user.id, until);
    setAwayUntil(until);
    setNow(Date.now());
  }, [user.id]);

  const sendLink = useCallback(async () => {
    setSend({ state: 'sending' });
    try {
      await authService.resendConfirmation();
      setSend({ state: 'sent' });
      refreshUser();
    } catch (err) {
      setSend({
        state: 'error',
        message: err instanceof Error && err.message ? err.message : t('emailConfirm.sendFailed'),
      });
    }
  }, [refreshUser, t]);

  if (awayUntil > now) return null;

  const message =
    send.state === 'sent'
      ? t('emailConfirm.sent', { email: user.email })
      : user.confirmLinkSent
        ? t('emailConfirm.waiting', { email: user.email })
        : t('emailConfirm.ask', { email: user.email });

  return createPortal(
    <div
      role="alert"
      className="fixed top-0 inset-x-0 z-[125] flex flex-wrap items-center gap-x-4 gap-y-2 pl-4 pr-2 py-2.5 border-b border-[var(--error)] text-[var(--text)]"
      style={{
        background: 'color-mix(in srgb, var(--error) 24%, var(--surface))',
        boxShadow: '0 6px 24px #0007',
      }}
    >
      <MailWarning size={18} className="shrink-0 text-[var(--error)]" aria-hidden="true" />
      <p className="m-0 min-w-[14rem] flex-1 text-sm font-semibold [overflow-wrap:anywhere]">
        <span className="email-alert-text">{message}</span>
        {send.state === 'error' && (
          <span className="block text-[var(--text2)]">{send.message}</span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={sendLink}
          disabled={send.state === 'sending'}
          className="btn btn-primary btn-sm"
        >
          {send.state === 'sending'
            ? '...'
            : user.confirmLinkSent || send.state === 'sent'
              ? t('emailConfirm.resend')
              : t('emailConfirm.send')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/settings#email')}
          className="btn btn-secondary btn-sm"
        >
          {t('emailConfirm.change')}
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t('common.close')}
          className="grid place-items-center w-8 h-8 rounded bg-transparent border-none text-[var(--text2)] hover:text-[var(--text)] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
