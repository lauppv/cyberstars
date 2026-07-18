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

// Earned badges from per-course completion counts, mirroring the client's
// useGamification: "First Steps" at >=1 lesson, then one tier per 10 lessons
// (Bronze/Silver/Gold...). done never exceeds a course's lesson count, so
// floor(done/10) can't exceed the course's max tier.
function earnedBadgeCount(counts: { done: number }[]): number {
  let n = 0;
  for (const { done } of counts) {
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
  };

  const needStats = isSelf || user.showStats;
  const needProgress = isSelf || user.showProgress;
  if (!needStats && !needProgress) return profile;

  const [rank, counts, activityRows] = await Promise.all([
    leaderboardService.getMyRank(targetId),
    progressRepo.getCompletedCountsByCourse(targetId),
    needStats ? progressRepo.getActivityDates(targetId) : Promise.resolve([]),
  ]);

  const totalXp = rank?.totalXp ?? 0;

  if (needStats) {
    // Derive lessonsDone and activeCourses from the same live counts so the two
    // stat cells stay consistent (the leaderboard rank is cached up to a few
    // minutes, so reading lessonsDone off it could disagree with activeCourses).
    let lessonsDone = 0;
    let activeCourses = 0;
    for (const c of counts) {
      lessonsDone += c.done;
      if (ACTIVE_COURSE_KEYS.has(c.courseKey) && c.done > 0) activeCourses += 1;
    }
    profile.stats = {
      lessonsDone,
      activeCourses,
      streak: computeStreak(activityRows),
    };
  }

  if (needProgress) {
    const level = rank?.level ?? levelFromXp(totalXp);
    profile.progress = {
      level,
      totalXp,
      titleKey: rank?.titleKey ?? levelTitleKey(level),
      rank: rank && totalXp > 0 ? rank.rank : null,
      badges: earnedBadgeCount(counts),
    };
  }

  return profile;
}
