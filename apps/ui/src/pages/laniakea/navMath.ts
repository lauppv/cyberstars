import type { Vec3 } from './planetLayout';

// The ship's whereabouts as the overlays need them: where it is and its
// rotation as a quaternion [x, y, z, w]. The nose points down -z in the ship's
// own frame, right is +x and up is +y.
export interface ShipPose {
  position: Vec3;
  quaternion: [number, number, number, number];
}

// The rotation as a matrix, rows first.
function matrixOf([x, y, z, w]: ShipPose['quaternion']): number[][] {
  return [
    [1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y)],
    [2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x)],
    [2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)],
  ];
}

// A world vector in the ship's own frame: the rotation undone, which for a
// rotation matrix is its transpose.
function intoShip(v: Vec3, q: ShipPose['quaternion']): Vec3 {
  const m = matrixOf(q);
  return [0, 1, 2].map((c) => m[0][c] * v[0] + m[1][c] * v[1] + m[2][c] * v[2]) as Vec3;
}

const DEG = 180 / Math.PI;

// Where a point lies from the ship: how far, and the turn (right positive) and
// climb (up positive) in degrees that would bring the nose onto it.
export function bearingTo(
  pose: ShipPose,
  point: Vec3,
): { distance: number; turn: number; climb: number } {
  const [x, y, z] = intoShip(
    [point[0] - pose.position[0], point[1] - pose.position[1], point[2] - pose.position[2]],
    pose.quaternion,
  );
  return {
    distance: Math.hypot(x, y, z),
    turn: Math.atan2(x, -z) * DEG,
    climb: Math.atan2(y, Math.hypot(x, z)) * DEG,
  };
}

// The way the nose points seen from above, in radians from -z towards +x.
export function headingOf(pose: ShipPose): number {
  const m = matrixOf(pose.quaternion);
  // the nose is the third column turned around
  return Math.atan2(-m[0][2], m[2][2]);
}

// A point on the map seen from above: the ship in the middle with its nose up,
// `range` world units to the rim and `size` pixels across. A point past the rim
// is held on it.
export function mapPoint(
  pose: ShipPose,
  heading: number,
  point: Vec3,
  range: number,
  size: number,
): { x: number; y: number; outside: boolean } {
  const dx = point[0] - pose.position[0];
  const dz = point[2] - pose.position[2];
  const ahead = dx * Math.sin(heading) - dz * Math.cos(heading);
  const right = dx * Math.cos(heading) + dz * Math.sin(heading);
  const len = Math.hypot(ahead, right);
  const outside = len > range;
  const k = outside ? range / len : 1;
  const scale = size / 2 / range;
  return { x: size / 2 + right * k * scale, y: size / 2 - ahead * k * scale, outside };
}
