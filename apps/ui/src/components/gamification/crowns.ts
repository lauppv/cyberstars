import { TIERS } from './badgeMeta';

export interface Tone {
  dark: string;
  mid: string;
  light: string;
}

// plain: three points, matte; metal: five with balls; crystal: five faceted with gems;
// star: seven under the brand star; laurel: a wreath of leaves
export type CrownKind = 'plain' | 'laurel' | 'metal' | 'crystal' | 'star';

export interface CrownStyle {
  kind: CrownKind;
  tone: Tone;
  band?: Tone;
  gems?: string[];
  grain?: boolean;
  rivets?: boolean;
}

const GOLD = TIERS[3];

// Leaderboard crowns for places 1 to 10, each a step grander than the one below it
export const CROWNS: CrownStyle[] = [
  { kind: 'star', tone: { dark: '#24155a', mid: '#5b48d6', light: '#cfc6ff' }, band: GOLD },
  { kind: 'crystal', tone: { dark: '#7a0f26', mid: '#d22d4c', light: '#ffb3c1' }, band: GOLD },
  { kind: 'crystal', tone: { dark: '#1a347f', mid: '#3a67d8', light: '#b8ccff' }, band: GOLD },
  { kind: 'crystal', tone: { dark: '#1d6347', mid: '#37a072', light: '#a6ecc8' }, band: GOLD },
  { kind: 'metal', tone: GOLD, gems: ['#3a67d8', '#d22d4c', '#3a67d8'] },
  { kind: 'metal', tone: TIERS[2] },
  { kind: 'metal', tone: TIERS[1] },
  { kind: 'plain', tone: { dark: '#2e2f34', mid: '#686b74', light: '#a5a9b2' }, rivets: true },
  { kind: 'laurel', tone: { dark: '#24582c', mid: '#3f8f4a', light: '#86d083' }, band: GOLD },
  { kind: 'plain', tone: { dark: '#4e3218', mid: '#8a5c32', light: '#b98a5a' }, grain: true },
];
