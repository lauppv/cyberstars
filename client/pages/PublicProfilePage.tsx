import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { canAccessFeature } from '../../shared/features';
import { useCurriculum } from '../context/CurriculumContext';
import { ActivityHeatmap } from '../components/gamification/ActivityHeatmap';
import { bucketByLocalDay } from '../components/gamification/heatmap-utils';
import { courseMeta, courseTitle } from '../constants/courses';
import * as userService from '../services/userService';
import * as messagesService from '../services/messagesService';
import type { PublicProfile } from '../../shared/profile';
import type { Course } from '../../shared/lesson';

function Avatar({ url }: { url: string | null }) {
  return url ? (
    <img
      src={url}
      alt=""
      className="w-20 h-20 rounded-full object-cover border-[3px] border-[var(--accent)] flex-shrink-0"
    />
  ) : (
    <div className="w-20 h-20 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[36px] border-[3px] border-[var(--accent)] flex-shrink-0">
      🚀
    </div>
  );
}

// Resolve a course's completed slugs to lesson titles (via the loaded
// curriculum), ordered by the lesson's position in the course. Falls back to the
// raw slug for anything the curriculum doesn't know about.
function completedLessonTitles(course: Course | undefined, slugs: string[]): string[] {
  if (!course) return slugs;
  const bySlug = new Map(course.lessons.map((l) => [l.slug, l]));
  return slugs
    .map((slug) => bySlug.get(slug) ?? { slug, title: slug, sortOrder: Number.MAX_SAFE_INTEGER })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((l) => l.title);
}

