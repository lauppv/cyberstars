import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { Topbar } from '../components/layout/Topbar';
import { Badge } from '../components/gamification/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmojiPicker } from '../components/ui/EmojiPicker';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { MAIN_COURSE_KEYS, TERMINAL_COURSE_KEYS } from '../../shared/constants';
import * as profileService from '../services/profileService';
import { INPUT_CLS } from '../constants/styles';

export function ProfilePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isLoggedIn, isLoading, refreshUser } = useAuth();
  const g = useGamification();
  const { courses: allCourses } = useCurriculum();
  const { progressMap } = useAllProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLInputElement>(null);

  const STATUS_MAX = 80;

  // Insert an emoji at the caret (or the end), respecting the length cap, and
  // keep focus/selection where the user expects it.
  const insertEmoji = (emoji: string) => {
    const el = statusRef.current;
    const start = el?.selectionStart ?? status.length;
    const end = el?.selectionEnd ?? status.length;
    const next = (status.slice(0, start) + emoji + status.slice(end)).slice(0, STATUS_MAX);
    setStatus(next);
    requestAnimationFrame(() => {
      el?.focus();
      const pos = Math.min(start + emoji.length, next.length);
      el?.setSelectionRange(pos, pos);
    });
  };

  const activeCourses = allCourses.filter((c) => {
    const keys = [...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS] as readonly string[];
    return keys.includes(c.key) && progressMap[c.key]?.completed > 0;
  }).length;

  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [streak, setStreak] = useState<number | null>(null);

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
        <div className="w-full max-w-[520px] rounded-[var(--radius)] panel px-6 py-6">
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
                  ref={statusRef}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder={t('profile.statusPlaceholder')}
                  maxLength={STATUS_MAX}
                  className={INPUT_CLS + ' flex-1'}
                />
                <EmojiPicker onSelect={insertEmoji} disabled={saving} />
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

          {/* Settings link */}
          <div className="py-5">
            <button
              onClick={() => navigate('/settings')}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] text-[13px] font-semibold cursor-pointer hover:bg-[var(--accent)]/20 transition flex items-center justify-center gap-2"
            >
              <span>⚙️</span> {t('profile.openSettings')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
