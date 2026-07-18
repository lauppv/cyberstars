import * as userRepo from '../repositories/user.repository.js';
import * as progressRepo from '../repositories/progress.repository.js';
import * as leaderboardService from './leaderboard.service.js';
import { computeStreak } from './activity.service.js';
import {
  levelFromXp,
  levelTitleKey,
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
} from '../../shared/constants.js';
import type { PublicProfile } from '../../shared/profile.js';
import { AppError } from '../middleware/errorHandler.js';

const ACTIVE_COURSE_KEYS = new Set<string>([...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]);

const MS_PER_DAY = 86_400_000;
// A little over the heatmap's 20-week span, so days near the left edge still
// fill in.
const HEATMAP_WINDOW_DAYS = 150;

// Earned badges from per-course completion counts, mirroring the client's
// useGamification: "First Steps" at >=1 lesson, then one tier per 10 lessons
// (Bronze/Silver/Gold...). done never exceeds a course's lesson count, so
// floor(done/10) can't exceed the course's max tier.
function earnedBadgeCount(courses: { slugs: string[] }[]): number {
  let n = 0;
  for (const { slugs } of courses) {
    const done = slugs.length;
    if (done >= 1) n += 1;
    n += Math.floor(done / 10);
  }
  return n;
}

export async function getPublicProfile(
  targetId: number,
  viewerId: number | null,
): Promise<PublicProfile> {
  const user = await userRepo.findById(targetId);
  if (!user) throw new AppError(404, 'User not found');

  const isSelf = viewerId === targetId;
  const now = new Date();
  const statusExpired = user.statusExpiresAt && user.statusExpiresAt < now;
  const activeStatus = statusExpired ? null : user.status;

  const profile: PublicProfile = {
    userId: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    memberSince: user.createdAt.toISOString(),
    isSelf,
    status: isSelf || user.showBio ? activeStatus : null,
    bio: isSelf || user.showBio ? user.bio : null,
    stats: null,
    progress: null,
    activity: null,
  };

  const needStats = isSelf || user.showStats;
  const needProgress = isSelf || user.showProgress;
  const needActivity = isSelf || user.showActivity;
  if (!needStats && !needProgress && !needActivity) return profile;

  const [rank, completed, activityRows] = await Promise.all([
    needStats || needProgress ? leaderboardService.getMyRank(targetId) : Promise.resolve(null),
    needStats || needProgress ? progressRepo.getCompletedByCourse(targetId) : Promise.resolve([]),
    needStats || needActivity ? progressRepo.getActivityDates(targetId) : Promise.resolve([]),
  ]);

  const totalXp = rank?.totalXp ?? 0;

  if (needStats) {
    // Derive lessonsDone and activeCourses from the same live counts so the two
    // stat cells stay consistent (the leaderboard rank is cached up to a few
    // minutes, so reading lessonsDone off it could disagree with activeCourses).
    let lessonsDone = 0;
    let activeCourses = 0;
    for (const c of completed) {
      lessonsDone += c.slugs.length;
      if (ACTIVE_COURSE_KEYS.has(c.courseKey) && c.slugs.length > 0) activeCourses += 1;
    }
    profile.stats = {
      lessonsDone,
      activeCourses,
      streak: computeStreak(activityRows),
      // Enumerate every course with completed lessons, most completed first, so
      // the profile can show expandable per-course lesson lists.
      courses: [...completed]
        .sort((a, b) => b.slugs.length - a.slugs.length)
        .map((c) => ({ courseKey: c.courseKey, lessons: c.slugs })),
    };
  }

  if (needProgress) {
    const level = rank?.level ?? levelFromXp(totalXp);
    profile.progress = {
      level,
      totalXp,
      titleKey: rank?.titleKey ?? levelTitleKey(level),
      rank: rank && totalXp > 0 ? rank.rank : null,
      badges: earnedBadgeCount(completed),
    };
  }

  if (needActivity) {
    // Only the recent window the heatmap renders (~20 weeks) plus a small buffer,
    // to bound the payload. The client buckets these by its own local day.
    const cutoff = new Date(now.getTime() - HEATMAP_WINDOW_DAYS * MS_PER_DAY);
    profile.activity = activityRows
      .filter((r) => r.completedAt && r.completedAt >= cutoff)
      .map((r) => r.completedAt!.toISOString());
  }

  return profile;
}
