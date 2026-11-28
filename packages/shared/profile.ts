import type { BadgeRef } from './badges.js';

// Public-profile DTO returned by GET /api/users/:id/profile. Each optional
// section is present only when the target user's matching privacy flag is on
// (own view always sees everything). Name/avatar/memberSince are always public.

import type { ConnectionRelation, ConnectionUser } from './connections.js';

interface PublicProfileCourse {
  courseKey: string;
  lessons: string[]; // completed lesson slugs; the client resolves titles from curriculum
}

interface PublicProfileStats {
  lessonsDone: number;
  activeCourses: number;
  streak: number;
  courses: PublicProfileCourse[]; // per-course completed lessons, most completed first
}

// One earned badge (badges.ts); the client resolves icon and localized label
export type PublicProfileBadge = BadgeRef;

interface PublicProfileProgress {
  level: number;
  totalXp: number; // earned XP (same figure the leaderboard ranks on)
  titleKey: string; // i18n key for the cosmos level title
  rank: number | null; // leaderboard rank, null if unranked (0 XP)
  badges: number; // count of earned badges across courses and projects
  badgeList: PublicProfileBadge[]; // the earned badges, for enumeration
}

// What the activity heatmap tells apart: a lesson, an algorithm, or a Laniakea
// test that moved its planet
export type ActivityKind = 'lesson' | 'algo' | 'recap';

export interface ActivityItem {
  at: string; // ISO
  kind: ActivityKind;
}

export interface PublicProfile {
  userId: number;
  name: string;
  avatarUrl: string | null;
  memberSince: string; // ISO
  emailConfirmed: boolean; // the check or cross next to the avatar
  isSelf: boolean; // true when the viewer is looking at their own profile
  status: string | null; // null when hidden or unset
  bio: string | null; // null when hidden or unset
  stats: PublicProfileStats | null; // null when hidden
  progress: PublicProfileProgress | null; // null when hidden
  // What the student did in the recent window, for the activity heatmap. Null
  // when hidden; the client buckets it by local day.
  activity: ActivityItem[] | null;
  // The target's accepted connections. Null when hidden (showConnections off and
  // not self). `count` always reflects the true total even when the list is
  // truncated for display.
  connections: { users: ConnectionUser[]; count: number } | null;
  // The viewer's relationship to this profile, for rendering the connect button.
  // 'self' on own profile, 'none' for logged-out viewers.
  connectionRelation: ConnectionRelation;
  // The viewer blocked this student (CYB-140): the profile offers Unblock in
  // place of Send Message and Connect. Never says whether they blocked the viewer.
  blockedByMe: boolean;
}
