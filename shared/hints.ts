// AI-hint contract shared by client and server. Hints are progressive: each
// higher level reveals a little more (nudge -> concept -> pseudocode) but never
// the full solution — that lives behind the separate "Show Solution" button.
export const MAX_HINT_LEVEL = 3;

export type HintLevel = 1 | 2 | 3;

import type { UsageSummary } from './usage.js';

export interface HintResponse {
  hint: string;
  level: HintLevel;
  maxLevel: number;
  // Refreshed daily usage after this hint was consumed, so the UI can update its
  // meter without a second request.
  usage: UsageSummary;
}
