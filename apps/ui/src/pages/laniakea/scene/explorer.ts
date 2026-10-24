/* eslint-disable @typescript-eslint/no-explicit-any */
import { addBackdrop } from './backdrop';
import { addWonders } from './wonders';
import { attachControls, type TouchParts } from './controls';
import {
  PLANET_LOOKS,
  addMarks,
  animateMarks,
  makePlanet,
  seededRandom,
  setMark,
  type Marks,
  type PlanetMark,
} from './planets';
import { REACH, hashOf, type PlanetSpot } from '../planetLayout';
import type { ShipPose } from '../navMath';

// The planet the nose points at, how far its surface is, and whether the ship
// is close enough to land on it.
export interface Aim {
  slug: string;
  distance: number;
  inReach: boolean;
}

export interface ExplorerEvents {
  onAim: (aim: Aim | null) => void;
  // About ten times a second, for the map and the readouts.
  onPose: (pose: ShipPose, speed: number) => void;
}

export interface Explorer {
  setMarks: (marks: Record<string, PlanetMark>) => void;
  // The planet the arrow points to, or none.
  setTarget: (slug: string | null) => void;
  // Off while the intro, the pause or a test is up: the ship drifts to a stop.
  setActive: (active: boolean) => void;
  dispose: () => void;
}

// A planet counts as aimed at within this many radians of the nose, past the
// edge it shows.
const AIM_CONE = 0.12;

const MAX_SPEED = 5;
const BOOST = 3;
const MAX_YAW_RATE = 2.4;
const MAX_PITCH_RATE = 1.6;
const KEY_YAW_RATE = MAX_YAW_RATE * 0.3;
const KEY_PITCH_RATE = MAX_PITCH_RATE * 0.3;
const STICK_YAW = MAX_YAW_RATE * 0.4;
const STICK_PITCH = MAX_PITCH_RATE * 0.4;
const ROT_TAU = 0.7;
const ACCEL_TAU = 1.6;
const DECEL_TAU = 2.5;

interface PlanetObject {
  slug: string;
  group: any;
  planet: any;
  moons: any[];
  radius: number;
  marks: Marks;
}

// The arrow that floats low in front of the ship and points to the target, as
// in GTA: a flat chevron lying in the ship's plane, so it reads as an arrow
// whichever way it turns. It is drawn over everything so no planet hides it.
function makeArrow(THREE: any) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 6.5);
  shape.lineTo(5, -3.5);
  shape.lineTo(0, -1);
  shape.lineTo(-5, -3.5);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1.6, bevelEnabled: false });
  // the shape's tip (+y) becomes the arrow's front (+z), which lookAt aims
  geometry.rotateX(Math.PI / 2);
  const arrow = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xa79bff,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
      depthWrite: false,
    }),
  );
  arrow.renderOrder = 999;
  arrow.visible = false;
  return arrow;
}

