import { api } from './apiClient';
import type { HintLevel, HintResponse } from '@cyberstars/shared/hints';

export function getHint(
  courseKey: string,
  lessonSlug: string,
  code: string,
  level: HintLevel,
  lang: 'en' | 'ro',
): Promise<HintResponse> {
  return api.post<HintResponse>(`/api/hints/${courseKey}/${lessonSlug}`, { code, level, lang });
}
