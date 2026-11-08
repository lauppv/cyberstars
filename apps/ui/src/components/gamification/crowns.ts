export interface Tone {
  dark: string;
  mid: string;
  light: string;
}

// The outlines every crown is drawn from: low with three points (10), five points (9 to 6),
// five points with a tall middle spire (5 and 4), and closed under a velvet dome (3 to 1)
export type CrownShape = 'low' | 'open' | 'spire' | 'closed';

export interface CrownStyle {
  metal: Tone;
  shape: CrownShape;
  // The band filled with violet instead of metal
  violetBand?: boolean;
  // A big violet ball on every point
  violetTips?: boolean;
  crest?: 'orb' | 'star';
  ermine?: boolean;
  aura?: 'gold' | 'stars';
}

// Metals darkened at the edges so they still read apart at 24 px
const BRONZE: Tone = { dark: '#5e3519', mid: '#b0683a', light: '#e3a877' };
const SILVER: Tone = { dark: '#555b66', mid: '#b2b8c2', light: '#eef0f4' };
const GOLD: Tone = { dark: '#8a5c08', mid: '#e8b23a', light: '#fff0b3' };

// The brand violet of every stone and the band, and the darker one of the velvet
export const VIOLET: Tone = { dark: '#3a2da0', mid: '#6c5ce7', light: '#b7aefc' };
export const VELVET: Tone = { dark: '#211760', mid: '#3d2f9e', light: '#6c5ce7' };

// Leaderboard crowns for places 1 to 10. Read from the bottom up, each is the one below it
// with a single change, and within one metal every change is a new outline or a big patch of
// violet, so two crowns of the same metal still tell apart at the crown's real size.
export const CROWNS: CrownStyle[] = [
  // 1: the brand star instead of the orb, a violet aura with gold rays
  {
    metal: GOLD,
    shape: 'closed',
    violetBand: true,
    violetTips: true,
    crest: 'star',
    ermine: true,
    aura: 'stars',
  },
  // 2: white ermine under the band and a gold aura
  {
    metal: GOLD,
    shape: 'closed',
    violetBand: true,
    violetTips: true,
    crest: 'orb',
    ermine: true,
    aura: 'gold',
  },
  // 3: closes under a violet velvet dome with an orb on top
  { metal: GOLD, shape: 'closed', violetBand: true, violetTips: true, crest: 'orb' },
  // 4: gold
  { metal: GOLD, shape: 'spire', violetBand: true, violetTips: true },
  // 5: a tall middle spire with a big violet stone
  { metal: SILVER, shape: 'spire', violetBand: true, violetTips: true },
  // 6: violet balls on the points
  { metal: SILVER, shape: 'open', violetBand: true, violetTips: true },
  // 7: silver
  { metal: SILVER, shape: 'open', violetBand: true },
  // 8: the band turns violet
  { metal: BRONZE, shape: 'open', violetBand: true },
  // 9: five points, taller
  { metal: BRONZE, shape: 'open' },
  // 10: a low bronze circlet with three points
  { metal: BRONZE, shape: 'low' },
];
