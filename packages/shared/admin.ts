// Every number on the admin page counts students only: USER accounts that
// aren't our test accounts, never moderators, admins or the founder
export interface AdminUserStats {
  total: number;
  /** The one count past the students: accounts per role, USER being the students (= total) and BOT our test accounts. */
  byRole: { FOUNDER: number; ADMIN: number; USER: number; BOT: number };
  newLast7Days: number;
  newLast30Days: number;
}

export interface AdminTutorStats {
  promptsLast7Days: number; // messages students sent the tutor: USER accounts only, bots left out
  promptsLast30Days: number;
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

interface AdminCodeExecStats {
  activeContainers: number;
  maxContainers: number;
  perLanguage: Record<string, number>;
  /** Sandboxes busy right now (editor runs, Run Tests, terminal commands), out of the server's limit. */
  busySlots: number;
  maxBusySlots: number;
}

interface AdminOnline {
  users: number; // students signed in with the app open now
  guests: number; // browsers with the app open and no account
}

export interface AdminStatsDTO {
  tutor: AdminTutorStats;
  users: AdminUserStats;
  progress: AdminProgressStats;
  codeExec: AdminCodeExecStats;
  online: AdminOnline;
  /** ISO time the cached aggregates were computed. */
  generatedAt: string;
}

export interface AnnouncementSentDTO {
  sent: number; // students that got it in their bell
}

export interface AnnouncementDTO {
  id: number;
  text: string;
  authorName: string | null; // null once the author's account is gone
  createdAt: string;
  // Accounts that clicked it in the bell, each once, and accounts that got it.
  // Null on the announcements sent before a click was counted
  opens: { openers: number; recipients: number } | null;
}
