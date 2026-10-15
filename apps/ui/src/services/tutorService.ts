import { api, ApiClientError } from './apiClient';
import type {
  TutorConversationPage,
  TutorLessonRef,
  TutorLessonWork,
  TutorStreamEvent,
} from '@cyberstars/shared/tutor';

const API_BASE = import.meta.env.VITE_PROD_API_URL || '';

// The general conversation, or the one about a lesson or algorithm challenge.
function conversationPath(lesson: TutorLessonRef | null): string {
  if (!lesson) return '/api/tutor/conversations/general';
  return `/api/tutor/conversations/${encodeURIComponent(lesson.courseKey)}/${encodeURIComponent(lesson.lessonSlug)}`;
}

export function getConversation(
  lesson: TutorLessonRef | null,
  before?: number,
): Promise<TutorConversationPage> {
  const query = before === undefined ? '' : `?before=${before}`;
  return api.get<TutorConversationPage>(`${conversationPath(lesson)}${query}`);
}

export function deleteConversation(lesson: TutorLessonRef | null): Promise<void> {
  return api.delete<void>(conversationPath(lesson));
}

export interface TutorChatRequest {
  message: string;
  page: string;
  lang: 'en' | 'ro';
  // A message about a lesson comes with the student's work on it.
  lesson?: TutorLessonRef;
  work?: TutorLessonWork;
}

// Sends one message and hands each event of the answer to `onEvent` as it
// arrives. A failure before any words is a plain error response, thrown as an
// ApiClientError; after that the stream itself says how it ended. Resolves when
// the stream closes, whether or not it said so.
export async function streamChat(
  body: TutorChatRequest,
  onEvent: (event: TutorStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tutor/chat`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = 'Something went wrong';
    try {
      const data = await res.json();
      message = data.error || data.message || message;
    } catch {
      // response wasn't JSON
    }
    throw new ApiClientError(res.status, message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    // Events are separated by a blank line; the last piece may still be arriving.
    const events = buffer.split('\n\n');
    buffer = done ? '' : events.pop()!;
    for (const event of events) {
      for (const line of event.split('\n')) {
        if (line.startsWith('data: ')) onEvent(JSON.parse(line.slice(6)) as TutorStreamEvent);
      }
    }
    if (done) return;
  }
}
