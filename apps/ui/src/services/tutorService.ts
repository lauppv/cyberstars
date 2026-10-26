import { api, errorOf, send } from './apiClient';
import type {
  TutorConversationPage,
  TutorConversationSummary,
  TutorLessonRef,
  TutorLessonWork,
  TutorStreamEvent,
} from '@cyberstars/shared/tutor';

const API_BASE = import.meta.env.VITE_PROD_API_URL || '';

// The student's conversations, the one saved to last first.
export function listConversations(): Promise<TutorConversationSummary[]> {
  return api.get<TutorConversationSummary[]>('/api/tutor/conversations');
}

export function getConversation(id: number, before?: number): Promise<TutorConversationPage> {
  const query = before === undefined ? '' : `?before=${before}`;
  return api.get<TutorConversationPage>(`/api/tutor/conversations/${id}${query}`);
}

export function deleteConversation(id: number): Promise<void> {
  return api.delete<void>(`/api/tutor/conversations/${id}`);
}

export interface TutorChatRequest {
  message: string;
  page: string;
  lang: 'en' | 'ro';
  // A message about a lesson comes with the student's work on it.
  lesson?: TutorLessonRef;
  // The conversation it continues; without one it starts a new one.
  conversationId?: number;
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
  const res = await send(`${API_BASE}/api/tutor/chat`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) throw await errorOf(res);

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
