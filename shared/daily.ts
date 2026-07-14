export type DailyKind = 'lesson' | 'algo';

export interface DailyPickDto {
  kind: DailyKind;
  courseKey: string;
  slug: string;
  title: string;
}

export interface DailyResponse {
  lesson: DailyPickDto | null;
  algo: DailyPickDto | null;
  // Fraction of base XP granted as a bonus for completing a pick on its day
  // (e.g. 0.2 = +20%). Sent so the client can label the reward.
  bonusRatio: number;
}
