import { api } from './apiClient';
import type { LaniakeaState, QuizAnswerResult, QuizView } from '@cyberstars/shared/laniakea';

export function getLaniakea() {
  return api.get<LaniakeaState>('/api/laniakea');
}

// Opens a test on the planet, or picks up the one going on there.
export function startQuiz(slug: string, lang: 'en' | 'ro') {
  return api.post<QuizView>(`/api/laniakea/${slug}/quiz`, { lang });
}

export function answerQuiz(slug: string, index: number, choice: number) {
  return api.post<QuizAnswerResult>(`/api/laniakea/${slug}/quiz/answer`, { index, choice });
}
