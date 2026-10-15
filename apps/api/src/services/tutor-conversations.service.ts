import type {
  TutorAnswerEnd,
  TutorConversationPage,
  TutorConversationSummary,
  TutorLessonRef,
  TutorMessage,
} from '@cyberstars/shared/tutor';
import type {
  TutorConversation as TutorConversationRow,
  TutorMessage as TutorMessageRow,
} from '@prisma/client';
import * as repo from '../repositories/tutor-conversations.repository.js';

// A student keeps their newest 50 conversations, each its newest 200 messages;
// the model sees a conversation's last 20.
const KEEP_CONVERSATIONS = 50;
const KEEP = 200;
const SENT_TO_MODEL = 20;
const PAGE = 30;
const TITLE_MAX_LENGTH = 80;

export interface PastMessage {
  role: 'student' | 'tutor';
  text: string;
}

// A conversation a message goes to: its id and what it is about.
export interface ConversationRef {
  id: number;
  lesson: TutorLessonRef | null;
}

function lessonOf(row: TutorConversationRow): TutorLessonRef | null {
  return row.courseKey && row.lessonSlug
    ? { courseKey: row.courseKey, lessonSlug: row.lessonSlug }
    : null;
}

function shape(row: TutorMessageRow): TutorMessage {
  return {
    id: row.id,
    role: row.role as TutorMessage['role'],
    text: row.text,
    finish: row.finish as TutorAnswerEnd | null,
    createdAt: row.createdAt.toISOString(),
  };
}

// The history names a conversation by the start of its first question, on one line.
export function titleOf(question: string): string {
  return question.replace(/\s+/g, ' ').trim().slice(0, TITLE_MAX_LENGTH);
}

export async function listConversations(userId: number): Promise<TutorConversationSummary[]> {
  const rows = await repo.listConversations(userId, KEEP_CONVERSATIONS);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    lesson: lessonOf(row),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

// The conversation when it is this student's, else null.
export async function findConversation(
  userId: number,
  id: number,
): Promise<ConversationRef | null> {
  const row = await repo.findConversation(userId, id);
  return row && { id: row.id, lesson: lessonOf(row) };
}

// The end of the conversation the model is given, oldest first. An answer
// blocked before any words has nothing to give it.
export async function recentHistory(conversationId: number): Promise<PastMessage[]> {
  const rows = await repo.listNewest(conversationId, SENT_TO_MODEL);
  return rows
    .reverse()
    .filter((row) => row.text.length > 0)
    .map((row) => ({ role: row.role as PastMessage['role'], text: row.text }));
}

// The student's message and the tutor's answer, saved together once the answer
// ended, into the conversation or, without one, into a new one about the
// lesson. Returns the conversation's id. A storage failure is logged and never
// reaches the student, who already has the answer on screen: it returns null.
export async function saveExchange(
  userId: number,
  to: number | { lesson: TutorLessonRef | null },
  question: { text: string; sentAt: Date },
  answer: { text: string; finish: TutorAnswerEnd },
): Promise<number | null> {
  try {
    return await repo.saveAndPrune(
      typeof to === 'number'
        ? to
        : {
            userId,
            courseKey: to.lesson?.courseKey ?? null,
            lessonSlug: to.lesson?.lessonSlug ?? null,
            title: titleOf(question.text),
          },
      [
        { role: 'student', text: question.text, finish: null, createdAt: question.sentAt },
        { role: 'tutor', text: answer.text, finish: answer.finish, createdAt: new Date() },
      ],
      { messages: KEEP, conversations: KEEP_CONVERSATIONS },
    );
  } catch (err) {
    console.error('[tutor] could not save the conversation:', err);
    return null;
  }
}

// A page of the student's conversation, or null when it isn't theirs.
export async function getPage(
  userId: number,
  id: number,
  before?: number,
): Promise<TutorConversationPage | null> {
  if (!(await repo.findConversation(userId, id))) return null;
  const rows = await repo.listNewest(id, PAGE + 1, before);
  return { messages: rows.slice(0, PAGE).map(shape), hasMore: rows.length > PAGE };
}

// Deletes the student's conversation; false when it isn't theirs.
export function deleteConversation(userId: number, id: number): Promise<boolean> {
  return repo.deleteConversation(userId, id);
}
