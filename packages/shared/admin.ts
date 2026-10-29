import type { TicketStatus } from './support.js';

export interface AdminUserStats {
  total: number;
  byRole: { USER: number; MODERATOR: number; ADMIN: number; FOUNDER: number };
  newLast7Days: number;
  newLast30Days: number;
  active: number; // users with at least one progress row
}

interface AdminCourseProgress {
  courseKey: string;
  completions: number;
  learners: number; // distinct users with a completion in this course
}

interface AdminLessonStat {
  courseKey: string;
  lessonSlug: string;
  completions: number;
}

export interface AdminProgressStats {
  totalCompletions: number;
  byCourse: AdminCourseProgress[];
  topLessons: AdminLessonStat[];
}

export interface AdminForumStats {
  threads: number;
  posts: number;
  reactions: number;
}

export interface AdminSupportStats {
  total: number;
  byStatus: Record<TicketStatus, number>;
}

interface AdminCodeExecStats {
  activeContainers: number;
  runningNow: number;
  maxContainers: number;
  openSessions: number;
  perLanguage: Record<string, number>;
  /** Sandboxes busy right now (editor runs, Run Tests, terminal commands), out of the server's limit. */
  busySlots: number;
  maxBusySlots: number;
}

export interface AdminStatsDTO {
  users: AdminUserStats;
  progress: AdminProgressStats;
  forum: AdminForumStats;
  support: AdminSupportStats;
  codeExec: AdminCodeExecStats;
  online: number; // signed-in users with the app open now, the founder left out
  /** ISO time the cached aggregates were computed. */
  generatedAt: string;
}

export interface AnnouncementSentDTO {
  sent: number; // accounts that got it in their bell
}

export interface AnnouncementDTO {
  id: number;
  text: string;
  authorName: string | null; // null once the author's account is gone
  createdAt: string;
}
