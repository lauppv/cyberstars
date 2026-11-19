export interface Tone {
  dark: string;
  mid: string;
  light: string;
}

// The outlines every crown is drawn from: low with three points (10), five points (9 to 7),
// five points with a tall middle spire (6), and seven sharp spikes round a middle spire (5 to 1)
export type CrownShape = 'low' | 'open' | 'spire' | 'spiky';

export interface CrownStyle {
  metal: Tone;
  shape: CrownShape;
  // The band filled with violet instead of metal
  violetBand?: boolean;
  // A big violet ball on every point
  violetTips?: boolean;
  // A violet velvet cap inside the crown, showing between the points
  cap?: boolean;
  // The orb on the left and the sceptre on the right, beside the crown
  regalia?: boolean;
  crest?: 'star';
  // A gold glow with gold rays, or a violet glow with gold rays
  aura?: 'rays' | 'stars';
}

// Metals darkened at the edges so they still read apart at 24 px
const BRONZE: Tone = { dark: '#5e3519', mid: '#b0683a', light: '#e3a877' };
const SILVER: Tone = { dark: '#555b66', mid: '#b2b8c2', light: '#eef0f4' };
const GOLD: Tone = { dark: '#8a5c08', mid: '#e8b23a', light: '#fff0b3' };

// The brand violet of every stone and the band
export const VIOLET: Tone = { dark: '#3a2da0', mid: '#6c5ce7', light: '#b7aefc' };

// Leaderboard crowns for places 1 to 10. Read from the bottom up, each is the one below it
// with one or two changes, and within one metal every change is a new outline or a big patch of
// violet, so two crowns of the same metal still tell apart at the crown's real size.
export const CROWNS: CrownStyle[] = [
  // 1: the orb and the sceptre, the brand star on the middle spike
  {
    metal: GOLD,
    shape: 'spiky',
    violetBand: true,
    violetTips: true,
    cap: true,
    regalia: true,
    crest: 'star',
    aura: 'stars',
  },
  // 2: the aura turns violet
  { metal: GOLD, shape: 'spiky', violetBand: true, violetTips: true, cap: true, aura: 'stars' },
  // 3: a gold aura with gold rays behind
  { metal: GOLD, shape: 'spiky', violetBand: true, violetTips: true, cap: true, aura: 'rays' },
  // 4: gold
  { metal: GOLD, shape: 'spiky', violetBand: true, violetTips: true, cap: true },
  // 5: seven sharp spikes and stones on the band
  { metal: SILVER, shape: 'spiky', violetBand: true, violetTips: true, cap: true },
  // 6: a tall middle spire with a big violet stone, and the violet cap inside
  { metal: SILVER, shape: 'spire', violetBand: true, violetTips: true, cap: true },
  // 7: silver
  { metal: SILVER, shape: 'open', violetBand: true, violetTips: true },
  // 8: the band and the balls on the points turn violet together
  { metal: BRONZE, shape: 'open', violetBand: true, violetTips: true },
  // 9: five points, taller
  { metal: BRONZE, shape: 'open' },
  // 10: a low bronze circlet with three points
  { metal: BRONZE, shape: 'low' },
];
