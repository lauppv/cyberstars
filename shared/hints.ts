// AI-hint contract shared by client and server. Hints are progressive: each
// higher level reveals a little more (nudge -> concept -> pseudocode) but never
// the full solution — that lives behind the separate "Show Solution" button.
export const MAX_HINT_LEVEL = 3;

export type HintLevel = 1 | 2 | 3;

export interface HintRequest {
  code: string;
  level: HintLevel;
  lang: 'en' | 'ro';
}

export interface HintResponse {
  hint: string;
  level: HintLevel;
  maxLevel: number;
}
