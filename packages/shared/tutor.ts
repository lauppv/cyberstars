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
