export interface Tone {
  dark: string;
  mid: string;
  light: string;
}

// The outlines every crown is drawn from, from the plainest circlet up to the seven-spiked
// royal crown. Every step up only grows the outline: more points, or a taller middle spire,
// so no crown ever takes away what the one below it has.
export type CrownShape = 'circlet' | 'arc' | 'spire' | 'royal';

export interface CrownStyle {
  metal: Tone;
  shape: CrownShape;
  // The band filled with violet instead of metal
  violetBand?: boolean;
  // A violet ball on every point (the middle spire wears a bigger stone instead)
  violetTips?: boolean;
  // The orb on the left and the sceptre on the right, beside the crown
  regalia?: boolean;
  // Place 1 only: the brand star on the middle spike, with short rays and a violet halo
  coronation?: boolean;
}

// Metals darkened at the edges so they still read apart at 28 px
const BRONZE: Tone = { dark: '#5e3519', mid: '#b0683a', light: '#e3a877' };
const SILVER: Tone = { dark: '#555b66', mid: '#b2b8c2', light: '#eef0f4' };
const GOLD: Tone = { dark: '#8a5c08', mid: '#e8b23a', light: '#fff0b3' };

// The brand violet of every stone and the band
export const VIOLET: Tone = { dark: '#3a2da0', mid: '#6c5ce7', light: '#b7aefc' };

// Leaderboard crowns for places 1 to 10. Read from the bottom up, each is the one below it
// with a single change: a richer outline, a violet band, a new metal, violet stones, the
// regalia, and finally the coronation. Within one metal every crown still tells apart from
// its neighbours at the crown's real size (28-34 px).
export const CROWNS: CrownStyle[] = [
  // 1: the brand star on the middle spike, rays around it and a violet halo behind
  {
    metal: GOLD,
    shape: 'royal',
    violetBand: true,
    violetTips: true,
    regalia: true,
    coronation: true,
  },
  // 2: the orb and the sceptre beside it
  { metal: GOLD, shape: 'royal', violetBand: true, violetTips: true, regalia: true },
  // 3: seven sharp spikes round the middle one
  { metal: GOLD, shape: 'royal', violetBand: true, violetTips: true },
  // 4: gold
  { metal: GOLD, shape: 'spire', violetBand: true, violetTips: true },
  // 5: a tall middle spire wearing a big violet stone
  { metal: SILVER, shape: 'spire', violetBand: true, violetTips: true },
  // 6: violet balls on the points
  { metal: SILVER, shape: 'arc', violetBand: true, violetTips: true },
  // 7: silver
  { metal: SILVER, shape: 'arc', violetBand: true },
  // 8: the band turns violet
  { metal: BRONZE, shape: 'arc', violetBand: true },
  // 9: five rounded points instead of three
  { metal: BRONZE, shape: 'arc' },
  // 10: a low bronze circlet with three points
  { metal: BRONZE, shape: 'circlet' },
];
