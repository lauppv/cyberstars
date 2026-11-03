// How long a poll's question and each option can be, and how many options it takes
export const POLL_QUESTION_MAX_LENGTH = 300;
export const POLL_OPTION_MAX_LENGTH = 200;
export const POLL_MIN_OPTIONS = 2;
export const POLL_MAX_OPTIONS = 10;

// A poll as a student opens it from the bell: no counts, only whether they voted
export interface PollDTO {
  id: number;
  question: string;
  options: { id: number; text: string }[];
  voted: boolean;
}

export interface PollSentDTO {
  sent: number; // accounts that got it in their bell
}

// A poll with its counts, for the admin page
export interface PollResultsDTO {
  id: number;
  question: string;
  authorName: string | null; // null once the author's account is gone
  createdAt: string;
  recipients: number;
  voters: number; // each voter once, however many options they picked
  options: { id: number; text: string; votes: number }[];
}
