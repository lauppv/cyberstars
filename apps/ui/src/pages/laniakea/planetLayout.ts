// Where each planet of the game sits, worked out from the lessons alone, so it
// is the same on every visit and every device. The planets follow a spiral in
// lesson order that climbs as it turns, the first one straight ahead of the
// ship's start, each one a short flight from the one before; the climb keeps
// the later turns clear of the start.

export type Vec3 = [number, number, number];

// How many looks the planet catalogue has (scene/planets.ts).
export const LOOK_COUNT = 13;

// How close to a planet's surface the ship has to be to land on it.
export const REACH = 700;

export interface PlanetSpot {
  slug: string;
  position: Vec3;
  radius: number;
  // Which look of the planet catalogue it wears.
  look: number;
}

// The first planet sits this far ahead of the start, and each one this far
// along the spiral from the one before. The spiral's rings are RING apart.
const FIRST_AHEAD = 1600;
const START_RADIUS = 1800;
const STEP = 1500;
const RING = 1400;
const CLIMB = 240;

// A small stable number from a word, so a lesson always gets the same look.
export function hashOf(word: string): number {
  let h = 2166136261;
  for (let i = 0; i < word.length; i++) {
    h ^= word.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function layoutPlanets(slugs: string[], looks: number): PlanetSpot[] {
  const center: Vec3 = [0, 0, -FIRST_AHEAD - START_RADIUS];
  const growth = RING / (2 * Math.PI);
  let angle = 0;
  return slugs.map((slug, i) => {
    const r = START_RADIUS + growth * angle;
    const h = hashOf(slug);
    const spot: PlanetSpot = {
      slug,
      position: [
        center[0] + r * Math.sin(angle),
        Math.round(i * CLIMB + Math.sin(i * 0.9) * 200),
        center[2] + r * Math.cos(angle),
      ],
      radius: 70 + (h % 130),
      look: h % looks,
    };
    angle += STEP / r;
    return spot;
  });
}
