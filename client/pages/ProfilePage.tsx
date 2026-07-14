import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { Topbar } from '../components/layout/Topbar';
import { Badge } from '../components/gamification/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { MAIN_COURSE_KEYS, TERMINAL_COURSE_KEYS } from '../../shared/constants';
import * as profileService from '../services/profileService';
import { INPUT_CLS } from '../constants/styles';

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

export function ProfilePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn, isLoading, refreshUser } = useAuth();
  const g = useGamification();
  const { courses: allCourses } = useCurriculum();
  const { progressMap } = useAllProgress();
  const fileRef = useRef<HTMLInputElement>(null);

  const activeCourses = allCourses.filter((c) => {
    const keys = [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS] as readonly string[];
    return keys.includes(c.key) && progressMap[c.key]?.completed > 0;
  }).length;

  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [streak, setStreak] = useState<number | null>(null);

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
      setBio(user.bio ?? ''); // eslint-disable-line react-hooks/set-state-in-effect
      setStatus(user.status ?? '');
    }
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    profileService
      .getActivity()
      .then((data) => {
        if (!cancelled) setStreak(data.streak);
      })
      .catch(() => {
        if (!cancelled) setStreak(0);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const saveBio = async () => {
    setSaving(true);
    try {
      await profileService.updateProfile({ bio: bio || null });
      refreshUser();
    } finally {
      setSaving(false);
    }
  };

  const saveStatus = async () => {
    setSaving(true);
    try {
      await profileService.updateProfile({ status: status || null });
      refreshUser();
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    if (file.size > 2 * 1024 * 1024) {
      setUploadError(t('profile.fileTooLarge'));
      return;
    }
    try {
      await profileService.uploadAvatar(file);
      refreshUser();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : t('profile.uploadFailed'));
    }
  };

  const removeAvatar = async () => {
    await profileService.removeAvatar();
    refreshUser();
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

  const statusExpired = user.statusExpiresAt && new Date(user.statusExpiresAt) < new Date();
  const activeStatus = statusExpired ? null : user.status;
  const earnedBadges = g.badges.filter((b) => b.earned).length;
  const memberSinceLabel = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(i18n.resolvedLanguage ?? 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[520px] rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] px-6 py-6">
          {/* Header with avatar */}
          <div className="flex items-center gap-5 pb-5 border-b border-[var(--accent)]/20">
            <div className="relative group">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={t('profile.avatarAlt')}
                  className="w-16 h-16 rounded-full object-cover border-[3px] border-[var(--accent)] flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[32px] border-[3px] border-[var(--accent)] flex-shrink-0">
                  🚀
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold cursor-pointer border-none"
              >
                {t('profile.edit')}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] font-bold tracking-[-0.3px]">{user.name}</h1>
              <p className="text-[12px] text-[var(--text3)] mt-0.5">{user.email}</p>
              {memberSinceLabel && (
                <p className="text-[11px] text-[var(--text3)] mt-0.5">
                  {t('profile.memberSince', { date: memberSinceLabel })}
                </p>
              )}
              {activeStatus && (
                <p className="text-[11px] text-[var(--accent)] mt-1">💬 {activeStatus}</p>
              )}
            </div>
          </div>
          {uploadError && <p className="text-[11px] text-[var(--error)] mt-2">{uploadError}</p>}
          {user.avatarUrl && (
            <button
              onClick={removeAvatar}
              className="text-[11px] text-[var(--text3)] hover:text-[var(--error)] mt-1 bg-transparent border-none cursor-pointer transition"
            >
              {t('profile.removeAvatar')}
            </button>
          )}

          {/* Bio & Status */}
          <div className="py-4 border-b border-[var(--accent)]/20 flex flex-col gap-3">
            <div>
              <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                {t('profile.bio')}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t('profile.bioPlaceholder')}
                maxLength={200}
                rows={2}
                className={INPUT_CLS + ' resize-none'}
                onBlur={saveBio}
              />
              <div className="text-[10px] text-[var(--text3)] text-right mt-0.5">
                {bio.length}/200
              </div>
            </div>
            <div>
              <label className="text-[11px] text-[var(--text3)] tracking-[0.5px] mb-1 block">
                {t('profile.status')}{' '}
                <span className="normal-case">{t('profile.statusExpires')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder={t('profile.statusPlaceholder')}
                  maxLength={80}
                  className={INPUT_CLS + ' flex-1'}
                />
                <button
                  onClick={saveStatus}
                  disabled={saving}
                  className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50"
                >
                  {t('profile.set')}
                </button>
              </div>
            </div>
          </div>

          {/* Level & XP */}
          <div className="py-4 border-b border-[var(--accent)]/20">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-bold text-[var(--accent)]">
                  {t('level.label', { n: g.xp.level })}
                </span>
                <span className="text-[13px] font-semibold text-[var(--text)]">
                  {t(g.xp.titleKey)}
                </span>
              </div>
              <span className="text-[12px] text-[var(--text3)] tabular-nums">
                {g.xp.earnedXp} {t('profile.xp')}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--surface2)] overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-500"
                style={{ width: `${g.xp.xpPct}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--text3)] mt-1">
              {t('profile.levelProgress', {
                current: g.xp.xpIntoLevel,
                needed: g.xp.xpForLevelSpan,
                next: g.xp.level + 1,
              })}
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-4 border-b border-[var(--accent)]/20">
            <div className="py-4 text-center">
              <div className="text-[24px] font-bold">{g.totalCompleted}</div>
              <div className="text-[11px] text-[var(--text3)] tracking-[0.5px] mt-0.5">
                {t('profile.lessonsDone')}
              </div>
            </div>
            <div className="py-4 text-center border-l border-[var(--accent)]/20">
              <div className="text-[24px] font-bold">{activeCourses}</div>
              <div className="text-[11px] text-[var(--text3)] tracking-[0.5px] mt-0.5">
                {t('profile.activeCourses')}
              </div>
            </div>
            <div className="py-4 text-center border-l border-[var(--accent)]/20">
              <div className="text-[24px] font-bold">{earnedBadges}</div>
              <div className="text-[11px] text-[var(--text3)] tracking-[0.5px] mt-0.5">
                {t('profile.badges')}
              </div>
            </div>
            <div className="py-4 text-center border-l border-[var(--accent)]/20">
              <div className="text-[24px] font-bold">
                {streak === null ? '—' : streak}
                {streak !== null && streak > 0 && <span className="text-[16px] ml-1">🔥</span>}
              </div>
              <div className="text-[11px] text-[var(--text3)] tracking-[0.5px] mt-0.5">
                {t('profile.streak')}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="py-5 border-b border-[var(--accent)]/20">
            <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-3.5">
              {t('profile.badges')}
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2.5">
              {g.badges.map((b) => (
                <Badge
                  key={`${b.courseKey}-${b.level}`}
                  icon={b.icon}
                  label={b.label}
                  earned={b.earned}
                  description={b.description}
                />
              ))}
            </div>
          </div>

          {/* Email change */}
          <div className="py-5 border-b border-[var(--accent)]/20">
            <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-3.5">
              {t('profile.emailSection')}
            </h2>
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

          {/* Security / change password */}
          <div className="py-5">
            <h2 className="text-[13px] font-semibold tracking-[1px] text-[var(--text3)] mb-3.5">
              {t('profile.security')}
            </h2>
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
        </div>
      </main>
    </div>
  );
}
