import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { Topbar } from '../components/layout/Topbar';
import { Badge } from '../components/gamification/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCurriculum } from '../context/CurriculumContext';
import { useAllProgress } from '../context/ProgressContext';
import { MAIN_COURSE_KEYS, TERMINAL_COURSE_KEYS } from '../../shared/constants';
import * as profileService from '../services/profileService';

const INPUT_CLS =
  'w-full bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-[13px] px-3 py-2 outline-none transition focus:border-[var(--accent)]';

export function ProfilePage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate('/getstarted');
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      setBio(user.bio ?? ''); // eslint-disable-line react-hooks/set-state-in-effect
      setStatus(user.status ?? '');
    }
  }, [user]);

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
      setUploadError('File too large (max 2MB)');
      return;
    }
    try {
      await profileService.uploadAvatar(file);
      refreshUser();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
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

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />

      <main className="flex-1 flex justify-center px-6 py-10">
        <div className="w-full max-w-[520px]">
          {/* Header with avatar */}
          <div className="flex items-center gap-5 pb-5 border-b border-[var(--border)]">
            <div className="relative group">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
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
                Edit
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
              Remove avatar
            </button>
          )}

          {/* Bio & Status */}
          <div className="py-4 border-b border-[var(--border)] flex flex-col gap-3">
            <div>
              <label className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mb-1 block">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
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
              <label className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mb-1 block">
                Status <span className="normal-case">(expires in 24h)</span>
              </label>
              <div className="flex gap-2">
                <input
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="What are you up to?"
                  maxLength={80}
                  className={INPUT_CLS + ' flex-1'}
                />
                <button
                  onClick={saveStatus}
                  disabled={saving}
                  className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[12px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50"
                >
                  Set
                </button>
              </div>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-3 border-b border-[var(--border)]">
            <div className="py-4 text-center">
              <div className="text-[24px] font-bold">{g.totalCompleted}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">
                Lessons Done
              </div>
            </div>
            <div className="py-4 text-center border-x border-[var(--border)]">
              <div className="text-[24px] font-bold">{activeCourses}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">
                Active Courses
              </div>
            </div>
            <div className="py-4 text-center">
              <div className="text-[24px] font-bold">{earnedBadges}</div>
              <div className="text-[11px] text-[var(--text3)] uppercase tracking-[0.5px] mt-0.5">
                Badges
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="py-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[1px] text-[var(--text3)] mb-3.5">
              Badges
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
        </div>
      </main>
    </div>
  );
}
