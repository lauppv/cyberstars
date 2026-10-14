import type {
  TutorAnswerEnd,
  TutorConversationPage,
  TutorLessonRef,
  TutorMessage,
} from '@cyberstars/shared/tutor';
import type { TutorMessage as TutorMessageRow } from '@prisma/client';
import * as repo from '../repositories/tutor-messages.repository.js';
import type { ConversationKey } from '../repositories/tutor-messages.repository.js';

// Each conversation keeps its newest 200 messages; the model sees the last 20.
const KEEP = 200;
const SENT_TO_MODEL = 20;
const PAGE = 30;

export interface PastMessage {
  role: 'student' | 'tutor';
  text: string;
}

export function conversationKey(userId: number, lesson?: TutorLessonRef): ConversationKey {
  return {
    userId,
    courseKey: lesson?.courseKey ?? null,
    lessonSlug: lesson?.lessonSlug ?? null,
  };
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

// The end of the conversation the model is given, oldest first. An answer
// blocked before any words has nothing to give it.
export async function recentHistory(key: ConversationKey): Promise<PastMessage[]> {
  const rows = await repo.listNewest(key, SENT_TO_MODEL);
  return rows
    .reverse()
    .filter((row) => row.text.length > 0)
    .map((row) => ({ role: row.role as PastMessage['role'], text: row.text }));
}

// The student's message and the tutor's answer, saved together once the answer
// ended. A storage failure is logged and never reaches the student, who
// already has the answer on screen.
export async function saveExchange(
  key: ConversationKey,
  question: { text: string; sentAt: Date },
  answer: { text: string; finish: TutorAnswerEnd },
): Promise<void> {
  try {
    await repo.saveAndPrune(
      key,
      [
        { role: 'student', text: question.text, finish: null, createdAt: question.sentAt },
        { role: 'tutor', text: answer.text, finish: answer.finish, createdAt: new Date() },
      ],
      KEEP,
    );
  } catch (err) {
    console.error('[tutor] could not save the conversation:', err);
  }
}

export async function getPage(
  key: ConversationKey,
  before?: number,
): Promise<TutorConversationPage> {
  const rows = await repo.listNewest(key, PAGE + 1, before);
  return { messages: rows.slice(0, PAGE).map(shape), hasMore: rows.length > PAGE };
}

export function deleteConversation(key: ConversationKey): Promise<void> {
  return repo.deleteConversation(key);
}
