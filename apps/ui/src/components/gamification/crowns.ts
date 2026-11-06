import { TIERS } from './badgeMeta';

export interface Tone {
  dark: string;
  mid: string;
  light: string;
}

// Every place has a crown of its own shape, drawn in RankCrown
export type CrownDesign =
  | 'stars'
  | 'fleur'
  | 'tiara'
  | 'petals'
  | 'imperial'
  | 'radiant'
  | 'balls'
  | 'mural'
  | 'laurel'
  | 'wood';

export interface CrownStyle {
  design: CrownDesign;
  tone: Tone;
  // The gold (or the crown's own material) its band and fittings are made of
  band?: Tone;
}

const GOLD = TIERS[3];

// Leaderboard crowns for places 1 to 10, each grander than the one below it
export const CROWNS: CrownStyle[] = [
  { design: 'stars', tone: { dark: '#24155a', mid: '#5b48d6', light: '#cfc6ff' }, band: GOLD },
  { design: 'fleur', tone: { dark: '#7a0f26', mid: '#d22d4c', light: '#ffb3c1' }, band: GOLD },
  { design: 'tiara', tone: { dark: '#1a347f', mid: '#3a67d8', light: '#b8ccff' }, band: GOLD },
  { design: 'petals', tone: { dark: '#1d6347', mid: '#37a072', light: '#a6ecc8' }, band: GOLD },
  { design: 'imperial', tone: GOLD },
  { design: 'radiant', tone: TIERS[2] },
  { design: 'balls', tone: TIERS[1] },
  { design: 'mural', tone: { dark: '#2e2f34', mid: '#686b74', light: '#a5a9b2' } },
  { design: 'laurel', tone: { dark: '#24582c', mid: '#3f8f4a', light: '#86d083' }, band: GOLD },
  { design: 'wood', tone: { dark: '#4e3218', mid: '#8a5c32', light: '#b98a5a' } },
];
