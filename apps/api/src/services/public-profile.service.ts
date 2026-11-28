import * as userRepo from '../repositories/user.repository.js';
import * as progressRepo from '../repositories/progress.repository.js';
import * as laniakeaRepo from '../repositories/laniakea.repository.js';
import * as projectsRepo from '../repositories/projects.repository.js';
import * as leaderboardService from './leaderboard.service.js';
import * as connectionsService from './connections.service.js';
import * as blocksService from './blocks.service.js';
import { computeStreak, listDone, recentActivity } from './activity.service.js';
import {
  isClosedCourse,
  levelFromXp,
  levelTitleKey,
  LISTED_COURSE_KEYS,
} from '@cyberstars/shared/constants';
import type { PublicProfile, PublicProfileBadge } from '@cyberstars/shared/profile';
import { courseBadges, projectBadges, type BadgeState } from '@cyberstars/shared/badges';
import { PROJECT_LANGUAGES, findProject } from '@cyberstars/shared/projects';
import { courseParts, lessons } from '@cyberstars/content/curriculum';
import { AppError } from '@cyberstars-framework/server-kit/errors';
import { isStaff } from '@cyberstars/shared/auth';

const ACTIVE_COURSE_KEYS = new Set<string>(LISTED_COURSE_KEYS);

// Earned badges from the same rules as the client's useGamification
function earnedBadges(
  courses: { courseKey: string; slugs: string[] }[],
  projects: { language: string; projectSlug: string }[],
): PublicProfileBadge[] {
  const badges: BadgeState[] = [];
  for (const { courseKey, slugs } of courses) {
    const total = lessons.filter((l) => l.courseKey === courseKey).length;
    badges.push(...courseBadges(courseKey, total, new Set(slugs), courseParts[courseKey]));
  }
  for (const language of PROJECT_LANGUAGES) {
    const done = projects.filter(
      (p) => p.language === language && findProject(language, p.projectSlug),
    );
    badges.push(...projectBadges(language, done.length));
  }
  return badges.filter((b) => b.earned).map(({ kind, key, level }) => ({ kind, key, level }));
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
    emailConfirmed: user.emailConfirmedAt !== null,
    isSelf,
    status: isSelf || user.showBio ? activeStatus : null,
    bio: isSelf || user.showBio ? user.bio : null,
    stats: null,
    progress: null,
    activity: null,
    connections: null,
    connectionRelation: await connectionsService.relationTo(viewerId, targetId),
    blockedByMe:
      viewerId !== null && !isSelf && (await blocksService.isBlockedBy(viewerId, targetId)),
    staff: isStaff(user.role),
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

  const [rank, allCompleted, activityRows, passes, projects] = await Promise.all([
    needStats || needProgress ? leaderboardService.getMyRank(targetId) : Promise.resolve(null),
    needStats || needProgress ? progressRepo.getCompletedByCourse(targetId) : Promise.resolve([]),
    needStats || needActivity ? progressRepo.getActivityDates(targetId) : Promise.resolve([]),
    needStats || needActivity ? laniakeaRepo.listPasses(targetId) : Promise.resolve([]),
    needProgress ? projectsRepo.listCompletions(targetId) : Promise.resolve([]),
  ]);
  const done = listDone(activityRows, passes);
  // A closed course counts nowhere on a profile: no lessons, course or badge
  const completed = allCompleted.filter((c) => !isClosedCourse(c.courseKey));

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
    const badgeList = earnedBadges(completed, projects);
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
