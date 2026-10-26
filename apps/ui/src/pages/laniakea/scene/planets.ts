/* eslint-disable @typescript-eslint/no-explicit-any */
// The planets: the looks they can wear and how one is built, with the marks
// that tell the student which ones are theirs. Everything random in a planet
// comes from `rand`, seeded by its lesson, so it looks the same on every visit.

export const PLANET_LOOKS = [
  {
    type: 'rocky',
    palette: ['#a04020', '#d96030', '#f08040', '#642010'],
    glow: 0xff8855,
  },
  {
    type: 'rocky',
    palette: ['#6a5040', '#8a6850', '#a08060', '#3a2820'],
    glow: 0xa08070,
  },
  {
    type: 'earthlike',
    palette: ['#1a3a6f', '#2a78c4', '#3aa05f', '#dca555', '#f0e0a8'],
    glow: 0x70a8e0,
  },
  {
    type: 'earthlike',
    palette: ['#1f4a30', '#2d8060', '#46d4a8', '#0a2820', '#80f0c8'],
    glow: 0x66e4be,
  },
  {
    type: 'ocean',
    palette: ['#0a3a6a', '#1a78d0', '#5fb8f0', '#0a1a3a'],
    glow: 0x70b8ff,
  },
  {
    type: 'desert',
    palette: ['#8a6a20', '#d4a060', '#b08040', '#3a2a10'],
    glow: 0xe0b070,
  },
  {
    type: 'gas',
    palette: ['#5a3a8a', '#8a5fd0', '#b088f0', '#3a2060', '#d0a8ff'],
    glow: 0xb088ff,
  },
  {
    type: 'gas',
    palette: ['#3a4a8a', '#5a78d0', '#88a0f0', '#202850'],
    glow: 0x88a0ff,
  },
  {
    type: 'gas',
    palette: ['#8a4030', '#d07050', '#f0a050', '#502010', '#ffc080'],
    glow: 0xff9050,
  },
  {
    type: 'ice',
    palette: ['#a8c8ff', '#dde8f8', '#608ad0', '#ffffff', '#88a8d0'],
    glow: 0xa8c8ff,
  },
  {
    type: 'ice',
    palette: ['#80e0e0', '#b0f0f0', '#48a0a0', '#ffffff'],
    glow: 0x90f0f0,
  },
  {
    type: 'lava',
    palette: ['#3a0a0a', '#8a1a08', '#d04408', '#ff7020', '#1a0000'],
    glow: 0xff5020,
  },
  {
    type: 'rocky',
    palette: ['#404060', '#606080', '#8080a0', '#2a2a40'],
    glow: 0x8080b0,
  },
];