function CompletedCourses({ courses }: { courses: { courseKey: string; lessons: string[] }[] }) {
  const { t } = useTranslation();
  const { courses: curriculum } = useCurriculum();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="py-4 border-b border-[var(--accent)]/20">
      <div className="text-[11px] text-[var(--text3)] tracking-[0.5px] uppercase mb-2">
        {t('publicProfile.completedCourses')}
      </div>
      <div className="flex flex-col gap-1.5">
        {courses.map(({ courseKey, lessons }) => {
          const meta = courseMeta(courseKey);
          const isOpen = expanded.has(courseKey);
          const titles = isOpen
            ? completedLessonTitles(
                curriculum.find((c) => c.key === courseKey),
                lessons,
              )
            : [];
          return (
            <div key={courseKey}>
              <button
                onClick={() => toggle(courseKey)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 transition cursor-pointer text-left"
              >
                <span className="text-[15px] leading-none">{meta.icon}</span>
                <span className="text-[13px] font-semibold text-[var(--text)] flex-1 min-w-0 truncate">
                  {courseTitle(courseKey)}
                </span>
                <span className="text-[11px] tabular-nums text-[var(--text3)]">
                  {lessons.length}
                </span>
                <span
                  className={`text-[10px] text-[var(--text3)] transition-transform ${isOpen ? 'rotate-90' : ''}`}
                >
                  ▶
                </span>
              </button>
              {isOpen && (
                <ul className="mt-1 mb-1 pl-8 pr-2 flex flex-col gap-0.5">
                  {titles.map((title, i) => (
                    <li
                      key={i}
                      className="text-[12px] text-[var(--text2)] flex items-baseline gap-1.5"
                    >
                      <span className="text-[var(--accent)] text-[10px]">✓</span>
                      <span className="min-w-0 break-words">{title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const canAccess = canAccessFeature('leaderboard', user?.role, import.meta.env.PROD);
  const canMessage = canAccessFeature('messaging', user?.role, import.meta.env.PROD);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'notFound' | 'generic' | null>(null);
  const [messaging, setMessaging] = useState(false);

  // Client-side guard is UX only — the API is server-authoritative.
  useEffect(() => {
    if (authLoading) return;
    if (!canAccess) navigate('/');
  }, [authLoading, canAccess, navigate]);

  useEffect(() => {
    if (authLoading || !canAccess) return;
    const id = Number(userId);
    if (!Number.isInteger(id) || id <= 0) {
      setError('notFound'); // eslint-disable-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    userService
      .getPublicProfile(id)
      .then((p) => {
        if (!cancelled) setProfile(p);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = (err as { status?: number }).status;
        setError(status === 404 ? 'notFound' : 'generic');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, authLoading, canAccess]);

  const startConversation = async () => {
    if (!profile) return;
    setMessaging(true);
    try {
      const { conversation } = await messagesService.openConversation(profile.userId);
      navigate('/messages', { state: { openConversationId: conversation.id } });
    } catch {
      setMessaging(false);
    }
  };

  const activityCounts = useMemo(
    () => bucketByLocalDay(profile?.activity ?? []),
    [profile?.activity],
  );

  const memberSinceLabel = profile
    ? new Date(profile.memberSince).toLocaleDateString(i18n.resolvedLanguage ?? 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const statCells: { key: string; value: React.ReactNode; label: string }[] = [];
  if (profile?.stats) {
    statCells.push({
      key: 'lessons',
      value: profile.stats.lessonsDone,
      label: t('profile.lessonsDone'),
    });
    statCells.push({
      key: 'courses',
      value: profile.stats.activeCourses,
      label: t('profile.activeCourses'),
    });
  }
  if (profile?.progress) {
    statCells.push({ key: 'badges', value: profile.progress.badges, label: t('profile.badges') });
  }
  if (profile?.stats) {
    statCells.push({
      key: 'streak',
      value: (
        <>
          {profile.stats.streak}
          {profile.stats.streak > 0 && <span className="text-[16px] ml-1">🔥</span>}
        </>
      ),
      label: t('profile.streak'),
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 flex justify-center px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : error || !profile ? (
          <div className="text-center text-[var(--text3)] py-16">
            {t(error === 'notFound' ? 'publicProfile.notFound' : 'publicProfile.error')}
          </div>
        ) : (
          <div className="w-full max-w-[520px] rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[rgba(22,22,29,0.1)] backdrop-blur-[12px] px-6 py-6">
            {/* Header */}
            <div className="flex items-center gap-5 pb-5 border-b border-[var(--accent)]/20">
              <Avatar url={profile.avatarUrl} />
              <div className="flex-1 min-w-0">
                <h1 className="text-[22px] font-bold tracking-[-0.3px] truncate">{profile.name}</h1>
                {memberSinceLabel && (
                  <p className="text-[11px] text-[var(--text3)] mt-0.5">
                    {t('profile.memberSince', { date: memberSinceLabel })}
                  </p>
                )}
                {profile.status && (
                  <p className="text-[11px] text-[var(--accent)] mt-1">💬 {profile.status}</p>
                )}
              </div>
            </div>

            {profile.bio && (
              <p className="py-4 border-b border-[var(--accent)]/20 text-[13px] text-[var(--text2)] whitespace-pre-wrap break-words">
                {profile.bio}
              </p>
            )}

            {/* Level & XP */}
            {profile.progress && (
              <div className="py-4 border-b border-[var(--accent)]/20 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-[15px] font-bold text-[var(--accent)]">
                    {t('level.label', { n: profile.progress.level })}
                  </span>
                  <span className="text-[13px] font-semibold text-[var(--text)]">
                    {t(profile.progress.titleKey)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[var(--text3)] tabular-nums">
                  {profile.progress.rank != null && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                      title={t('publicProfile.rank', { n: profile.progress.rank })}
                    >
                      #{profile.progress.rank}
                    </span>
                  )}
                  <span>
                    {profile.progress.totalXp} {t('profile.xp')}
                  </span>
                </div>
              </div>
            )}

            {/* Stat grid — cells depend on which sections are visible */}
            {statCells.length > 0 && (
              <div
                className="grid border-b border-[var(--accent)]/20"
                style={{ gridTemplateColumns: `repeat(${statCells.length}, minmax(0, 1fr))` }}
              >
                {statCells.map((cell, i) => (
                  <div
                    key={cell.key}
                    className={`py-4 text-center ${i > 0 ? 'border-l border-[var(--accent)]/20' : ''}`}
                  >
                    <div className="text-[24px] font-bold">{cell.value}</div>
                    <div className="text-[11px] text-[var(--text3)] tracking-[0.5px] mt-0.5">
                      {cell.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed courses — expandable per-course lesson lists */}
            {profile.stats && profile.stats.courses.length > 0 && (
              <CompletedCourses courses={profile.stats.courses} />
            )}

            {/* Activity heatmap */}
            {profile.activity && (
              <div className="py-4 border-b border-[var(--accent)]/20">
                <ActivityHeatmap activityCounts={activityCounts} />
              </div>
            )}

            {/* Actions */}
            <div className="pt-5 flex items-center gap-3">
              {profile.isSelf ? (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold cursor-pointer border-none hover:brightness-110 transition"
                  >
                    {t('publicProfile.editProfile')}
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="px-4 py-2 rounded-[var(--radius-sm)] border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] text-[13px] font-semibold cursor-pointer hover:bg-[var(--accent)]/20 transition"
                  >
                    {t('publicProfile.settings')}
                  </button>
                </>
              ) : (
                canMessage && (
                  <button
                    onClick={startConversation}
                    disabled={messaging}
                    className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[13px] font-semibold cursor-pointer border-none hover:brightness-110 transition disabled:opacity-50"
                  >
                    {t('publicProfile.sendMessage')}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
