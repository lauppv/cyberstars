import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { SUPPORTED_LANGS } from '../i18n';
import { useBackgroundPref, type BackgroundKind } from '../hooks/useBackgroundPref';
import * as profileService from '../services/profileService';
import { INPUT_CLS } from '../constants/styles';

const BACKGROUND_OPTIONS: BackgroundKind[] = ['minimal', 'cosmos'];

type PrivacyFlag = 'showBio' | 'showStats' | 'showProgress' | 'showActivity' | 'showConnections';

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {off ? (
        <>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.9 19.9 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.86 19.86 0 0 1-3.17 4.19" />
          <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  optionLabel,
  ariaLabel,
}: {
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
  optionLabel: (opt: T) => string;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-center rounded-[var(--radius-sm)] border border-[var(--accent)]/30 overflow-hidden"
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`px-3 py-1 text-[12px] font-semibold cursor-pointer border-none transition ${
              active
                ? 'bg-[var(--accent)] text-white'
                : 'bg-transparent text-[var(--text3)] hover:text-[var(--text)]'
            }`}
          >
            {optionLabel(opt)}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-[var(--text)]">{label}</div>
        <div className="text-[11px] text-[var(--text3)] mt-0.5">{hint}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-[22px] rounded-full flex-shrink-0 transition cursor-pointer border-none disabled:opacity-50 ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--surface2)]'
        }`}
      >
        <span
          className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-[18px]' : ''
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn, isLoading, refreshUser } = useAuth();
  const currentLang = i18n.resolvedLanguage ?? i18n.language;
  const [backgroundKind, setBackgroundKind] = useBackgroundPref();

  const [privacy, setPrivacy] = useState<Record<PrivacyFlag, boolean>>({
    showBio: true,
    showStats: true,
    showProgress: true,
    showActivity: true,
    showConnections: true,
  });
  const [savingFlag, setSavingFlag] = useState<PrivacyFlag | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [emailPw, setEmailPw] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showEmailPw, setShowEmailPw] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate('/getstarted');
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrivacy({
        showBio: user.showBio,
        showStats: user.showStats,
        showProgress: user.showProgress,
        showActivity: user.showActivity,
        showConnections: user.showConnections,
      });
    }
  }, [user]);

  const toggleFlag = async (key: PrivacyFlag, value: boolean) => {
    setPrivacy((p) => ({ ...p, [key]: value }));
    setSavingFlag(key);
    try {
      await profileService.updateProfile({ [key]: value });
      refreshUser();
    } catch {
      setPrivacy((p) => ({ ...p, [key]: !value })); // revert on failure
    } finally {
      setSavingFlag(null);
    }
  };

  const submitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);
    if (newPassword.length < 6) {
      setPwdMessage({ type: 'err', text: t('profile.passwordMinLength') });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: 'err', text: t('profile.passwordMismatch') });
      return;
    }
    setPwdSaving(true);
    try {
      await profileService.changePassword({ currentPassword, newPassword });
      setPwdMessage({ type: 'ok', text: t('profile.passwordUpdated') });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwdMessage({ type: 'err', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setPwdSaving(false);
    }
  };

  const submitEmailRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);
    setEmailSaving(true);
    try {
      await profileService.requestEmailChange({
        currentPassword: emailPw,
        newEmail: newEmail.trim(),
      });
      setEmailMessage({ type: 'ok', text: t('profile.emailCodeSent', { email: newEmail.trim() }) });
      setEmailPw('');
      refreshUser();
    } catch (err) {
      setEmailMessage({ type: 'err', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setEmailSaving(false);
    }
  };

  const submitEmailConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);
    setEmailSaving(true);
    try {
      const res = await profileService.confirmEmailChange({ code: emailCode.trim() });
      setEmailMessage({ type: 'ok', text: t('profile.emailUpdated', { email: res.email }) });
      setEmailCode('');
      setNewEmail('');
      refreshUser();
    } catch (err) {
      setEmailMessage({ type: 'err', text: err instanceof Error ? err.message : 'Error' });
    } finally {
      setEmailSaving(false);
    }
  };

  const cancelEmailChange = async () => {
    setEmailMessage(null);
    try {
      await profileService.cancelEmailChange();
      setEmailCode('');
      setNewEmail('');
      refreshUser();
    } catch (err) {
      setEmailMessage({ type: 'err', text: err instanceof Error ? err.message : 'Error' });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen flex flex-col bg-transparent">
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[520px] flex flex-col gap-5">
          <div className="text-backdrop">
            <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
            <p className="text-[var(--text2)] text-sm">{t('settings.subtitle')}</p>
          </div>

          {/* Preferences */}
          <section className="rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] px-6 py-5">
            <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-4">
              {t('settings.preferences')}
            </h2>
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-[13px] text-[var(--text)]">🌐 {t('settings.language')}</span>
              <Segmented
                value={currentLang}
                options={SUPPORTED_LANGS}
                onChange={(lng) => i18n.changeLanguage(lng)}
                optionLabel={(lng) => t(`lang.${lng}`)}
                ariaLabel={t('lang.switch')}
              />
            </div>
            <div className="flex items-center justify-between gap-4 py-2">
              <span className="text-[13px] text-[var(--text)]">🎨 {t('settings.background')}</span>
              <Segmented
                value={backgroundKind}
                options={BACKGROUND_OPTIONS}
                onChange={setBackgroundKind}
                optionLabel={(opt) => t(`background.${opt}`)}
                ariaLabel={t('background.switch')}
              />
            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] px-6 py-5">
            <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-1">
              {t('settings.privacy')}
            </h2>
            <p className="text-[11px] text-[var(--text3)] mb-2">{t('settings.privacyHint')}</p>
            <div className="divide-y divide-[var(--accent)]/10">
              <Toggle
                checked={privacy.showBio}
                disabled={savingFlag === 'showBio'}
                onChange={(v) => toggleFlag('showBio', v)}
                label={t('settings.showBio')}
                hint={t('settings.showBioHint')}
              />
              <Toggle
                checked={privacy.showStats}
                disabled={savingFlag === 'showStats'}
                onChange={(v) => toggleFlag('showStats', v)}
                label={t('settings.showStats')}
                hint={t('settings.showStatsHint')}
              />
              <Toggle
                checked={privacy.showProgress}
                disabled={savingFlag === 'showProgress'}
                onChange={(v) => toggleFlag('showProgress', v)}
                label={t('settings.showProgress')}
                hint={t('settings.showProgressHint')}
              />
              <Toggle
                checked={privacy.showActivity}
                disabled={savingFlag === 'showActivity'}
                onChange={(v) => toggleFlag('showActivity', v)}
                label={t('settings.showActivity')}
                hint={t('settings.showActivityHint')}
              />
              <Toggle
                checked={privacy.showConnections}
                disabled={savingFlag === 'showConnections'}
                onChange={(v) => toggleFlag('showConnections', v)}
                label={t('settings.showConnections')}
                hint={t('settings.showConnectionsHint')}
              />
            </div>
          </section>

          {/* Account */}
          <section className="rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] px-6 py-5">
            <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-4">
              {t('settings.account')}
            </h2>

            {/* Email change */}
            <div className="pb-5 border-b border-[var(--accent)]/20">
              <h3 className="text-[12px] font-semibold text-[var(--text2)] mb-3">
                {t('profile.emailSection')}
              </h3>
              {user.pendingEmail ? (
                <form onSubmit={submitEmailConfirm} className="flex flex-col gap-3">
                  <p className="text-[12px] text-[var(--text2)]">
                    {t('profile.emailPendingHint', { email: user.pendingEmail })}
                  </p>
                  <div>
                    <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                      {t('profile.emailCode')}
                    </label>
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className={INPUT_CLS + ' tracking-[6px] text-center'}
                      maxLength={6}
                      required
                    />
                  </div>
                  {emailMessage && (
                    <p
                      className={`text-[12px] ${
                        emailMessage.type === 'ok' ? 'text-[var(--success)]' : 'text-[var(--error)]'
                      }`}
                    >
                      {emailMessage.text}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={emailSaving || emailCode.length !== 6}
                      className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50"
                    >
                      {emailSaving ? '...' : t('profile.emailConfirm')}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEmailChange}
                      className="text-[12px] text-[var(--text3)] hover:text-[var(--error)] bg-transparent border-none cursor-pointer transition"
                    >
                      {t('profile.emailCancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={submitEmailRequest} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                      {t('profile.newEmail')}
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className={INPUT_CLS}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                      {t('profile.currentPassword')}
                    </label>
                    <div className="relative">
                      <input
                        type={showEmailPw ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={emailPw}
                        onChange={(e) => setEmailPw(e.target.value)}
                        className={INPUT_CLS + ' pr-9'}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmailPw((v) => !v)}
                        aria-label={
                          showEmailPw ? t('profile.hidePassword') : t('profile.showPassword')
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition leading-none p-1 flex items-center"
                      >
                        <EyeIcon off={showEmailPw} />
                      </button>
                    </div>
                  </div>
                  {emailMessage && (
                    <p
                      className={`text-[12px] ${
                        emailMessage.type === 'ok' ? 'text-[var(--success)]' : 'text-[var(--error)]'
                      }`}
                    >
                      {emailMessage.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={emailSaving || !emailPw || !newEmail}
                    className="self-start px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50"
                  >
                    {emailSaving ? '...' : t('profile.emailSendCode')}
                  </button>
                </form>
              )}
            </div>

            {/* Password change */}
            <div className="pt-5">
              <h3 className="text-[12px] font-semibold text-[var(--text2)] mb-3">
                {t('profile.security')}
              </h3>
              <form onSubmit={submitPasswordChange} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                    {t('profile.currentPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={INPUT_CLS + ' pr-9'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw((v) => !v)}
                      aria-label={
                        showCurrentPw ? t('profile.hidePassword') : t('profile.showPassword')
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition leading-none p-1 flex items-center"
                    >
                      <EyeIcon off={showCurrentPw} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                    {t('profile.newPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={INPUT_CLS + ' pr-9'}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw((v) => !v)}
                      aria-label={showNewPw ? t('profile.hidePassword') : t('profile.showPassword')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition leading-none p-1 flex items-center"
                    >
                      <EyeIcon off={showNewPw} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                    {t('profile.confirmNewPassword')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={INPUT_CLS + ' pr-9'}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw((v) => !v)}
                      aria-label={
                        showConfirmPw ? t('profile.hidePassword') : t('profile.showPassword')
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text3)] hover:text-[var(--text)] transition leading-none p-1 flex items-center"
                    >
                      <EyeIcon off={showConfirmPw} />
                    </button>
                  </div>
                </div>
                {pwdMessage && (
                  <p
                    className={`text-[12px] ${
                      pwdMessage.type === 'ok' ? 'text-[var(--success)]' : 'text-[var(--error)]'
                    }`}
                  >
                    {pwdMessage.text}
                  </p>
                )}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={pwdSaving || !currentPassword || !newPassword || !confirmPassword}
                    className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50"
                  >
                    {pwdSaving ? '...' : t('profile.changePassword')}
                  </button>
                  <Link
                    to="/getstarted"
                    state={{ mode: 'forgot', email: user.email }}
                    className="text-[12px] text-[var(--accent)] hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
