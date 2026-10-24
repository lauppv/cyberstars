/* eslint-disable @typescript-eslint/no-explicit-any */
// The sky behind the planets: nebulae, the far stars, the Milky Way's band and
// its dust, and a field of nearer stars. The far sky and the band follow the
// ship, so they never come closer.
export function addBackdrop(THREE: any, scene: any) {
  // ===== Nebulae =====
  function nebulaTex(color: string) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, color + 'cc');
    g.addColorStop(0.4, color + '44');
    g.addColorStop(1, color + '00');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }
  const nebPalette = ['#6c5ce7', '#ff6b6b', '#00d68f', '#3b6bff', '#ff8aff', '#ffa040'];
  for (let i = 0; i < 60; i++) {
    const tex = nebulaTex(nebPalette[i % nebPalette.length]);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.12 + Math.random() * 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const s = new THREE.Sprite(mat);
    const r = 4000 + Math.random() * 22000;
    const theta = Math.random() * Math.PI * 2;
    const yJit = (Math.random() - 0.5) * 4000;
    s.position.set(Math.cos(theta) * r, yJit, Math.sin(theta) * r);
    const sc = 800 + Math.random() * 1800;
    s.scale.set(sc, sc, 1);
    scene.add(s);
  }

  // ===== Sky stars =====
  const SKY_STAR_COUNT = 9000;
  const SKY_R = 8000;
  const skyGeo = new THREE.BufferGeometry();
  const skyPos = new Float32Array(SKY_STAR_COUNT * 3);
  const skyCol = new Float32Array(SKY_STAR_COUNT * 3);
  const starColors = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xcfd9ff),
    new THREE.Color(0xffd1a1),
    new THREE.Color(0xa8c4ff),
    new THREE.Color(0xe8b8ff),
    new THREE.Color(0xfff0a0),
  ];
  for (let i = 0; i < SKY_STAR_COUNT; i++) {
    const u = Math.random(),
      v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = SKY_R * (0.85 + Math.random() * 0.3);
    skyPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    skyPos[i * 3 + 1] = r * Math.cos(phi);
    skyPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const col = starColors[Math.floor(Math.random() * starColors.length)];
    skyCol[i * 3] = col.r;
    skyCol[i * 3 + 1] = col.g;
    skyCol[i * 3 + 2] = col.b;
  }
  skyGeo.setAttribute('position', new THREE.BufferAttribute(skyPos, 3));
  skyGeo.setAttribute('color', new THREE.BufferAttribute(skyCol, 3));
  const skyMat = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const skyStars = new THREE.Points(skyGeo, skyMat);
  scene.add(skyStars);

  // ===== Milky Way band =====
  const milkyGroup = new THREE.Group();
  milkyGroup.rotation.set(0.45, 0.7, 0.3);
  scene.add(milkyGroup);

  const MW_STAR_COUNT = 8000;
  const mwGeo = new THREE.BufferGeometry();
  const mwPos = new Float32Array(MW_STAR_COUNT * 3);
  const mwCol = new Float32Array(MW_STAR_COUNT * 3);
  for (let i = 0; i < MW_STAR_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    let lat = 0;
    for (let k = 0; k < 4; k++) lat += Math.random() - 0.5;
    lat *= 0.085;
    const r = SKY_R * (0.95 + Math.random() * 0.1);
    mwPos[i * 3] = r * Math.cos(lat) * Math.cos(theta);
    mwPos[i * 3 + 1] = r * Math.sin(lat);
    mwPos[i * 3 + 2] = r * Math.cos(lat) * Math.sin(theta);
    const warm = Math.random();
    if (warm < 0.5) {
      mwCol[i * 3] = 1.0;
      mwCol[i * 3 + 1] = 0.96;
      mwCol[i * 3 + 2] = 0.86;
    } else if (warm < 0.8) {
      mwCol[i * 3] = 0.9;
      mwCol[i * 3 + 1] = 0.88;
      mwCol[i * 3 + 2] = 1.0;
    } else {
      mwCol[i * 3] = 1.0;
      mwCol[i * 3 + 1] = 0.85;
      mwCol[i * 3 + 2] = 0.65;
    }
  }
  mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
  mwGeo.setAttribute('color', new THREE.BufferAttribute(mwCol, 3));
  const mwMat = new THREE.PointsMaterial({
    size: 7,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  milkyGroup.add(new THREE.Points(mwGeo, mwMat));

  function dustTex(tint: string) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, tint + 'b0');
    g.addColorStop(0.45, tint + '55');
    g.addColorStop(1, tint + '00');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const mwTints = ['#fff0c8', '#f0e0a8', '#ffd0a0', '#e8c4ff', '#a0b8ff', '#ffb898'];
  function darkDustTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(8,4,16,0.85)');
    g.addColorStop(0.5, 'rgba(8,4,16,0.4)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  for (let i = 0; i < 110; i++) {
    const theta = Math.random() * Math.PI * 2;
    let lat = 0;
    for (let k = 0; k < 4; k++) lat += Math.random() - 0.5;
    lat *= 0.075;
    const r = SKY_R * 0.92;
    const tint = mwTints[Math.floor(Math.random() * mwTints.length)];
    const mat = new THREE.SpriteMaterial({
      map: dustTex(tint),
      transparent: true,
      opacity: 0.16 + Math.random() * 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const s = new THREE.Sprite(mat);
    s.position.set(
      r * Math.cos(lat) * Math.cos(theta),
      r * Math.sin(lat),
      r * Math.cos(lat) * Math.sin(theta),
    );
    const sc = 600 + Math.random() * 1600;
    s.scale.set(sc, sc * 0.55, 1);
    milkyGroup.add(s);
  }
  const darkTex = darkDustTex();
  for (let i = 0; i < 35; i++) {
    const theta = Math.random() * Math.PI * 2;
    const lat = (Math.random() - 0.5) * 0.025;
    const r = SKY_R * 0.93;
    const mat = new THREE.SpriteMaterial({
      map: darkTex,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const s = new THREE.Sprite(mat);
    s.position.set(
      r * Math.cos(lat) * Math.cos(theta),
      r * Math.sin(lat),
      r * Math.cos(lat) * Math.sin(theta),
    );
    const sc = 800 + Math.random() * 1400;
    s.scale.set(sc, sc * 0.35, 1);
    milkyGroup.add(s);
  }

  // Mid-distance stars
  const MID_STAR_COUNT = 5000;
  const midGeo = new THREE.BufferGeometry();
  const midPos = new Float32Array(MID_STAR_COUNT * 3);
  const midCol = new Float32Array(MID_STAR_COUNT * 3);
  for (let i = 0; i < MID_STAR_COUNT; i++) {
    midPos[i * 3] = (Math.random() - 0.5) * 50000;
    midPos[i * 3 + 1] = (Math.random() - 0.5) * 20000;
    midPos[i * 3 + 2] = (Math.random() - 0.5) * 50000;
    const col = starColors[Math.floor(Math.random() * starColors.length)];
    midCol[i * 3] = col.r;
    midCol[i * 3 + 1] = col.g;
    midCol[i * 3 + 2] = col.b;
  }
  midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
  midGeo.setAttribute('color', new THREE.BufferAttribute(midCol, 3));
  scene.add(
    new THREE.Points(
      midGeo,
      new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    ),
  );

  return { skyStars, milkyGroup };
}
