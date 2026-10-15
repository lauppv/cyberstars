// Tutor chat contract shared by client and server.

// The same cap as a direct message, checked before any model call.
export const TUTOR_MESSAGE_MAX_LENGTH = 2000;

// How an answer ended: in full, cut by the length limit, or blocked by the
// model's safety rules.
export type TutorFinish = 'complete' | 'cut' | 'blocked';

// The answer streams as server-sent events, each `data:` line one of these:
// the next words, then `done`, or `error` when it broke off after some words.
// A failure before any words is a plain error response instead.
export type TutorStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'done'; finish: TutorFinish }
  | { type: 'error'; message: string };

// How a saved answer ended: as its stream said, or `interrupted` when an error
// or the student leaving broke it off after some words.
export type TutorAnswerEnd = TutorFinish | 'interrupted';

// The lesson or algorithm challenge a conversation is about. A message without
// one belongs to the student's general conversation.
export interface TutorLessonRef {
  courseKey: string;
  lessonSlug: string;
}

// The end of the last Run's output that goes with a lesson message.
export const TUTOR_RUN_OUTPUT_MAX_LENGTH = 4000;

// The student's work on the lesson as it is when they send a message. The
// verdict is only named: the server reads the stored attempt itself.
export interface TutorLessonWork {
  code: string;
  // The end of the output of their last Run, empty when they haven't run it.
  runOutput: string;
  // The judge attempt whose verdict is on screen, if any.
  submissionId?: number;
}

export interface TutorMessage {
  id: number;
  role: 'student' | 'tutor';
  text: string;
  // How an answer ended; null on the student's own messages.
  finish: TutorAnswerEnd | null;
  createdAt: string;
}

// One page of a conversation, newest first; `hasMore` when older messages remain.
export interface TutorConversationPage {
  messages: TutorMessage[];
  hasMore: boolean;
}
