// Tutor chat contract shared by client and server.
import type { CodeLanguage } from './constants.js';

// The same cap as a direct message, checked before any model call.
export const TUTOR_MESSAGE_MAX_LENGTH = 2000;

// How an answer ended: in full, cut by the length limit, or blocked by the
// model's safety rules.
export type TutorFinish = 'complete' | 'cut' | 'blocked';

// What the tutor is looking up before its first words: searching the lessons,
// reading one (by its title), or going through the app's pages.
export type TutorLookup = 'search' | 'read' | 'pages';

// The answer streams as server-sent events, each `data:` line one of these:
// a `status` for each lookup before the first words, the next words, then
// `done`, or `error` when it broke off. A `restart` voids every word so far: a
// stray word in another script made the tutor start the answer again. A
// failure before any event is a plain error response instead; an `error` with
// no words before it saved nothing. `done` and `error` name the conversation
// the exchange was saved to, so a new one learns its id; they leave it out
// when the save failed.
export type TutorStreamEvent =
  | { type: 'status'; lookup: TutorLookup; title?: string }
  | { type: 'restart' }
  | { type: 'text'; text: string }
  | { type: 'done'; finish: TutorFinish; conversationId?: number }
  | { type: 'error'; message: string; conversationId?: number };

// How a saved answer ended: as its stream said, or `interrupted` when an error
// or the student leaving broke it off after some words.
export type TutorAnswerEnd = TutorFinish | 'interrupted';

// The lesson or algorithm challenge a conversation is about. A conversation
// without one is a general one.
export interface TutorLessonRef {
  courseKey: string;
  lessonSlug: string;
}

// The end of the last Run's output that goes with a lesson message.
export const TUTOR_RUN_OUTPUT_MAX_LENGTH = 4000;

// A check of the last Run Tests on a Linux lesson, as the student reads it.
export interface TutorTerminalCheck {
  passed: boolean;
  text: string;
}

// The student's work on the lesson as it is when they send a message. The
// verdict is only named: the server reads the stored attempt itself.
export interface TutorLessonWork {
  code: string;
  // The end of the output of their last Run, empty when they haven't run it.
  // On a Linux lesson, which has no code, the end of the terminal session: the
  // commands they typed and what each printed.
  runOutput: string;
  // The judge attempt whose verdict is on screen, if any.
  submissionId?: number;
  // On a Linux lesson: the checks of the last Run Tests on screen, if any.
  checks?: TutorTerminalCheck[];
  // On a course taught in Python, Java and C: the language on screen.
  language?: CodeLanguage;
}

export interface TutorMessage {
  id: number;
  role: 'student' | 'tutor';
  text: string;
  // How an answer ended; null on the student's own messages.
  finish: TutorAnswerEnd | null;
  createdAt: string;
}

// A conversation as the history lists it, the newest first.
export interface TutorConversationSummary {
  id: number;
  // The start of its first question.
  title: string;
  // What it is about; null for a general conversation.
  lesson: TutorLessonRef | null;
  // When its last exchange was saved.
  updatedAt: string;
}

// One page of a conversation, newest first; `hasMore` when older messages remain.
export interface TutorConversationPage {
  messages: TutorMessage[];
  hasMore: boolean;
}
