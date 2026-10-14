// Tutor chat contract shared by client and server.

// The same cap as a direct message, checked before any model call.
export const TUTOR_MESSAGE_MAX_LENGTH = 2000;

export interface TutorReply {
  answer: string;
}