export function createExplorer(
  THREE: any,
  mount: HTMLElement,
  spots: PlanetSpot[],
  touch: TouchParts | null,
  events: ExplorerEvents,
): Explorer {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05050d, 0.00006);

  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 60000);
  camera.position.set(0, 0, 0);
  camera.rotation.order = 'YXZ';

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x05050d, 1);
  mount.appendChild(renderer.domElement);

  const { skyStars, milkyGroup } = addBackdrop(THREE, scene);

  const placed: any[] = [];
  const planets: PlanetObject[] = spots.map((spot) => {
    const made = makePlanet(
      THREE,
      PLANET_LOOKS[spot.look % PLANET_LOOKS.length],
      spot.radius,
      spot.position,
      seededRandom(hashOf(spot.slug)),
    );
    scene.add(made.group);
    placed.push(new THREE.Vector3(...spot.position));
    return {
      slug: spot.slug,
      ...made,
      radius: spot.radius,
      marks: addMarks(THREE, made.group, spot.radius),
    };
  });
  const bySlug = new Map(planets.map((p) => [p.slug, p]));

  const wonders = addWonders(THREE, scene, camera, placed);
  const arrow = makeArrow(THREE);
  scene.add(arrow);

  const controls = attachControls(touch);
  let target: PlanetObject | null = null;

  const onResize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };
  window.addEventListener('resize', onResize);

  const fwd = new THREE.Vector3();
  const up = new THREE.Vector3();
  const toPlanet = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  const targetVel = new THREE.Vector3();
  let yawRate = 0;
  let pitchRate = 0;
  let lastT = performance.now();
  let lastPose = 0;
  let frame = 0;
  let rafId = 0;
  let destroyed = false;

  function aimNow(): Aim | null {
    let best: PlanetObject | null = null;
    let bestScore = AIM_CONE;
    let bestD = 0;
    for (const p of planets) {
      toPlanet.subVectors(p.group.position, camera.position);
      const d = toPlanet.length();
      if (d < 1e-3) continue;
      const angle = Math.acos(Math.max(-1, Math.min(1, toPlanet.dot(fwd) / d)));
      const score = angle - Math.asin(Math.min(1, p.radius / d));
      if (score < bestScore) {
        bestScore = score;
        best = p;
        bestD = d;
      }
    }
    if (!best) return null;
    const distance = Math.max(0, bestD - best.radius);
    return { slug: best.slug, distance, inReach: distance < REACH };
  }

  // A ship that flies at a planet stops outside its rings instead of passing
  // through it, so the planet never fills the whole view.
  function keepOutside() {
    for (const p of planets) {
      toPlanet.subVectors(camera.position, p.group.position);
      const d = toPlanet.length();
      const min = p.radius * 2.6;
      if (d < min) {
        camera.position.copy(p.group.position).addScaledVector(toPlanet.normalize(), min);
        velocity.multiplyScalar(0.2);
      }
    }
  }

  function updateArrow() {
    if (!target) {
      arrow.visible = false;
      return;
    }
    toPlanet.subVectors(target.group.position, camera.position);
    if (toPlanet.length() - target.radius < REACH) {
      arrow.visible = false;
      return;
    }
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    arrow.position.copy(camera.position).addScaledVector(fwd, 55).addScaledVector(up, -19);
    arrow.lookAt(target.group.position);
    arrow.visible = true;
  }

  function animate(now: number) {
    if (destroyed) return;
    rafId = requestAnimationFrame(animate);
    const dt = Math.min(50, now - lastT);
    lastT = now;
    const dtN = dt / 16;
    const dtSec = dt / 1000;
    const c = controls.state;

    let yawIn = c.stickYaw * STICK_YAW;
    let pitchIn = c.stickPitch * STICK_PITCH;
    if (c.left) yawIn += KEY_YAW_RATE;
    if (c.right) yawIn -= KEY_YAW_RATE;
    if (c.up) pitchIn += KEY_PITCH_RATE;
    if (c.down) pitchIn -= KEY_PITCH_RATE;
    const rotK = 1 - Math.exp(-dtSec / ROT_TAU);
    yawRate += (yawIn - yawRate) * rotK;
    pitchRate += (pitchIn - pitchRate) * rotK;
    camera.rotateY(yawRate * dtSec);
    camera.rotateX(pitchRate * dtSec);
    fwd.set(0, 0, -1).applyQuaternion(camera.quaternion);

    const dir = (c.forward ? 1 : 0) - (c.back ? 1 : 0);
    targetVel.set(0, 0, 0);
    if (dir !== 0) targetVel.addScaledVector(fwd, dir * MAX_SPEED * (c.boost ? BOOST : 1));
    velocity.lerp(targetVel, 1 - Math.exp(-dtSec / (dir !== 0 ? ACCEL_TAU : DECEL_TAU)));
    if (velocity.lengthSq() > 1e-6) camera.position.addScaledVector(velocity, dtN);
    keepOutside();

    skyStars.position.copy(camera.position);
    milkyGroup.position.copy(camera.position);
    const galaxySpin = now * 0.0000015;
    skyStars.rotation.y = galaxySpin;
    milkyGroup.rotation.y = galaxySpin;

    for (const p of planets) {
      p.planet.rotation.y += p.planet.userData.spin;
      for (const moon of p.moons) {
        const o = moon.userData.orbit;
        o.angle += o.speed;
        moon.position.x = Math.cos(o.angle) * o.radius;
        moon.position.z = Math.sin(o.angle) * o.radius;
      }
      animateMarks(p.marks, now);
    }
    wonders.update(now, dt, dtSec);
    updateArrow();

    if (frame++ % 6 === 0) events.onAim(aimNow());
    if (now - lastPose >= 100) {
      lastPose = now;
      const q = camera.quaternion;
      events.onPose(
        {
          position: [camera.position.x, camera.position.y, camera.position.z],
          quaternion: [q.x, q.y, q.z, q.w],
        },
        velocity.length(),
      );
    }

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  return {
    setMarks(marks) {
      for (const p of planets) {
        const mark = marks[p.slug] ?? 'none';
        if (mark !== p.marks.mark) setMark(p.marks, mark);
      }
    },
    setTarget(slug) {
      target = slug ? (bySlug.get(slug) ?? null) : null;
    },
    setActive(active) {
      controls.setActive(active);
    },
    dispose() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      controls.dispose();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
    },
  };
}
