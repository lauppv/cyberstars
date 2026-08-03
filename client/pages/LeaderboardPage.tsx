import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/layout/Topbar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { canAccessFeature } from '../../shared/features';
import * as leaderboardService from '../services/leaderboardService';
import type { LeaderboardEntry } from '../../shared/leaderboard';

const PAGE_SIZE = 50;
const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function Avatar({ url }: { url: string | null }) {
  return url ? (
    <img
      src={url}
      alt=""
      className="w-9 h-9 rounded-full object-cover border-2 border-[var(--accent)]/60 flex-shrink-0"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-[var(--surface2)] flex items-center justify-center text-sm border-2 border-[var(--accent)]/60 flex-shrink-0">
      🚀
    </div>
  );
}

function Row({
  entry,
  isMe,
  t,
}: {
  entry: LeaderboardEntry;
  isMe: boolean;
  t: (k: string, o?: Record<string, unknown>) => string;
}) {
  const medal = MEDALS[entry.rank];
  return (
    <Link
      to={`/u/${entry.userId}`}
      className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 border-b border-[var(--accent)]/20 last:border-b-0 no-underline text-inherit hover:bg-[var(--accent)]/[0.07] transition ${
        isMe ? 'bg-[var(--accent)]/10' : ''
      }`}
    >
      <span className="w-8 sm:w-10 text-center tabular-nums font-bold text-[15px] text-[var(--text2)] flex-shrink-0">
        {medal ?? `#${entry.rank}`}
      </span>
      <Avatar url={entry.avatarUrl} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-[14px] text-[var(--text)] flex items-center gap-2">
          {entry.name}
          {isMe && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
              {t('leaderboard.you')}
            </span>
          )}
        </div>
        <div className="text-[11px] text-[var(--text3)] truncate">{t(entry.titleKey)}</div>
      </div>
      <span
        className="hidden sm:inline-flex items-center gap-1 flex-shrink-0 text-[12px] font-semibold px-2 py-0.5 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"
        title={t('level.short', { n: entry.level })}
      >
        ⭐ {t('level.short', { n: entry.level })}
      </span>
      <div className="flex flex-col items-end flex-shrink-0 w-[92px]">
        <span className="tabular-nums font-bold text-[14px] text-[var(--text)]">
          {t('leaderboard.xp', { xp: entry.totalXp })}
        </span>
        <span className="text-[11px] text-[var(--text3)] tabular-nums">
          {t('leaderboard.lessons', { count: entry.lessonsDone })}
        </span>
      </div>
    </Link>
  );
}

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  // Logged-in only: the page shows the platform-wide account total, so guests
  // are kept out even though the feature is launched.
  const canAccess = isLoggedIn && canAccessFeature('leaderboard', user?.role, import.meta.env.PROD);

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [me, setMe] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Client-side guard is UX only — /api/leaderboard is server-authoritative.
  useEffect(() => {
    if (authLoading) return;
    if (!canAccess) navigate('/');
  }, [authLoading, canAccess, navigate]);

  useEffect(() => {
    if (authLoading || !canAccess) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        // canAccess implies the visitor is logged in, so always fetch my rank.
        const [page, myRank] = await Promise.all([
          leaderboardService.getLeaderboard(PAGE_SIZE, 0),
          leaderboardService.getMyRank(),
        ]);
        if (cancelled) return;
        setEntries(page.entries);
        setTotal(page.total);
        setMe(myRank);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, canAccess]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    leaderboardService
      .getLeaderboard(PAGE_SIZE, entries.length)
      .then((page) => {
        setEntries((prev) => [...prev, ...page.entries]);
        setTotal(page.total);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [entries.length]);

  const meVisible = me != null && entries.some((e) => e.userId === me.userId);
  const hasMore = entries.length < total;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)]">
      <Topbar />
      <main className="flex-1 max-w-[760px] mx-auto w-full px-4 sm:px-7 py-8 pb-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-[var(--text3)] py-16">{t('leaderboard.error')}</div>
        ) : entries.length === 0 ? (
          <div className="text-center text-[var(--text3)] py-16">{t('leaderboard.empty')}</div>
        ) : (
          <>
            <div className="rounded-[var(--radius)] panel overflow-hidden">
              {entries.map((e) => (
                <Row key={e.userId} entry={e} isMe={e.userId === me?.userId} t={t} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-5 py-2 rounded-[var(--radius-sm)] border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] text-[13px] font-semibold hover:bg-[var(--accent)]/20 transition cursor-pointer disabled:opacity-60"
                >
                  {loadingMore ? t('common.loading') : t('leaderboard.loadMore')}
                </button>
              </div>
            )}

            {/* If the current user isn't on the loaded page, pin their rank below. */}
            {me != null && !meVisible && (
              <div className="mt-6">
                <div className="text-[11px] uppercase tracking-wider text-[var(--text3)] mb-1.5 px-1">
                  {t('leaderboard.yourRank')}
                </div>
                <div className="rounded-[var(--radius)] panel border-[var(--accent)]/40 overflow-hidden">
                  <Row entry={me} isMe t={t} />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
