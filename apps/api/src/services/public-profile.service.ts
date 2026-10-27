import * as userRepo from '../repositories/user.repository.js';
import * as progressRepo from '../repositories/progress.repository.js';
import * as laniakeaRepo from '../repositories/laniakea.repository.js';
import * as leaderboardService from './leaderboard.service.js';
import * as connectionsService from './connections.service.js';
import { computeStreak, listDone, recentActivity } from './activity.service.js';
import {
  levelFromXp,
  levelTitleKey,
  MAIN_COURSE_KEYS,
  TERMINAL_COURSE_KEYS,
} from '@cyberstars/shared/constants';
import type { PublicProfile, PublicProfileBadge } from '@cyberstars/shared/profile';
import { AppError } from '@cyberstars-framework/server-kit/errors';

const ACTIVE_COURSE_KEYS = new Set<string>([...MAIN_COURSE_KEYS, ...TERMINAL_COURSE_KEYS]);

// Earned badges from per-course completion counts, mirroring the client's
// useGamification: "First Steps" at >=1 lesson (level 0), then one tier per 10
// lessons (level 1=Bronze, 2=Silver, 3=Gold...). done never exceeds a course's
// lesson count, so floor(done/10) can't exceed the course's max tier.
function earnedBadges(courses: { courseKey: string; slugs: string[] }[]): PublicProfileBadge[] {
  const badges: PublicProfileBadge[] = [];
  for (const { courseKey, slugs } of courses) {
    const done = slugs.length;
    if (done >= 1) badges.push({ courseKey, level: 0 });
    for (let lvl = 1; lvl <= Math.floor(done / 10); lvl++) badges.push({ courseKey, level: lvl });
  }
  return badges;
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
    connections: null,
    connectionRelation: await connectionsService.relationTo(viewerId, targetId),
  };

  const needStats = isSelf || user.showStats;
  const needProgress = isSelf || user.showProgress;
  // The heatmap tells on which day each lesson was done, so only its owner
  // sees it; there is no setting to show it to others.
  const needActivity = isSelf;
  const needConnections = isSelf || user.showConnections;

  if (needConnections) {
    profile.connections = await connectionsService.publicConnections(targetId);
  }

  if (!needStats && !needProgress && !needActivity) return profile;

  const [rank, completed, activityRows, passes] = await Promise.all([
    needStats || needProgress ? leaderboardService.getMyRank(targetId) : Promise.resolve(null),
    needStats || needProgress ? progressRepo.getCompletedByCourse(targetId) : Promise.resolve([]),
    needStats || needActivity ? progressRepo.getActivityDates(targetId) : Promise.resolve([]),
    needStats || needActivity ? laniakeaRepo.listPasses(targetId) : Promise.resolve([]),
  ]);
  const done = listDone(activityRows, passes);

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
      streak: computeStreak(done),
      // Enumerate every course with completed lessons, most completed first, so
      // the profile can show expandable per-course lesson lists.
      courses: [...completed]
        .sort((a, b) => b.slugs.length - a.slugs.length)
        .map((c) => ({ courseKey: c.courseKey, lessons: c.slugs })),
    };
  }

  if (needProgress) {
    const level = rank?.level ?? levelFromXp(totalXp);
    const badgeList = earnedBadges(completed);
    profile.progress = {
      level,
      totalXp,
      titleKey: rank?.titleKey ?? levelTitleKey(level),
      rank: rank && totalXp > 0 ? rank.rank : null,
      badges: badgeList.length,
      badgeList,
    };
  }

  if (needActivity) profile.activity = recentActivity(done, now);

  return profile;
}