function planetTexture(THREE: any, rand: () => number, palette: string[], type: string) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, 512, 256);
  if (type === 'banded' || type === 'gas') {
    for (let y = 0; y < 256; y += 2) {
      const t = y / 256;
      const noise = Math.sin(t * 24 + rand()) * 0.4 + Math.sin(t * 8) * 0.6;
      const ci = Math.floor(Math.abs(noise) * palette.length) % palette.length;
      ctx.fillStyle = palette[ci];
      ctx.globalAlpha = 0.6 + rand() * 0.4;
      ctx.fillRect(0, y, 512, 2);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = palette[palette.length - 1];
    ctx.beginPath();
    ctx.ellipse(160, 130, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'rocky' || type === 'desert' || type === 'lava') {
    for (let i = 0; i < 700; i++) {
      const r = 2 + rand() * 22;
      ctx.fillStyle = palette[Math.floor(rand() * palette.length)];
      ctx.globalAlpha = 0.4 + rand() * 0.5;
      ctx.beginPath();
      ctx.arc(rand() * 512, rand() * 256, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (type === 'lava') {
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = '#ff5520';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(rand() * 512, rand() * 256, 1 + rand() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  } else if (type === 'earthlike' || type === 'ocean') {
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = palette[1 + (i % (palette.length - 1))];
      ctx.beginPath();
      const cx = rand() * 512,
        cy = rand() * 256;
      for (let a = 0; a < Math.PI * 2; a += 0.3) {
        const rr = 18 + rand() * 50;
        const px = cx + Math.cos(a) * rr,
          py = cy + Math.sin(a) * rr * 0.5;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    for (let i = 0; i < 32; i++) {
      ctx.beginPath();
      ctx.ellipse(rand() * 512, rand() * 256, 8 + rand() * 30, 4 + rand() * 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'ice') {
    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = palette[1 + (i % (palette.length - 1))];
      ctx.globalAlpha = 0.5 + rand() * 0.4;
      ctx.fillRect(rand() * 512, rand() * 256, 4 + rand() * 40, 1 + rand() * 4);
    }
    ctx.strokeStyle = palette[palette.length - 1];
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      let x = rand() * 512,
        y = rand() * 256;
      ctx.moveTo(x, y);
      for (let j = 0; j < 6; j++) {
        x += (rand() - 0.5) * 60;
        y += (rand() - 0.5) * 30;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

function ringTexture(THREE: any, colors: string[]) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 32;
  const ctx = c.getContext('2d')!;
  for (let x = 0; x < 256; x++) {
    const t = x / 256;
    let alpha = 0.7 + Math.sin(t * 40) * 0.25 - Math.pow(Math.sin(t * 8), 12) * 0.7;
    alpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = colors[Math.floor(t * colors.length) % colors.length];
    ctx.globalAlpha = alpha;
    ctx.fillRect(x, 0, 1, 32);
  }
  return new THREE.CanvasTexture(c);
}

export function makePlanet(
  THREE: any,
  look: (typeof PLANET_LOOKS)[number],
  radius: number,
  position: number[],
  rand: () => number,
) {
  const spec = { ...look, radius };
  const group = new THREE.Group();
  group.position.set(...position);

  const tex = planetTexture(THREE, rand, spec.palette, spec.type);
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(spec.radius, 40, 40),
    new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.85,
      metalness: spec.type === 'ocean' ? 0.4 : 0.05,
    }),
  );
  planet.rotation.z = (rand() - 0.5) * 0.5;
  planet.userData.spin = 0.001 + rand() * 0.003;
  group.add(planet);

  const atmMat = new THREE.MeshBasicMaterial({
    color: spec.glow,
    transparent: true,
    opacity: 0.16,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(spec.radius * 1.08, 24, 24), atmMat));

  if (spec.type === 'lava') {
    planet.material.emissive = new THREE.Color(0xff3010);
    planet.material.emissiveIntensity = 0.45;
  }

  if ((spec.type === 'gas' || spec.type === 'banded') && rand() < 0.55) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(spec.radius * 1.55, spec.radius * 2.4, 96),
      new THREE.MeshBasicMaterial({
        map: ringTexture(THREE, spec.palette),
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ring.rotation.x = Math.PI * (0.38 + rand() * 0.18);
    ring.rotation.z = (rand() - 0.5) * 0.5;
    group.add(ring);
  } else if (rand() < 0.18) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(spec.radius * 1.5, spec.radius * 2.2, 96),
      new THREE.MeshBasicMaterial({
        map: ringTexture(THREE, spec.palette),
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ring.rotation.x = Math.PI * 0.42;
    group.add(ring);
  }

  // moons
  const moonCount = rand() < 0.45 ? 0 : rand() < 0.7 ? 1 : rand() < 0.7 ? 2 : 3;
  const moons: any[] = [];
  for (let mi = 0; mi < moonCount; mi++) {
    const moonR = spec.radius * (0.08 + rand() * 0.22);
    const moonDist = spec.radius * (2.2 + mi * 1.2 + rand() * 0.9);
    const moonAngle = rand() * Math.PI * 2;
    const tiltX = (rand() - 0.5) * Math.PI;
    const tiltZ = (rand() - 0.5) * Math.PI * 0.7;
    const orbitPivot = new THREE.Group();
    orbitPivot.rotation.x = tiltX;
    orbitPivot.rotation.z = tiltZ;
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(moonR, 16, 16),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.55 + rand() * 0.3, 0.55 + rand() * 0.3, 0.6 + rand() * 0.3),
        roughness: 0.9,
      }),
    );
    moon.position.set(Math.cos(moonAngle) * moonDist, 0, Math.sin(moonAngle) * moonDist);
    moon.userData.orbit = {
      radius: moonDist,
      angle: moonAngle,
      speed: (rand() < 0.5 ? -1 : 1) * (0.0006 + rand() * 0.0024),
    };
    orbitPivot.add(moon);
    group.add(orbitPivot);
    moons.push(moon);
  }
  planet.userData.moons = moons;

  return { group, planet, moons };
}

// A repeatable stream of numbers in [0, 1) from a seed.
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// How a planet is marked: not at all while out of reach, a faint white ring
// while it can be conquered, a blue ring and glow once it is the student's
// (pulsing while its recap is open), and a gold ring besides once it is theirs
// for good. The glow shows from far away; the map uses the same colours.
export type PlanetMark = 'none' | 'open' | 'owned' | 'recap' | 'forever';

const OWNED_BLUE = 0x4da3ff;
const OPEN_WHITE = 0xdfe6ff;
const FOREVER_GOLD = 0xffcc55;

let glowTexture: any = null;
function glow(THREE: any) {
  if (glowTexture) return glowTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(c);
  return glowTexture;
}

export interface Marks {
  ring: any;
  gold: any;
  halo: any;
  mark: PlanetMark;
}

export function addMarks(THREE: any, group: any, radius: number): Marks {
  const torus = (r: number, color: number) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(r, Math.max(2.5, radius * 0.03), 8, 128),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false }),
    );
    mesh.rotation.x = Math.PI / 2.4;
    mesh.visible = false;
    group.add(mesh);
    return mesh;
  };
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glow(THREE),
      color: OWNED_BLUE,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  halo.scale.set(radius * 7, radius * 7, 1);
  halo.visible = false;
  group.add(halo);
  return {
    ring: torus(radius * 1.9, OWNED_BLUE),
    gold: torus(radius * 2.15, FOREVER_GOLD),
    halo,
    mark: 'none',
  };
}

export function setMark(marks: Marks, mark: PlanetMark): void {
  marks.mark = mark;
  const owned = mark === 'owned' || mark === 'recap' || mark === 'forever';
  marks.ring.visible = mark !== 'none';
  marks.ring.material.color.setHex(owned ? OWNED_BLUE : OPEN_WHITE);
  marks.ring.material.opacity = owned ? 0.85 : 0.35;
  marks.gold.visible = mark === 'forever';
  marks.gold.material.opacity = 0.8;
  marks.halo.visible = mark !== 'none';
  marks.halo.material.color.setHex(owned ? OWNED_BLUE : OPEN_WHITE);
  marks.halo.material.opacity = owned ? 0.55 : 0.18;
}

// Turns the rings slowly and makes an open recap pulse; `dtN` is the frame's
// time in 16 ms steps.
export function animateMarks(marks: Marks, now: number, dtN: number): void {
  if (marks.mark === 'none') return;
  marks.ring.rotation.z += 0.002 * dtN;
  marks.gold.rotation.z -= 0.0015 * dtN;
  if (marks.mark === 'recap') {
    const pulse = 0.5 + 0.5 * Math.sin(now * 0.004);
    marks.ring.material.opacity = 0.45 + 0.5 * pulse;
    marks.halo.material.opacity = 0.3 + 0.45 * pulse;
  }
}
