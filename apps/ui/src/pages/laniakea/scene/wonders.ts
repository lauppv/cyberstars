/* eslint-disable @typescript-eslint/no-explicit-any */
// The sights around the planets: black holes, quasars, Dyson spheres, ships
// flying their rounds and shooting stars, with the lights of the scene. Each is
// placed clear of what is already in `placedPositions`.
export function addWonders(THREE: any, scene: any, camera: any, placedPositions: any[]) {
  // ===== Black holes =====
  const blackHoles: any[] = [];
  function makeBlackHole(position: number[], scale = 1) {
    const grp = new THREE.Group();
    grp.position.set(...position);
    grp.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(70 * scale, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0x000000 }),
      ),
    );

    const dc = document.createElement('canvas');
    dc.width = dc.height = 512;
    const dctx = dc.getContext('2d')!;
    const g = dctx.createRadialGradient(256, 256, 80, 256, 256, 256);
    g.addColorStop(0, 'rgba(255,250,200,0)');
    g.addColorStop(0.18, 'rgba(255,240,150,1)');
    g.addColorStop(0.32, 'rgba(255,180,80,1)');
    g.addColorStop(0.55, 'rgba(220,80,40,.85)');
    g.addColorStop(0.78, 'rgba(140,40,120,.45)');
    g.addColorStop(1, 'rgba(60,20,80,0)');
    dctx.fillStyle = g;
    dctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 200; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 100 + Math.random() * 140;
      dctx.fillStyle = 'rgba(255,220,160,' + Math.random() * 0.4 + ')';
      dctx.beginPath();
      dctx.arc(256 + Math.cos(a) * d, 256 + Math.sin(a) * d, 2 + Math.random() * 4, 0, Math.PI * 2);
      dctx.fill();
    }
    const diskTex = new THREE.CanvasTexture(dc);
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(75 * scale, 280 * scale, 96),
      new THREE.MeshBasicMaterial({
        map: diskTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    disk.rotation.x = Math.PI * 0.42;
    disk.rotation.z = Math.random() - 0.5;
    disk.userData.spin = 0.002 + Math.random() * 0.002;
    grp.add(disk);

    const photon = new THREE.Mesh(
      new THREE.RingGeometry(74 * scale, 79 * scale, 96),
      new THREE.MeshBasicMaterial({
        color: 0xffe8a8,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    grp.add(photon);

    const hc = document.createElement('canvas');
    hc.width = hc.height = 256;
    const hctx = hc.getContext('2d')!;
    const hg = hctx.createRadialGradient(128, 128, 30, 128, 128, 128);
    hg.addColorStop(0, 'rgba(255,180,80,0)');
    hg.addColorStop(0.35, 'rgba(255,200,120,.5)');
    hg.addColorStop(0.6, 'rgba(140,40,120,.2)');
    hg.addColorStop(1, 'rgba(0,0,0,0)');
    hctx.fillStyle = hg;
    hctx.fillRect(0, 0, 256, 256);
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(hc),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    halo.scale.set(800 * scale, 800 * scale, 1);
    grp.add(halo);

    scene.add(grp);
    blackHoles.push({
      group: grp,
      disk,
      photon,
      halo,
      scale,
      position: new THREE.Vector3(...position),
    });
    placedPositions.push(new THREE.Vector3(...position));
  }
  // Out past the planets, so none sits inside its disk
  makeBlackHole([-11500, 600, -9500], 1.0);
  makeBlackHole([12000, -800, 6000], 1.4);
  makeBlackHole([-8500, 200, 14000], 0.7);
  makeBlackHole([18000, 1200, -16000], 1.1);
  makeBlackHole([-22000, -1500, -8000], 0.85);

  // ===== Quasars (bipolar jets) =====
  const quasars: any[] = [];
  function makeJetTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 1024;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 1024, 0, 0);
    g.addColorStop(0, 'rgba(255,240,200,1)');
    g.addColorStop(0.06, 'rgba(255,200,140,1)');
    g.addColorStop(0.2, 'rgba(200,130,255,.85)');
    g.addColorStop(0.55, 'rgba(140,80,220,.4)');
    g.addColorStop(0.85, 'rgba(80,40,160,.12)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 1024);
    const h = ctx.createLinearGradient(0, 0, 64, 0);
    h.addColorStop(0, 'rgba(0,0,0,0)');
    h.addColorStop(0.5, 'rgba(0,0,0,1)');
    h.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = h;
    ctx.fillRect(0, 0, 64, 1024);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) {
      const y = 100 + Math.random() * 700;
      const rad = 8 + Math.random() * 16;
      const kg = ctx.createRadialGradient(32, y, 0, 32, y, rad);
      const a = 0.5 + Math.random() * 0.4;
      kg.addColorStop(0, 'rgba(255,230,200,' + a + ')');
      kg.addColorStop(1, 'rgba(255,230,200,0)');
      ctx.fillStyle = kg;
      ctx.fillRect(0, y - rad, 64, rad * 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }
  const jetTex = makeJetTexture();

  function makeQuasar(position: number[]) {
    const grp = new THREE.Group();
    grp.position.set(...position);

    grp.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(28, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xfff4d0 }),
      ),
    );

    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const ctx = cv.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,240,1)');
    g.addColorStop(0.18, 'rgba(255,220,160,.85)');
    g.addColorStop(0.45, 'rgba(220,140,255,.45)');
    g.addColorStop(0.75, 'rgba(120,60,200,.15)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(cv),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.set(620, 620, 1);
    grp.add(glow);

    function jet(direction: number) {
      const j = new THREE.Group();
      const planeMat = new THREE.MeshBasicMaterial({
        map: jetTex,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const p1 = new THREE.Mesh(new THREE.PlaneGeometry(280, 3600), planeMat);
      const p2 = new THREE.Mesh(new THREE.PlaneGeometry(280, 3600), planeMat.clone());
      p1.position.y = 1800;
      p2.position.y = 1800;
      p2.rotation.y = Math.PI / 2;
      j.add(p1);
      j.add(p2);
      const innerMat = new THREE.MeshBasicMaterial({
        map: jetTex,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const inner = new THREE.Mesh(new THREE.PlaneGeometry(70, 3200), innerMat);
      inner.position.y = 1600;
      j.add(inner);
      if (direction < 0) j.rotation.x = Math.PI;
      return j;
    }
    grp.add(jet(1));
    grp.add(jet(-1));

    const dc = document.createElement('canvas');
    dc.width = dc.height = 512;
    const dctx = dc.getContext('2d')!;
    const dg = dctx.createRadialGradient(256, 256, 30, 256, 256, 256);
    dg.addColorStop(0, 'rgba(255,250,200,0)');
    dg.addColorStop(0.1, 'rgba(255,230,160,1)');
    dg.addColorStop(0.3, 'rgba(255,170,80,.85)');
    dg.addColorStop(0.6, 'rgba(220,90,160,.5)');
    dg.addColorStop(0.85, 'rgba(120,40,160,.2)');
    dg.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = dg;
    dctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 240; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 80 + Math.random() * 160;
      dctx.fillStyle = 'rgba(255,220,160,' + Math.random() * 0.5 + ')';
      dctx.beginPath();
      dctx.arc(
        256 + Math.cos(ang) * rad,
        256 + Math.sin(ang) * rad,
        1.5 + Math.random() * 3.5,
        0,
        Math.PI * 2,
      );
      dctx.fill();
    }
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(40, 280, 96),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(dc),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    disk.rotation.x = Math.PI * 0.5;
    grp.add(disk);

    grp.rotation.x = Math.random() * Math.PI * 2;
    grp.rotation.z = Math.random() * Math.PI * 2;

    scene.add(grp);
    quasars.push({ group: grp, glow, disk });
    placedPositions.push(new THREE.Vector3(...position));
  }
  makeQuasar([25000, 5000, -20000]);
  makeQuasar([-28000, -8000, 18000]);

  // ===== Dyson Sphere =====
  const dysonSpheres: any[] = [];
  function makeDyson(position: number[]) {
    const grp = new THREE.Group();
    grp.position.set(...position);
    const R = 280;

    const star = new THREE.Mesh(
      new THREE.SphereGeometry(100, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffe8a0 }),
    );
    grp.add(star);

    const sgcv = document.createElement('canvas');
    sgcv.width = sgcv.height = 128;
    const sgc = sgcv.getContext('2d')!;
    const sg = sgc.createRadialGradient(64, 64, 0, 64, 64, 64);
    sg.addColorStop(0, 'rgba(255,240,180,1)');
    sg.addColorStop(0.4, 'rgba(255,200,80,0.6)');
    sg.addColorStop(1, 'rgba(255,120,40,0)');
    sgc.fillStyle = sg;
    sgc.fillRect(0, 0, 128, 128);
    const starHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(sgcv),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    starHalo.scale.set(900, 900, 1);
    grp.add(starHalo);

    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    function ring(rotX: number, rotY: number, rotZ: number) {
      const r = new THREE.Mesh(new THREE.TorusGeometry(R, 3, 6, 96), latticeMat);
      r.rotation.set(rotX, rotY, rotZ);
      grp.add(r);
    }
    ring(0, 0, 0);
    ring(Math.PI / 2, 0, 0);
    ring(0, Math.PI / 2, 0);
    ring(Math.PI / 4, Math.PI / 4, 0);
    ring(-Math.PI / 4, Math.PI / 4, 0);
    ring(Math.PI / 4, -Math.PI / 4, 0);

    const panelMat = new THREE.MeshBasicMaterial({
      color: 0x2a3045,
      transparent: true,
      opacity: 0.85,
    });
    for (let i = 0; i < 32; i++) {
      const u = Math.random(),
        v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 4), panelMat);
      panel.position.set(
        R * Math.sin(phi) * Math.cos(theta),
        R * Math.cos(phi),
        R * Math.sin(phi) * Math.sin(theta),
      );
      panel.lookAt(0, 0, 0);
      grp.add(panel);
    }

    const pointGeo = new THREE.BufferGeometry();
    const POINT_N = 60;
    const pPos = new Float32Array(POINT_N * 3);
    for (let i = 0; i < POINT_N; i++) {
      const u = Math.random(),
        v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      pPos[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = R * Math.cos(phi);
      pPos[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);
    }
    pointGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const lights = new THREE.Points(
      pointGeo,
      new THREE.PointsMaterial({
        color: 0xffd070,
        size: 6,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    grp.add(lights);

    scene.add(grp);
    dysonSpheres.push({ group: grp, lights });
    placedPositions.push(new THREE.Vector3(...position));
  }
  makeDyson([-15000, 800, -10000]);
  makeDyson([20000, -2000, 12000]);

  // ===== Civilian ships (NPC) =====
  const ships: any[] = [];
  function makeShip(idx: number) {
    const grp = new THREE.Group();
    const hull = new THREE.Mesh(
      new THREE.ConeGeometry(2.2, 9, 8),
      new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.45, metalness: 0.65 }),
    );
    hull.rotation.x = Math.PI / 2;
    grp.add(hull);
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(5, 1.6, 4.5),
      new THREE.MeshStandardMaterial({ color: 0x55606e, roughness: 0.5, metalness: 0.6 }),
    );
    body.position.z = -2;
    grp.add(body);
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.4, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x404a55, roughness: 0.55, metalness: 0.55 }),
    );
    wing.position.z = -1.5;
    grp.add(wing);
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const ctx = cv.getContext('2d')!;
    const eg = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    eg.addColorStop(0, 'rgba(180,220,255,1)');
    eg.addColorStop(0.4, 'rgba(80,140,255,0.6)');
    eg.addColorStop(1, 'rgba(40,80,200,0)');
    ctx.fillStyle = eg;
    ctx.fillRect(0, 0, 64, 64);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(cv),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.set(18, 18, 1);
    glow.position.z = -5;
    grp.add(glow);
    const navLight = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff3a3a }),
    );
    navLight.position.set(0, 0.8, 0);
    grp.add(navLight);

    // Orbit centers closer to the player's zone so ships are actually visible
    const orbitCenter = new THREE.Vector3(
      (Math.random() - 0.5) * 12000,
      (Math.random() - 0.5) * 4000,
      (Math.random() - 0.5) * 12000,
    );
    const orbitR = 800 + Math.random() * 3000;
    const orbitAxis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ).normalize();
    const orbitSpeed = (Math.random() < 0.5 ? -1 : 1) * (0.00015 + Math.random() * 0.0003);
    const orbitPhase = Math.random() * Math.PI * 2;

    scene.add(grp);
    ships.push({
      group: grp,
      glow,
      navLight,
      orbitCenter,
      orbitR,
      orbitAxis,
      orbitSpeed,
      orbitPhase,
      idx,
    });
  }
  for (let i = 0; i < 14; i++) makeShip(i);

  // ===== Shooting stars =====
  function meteorTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 32;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 16, 256, 16);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.55, 'rgba(255,230,180,0.45)');
    g.addColorStop(0.88, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 32);
    ctx.globalCompositeOperation = 'destination-in';
    const tg = ctx.createLinearGradient(0, 0, 0, 32);
    tg.addColorStop(0, 'rgba(0,0,0,0)');
    tg.addColorStop(0.5, 'rgba(0,0,0,1)');
    tg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = tg;
    ctx.fillRect(0, 0, 256, 32);
    return new THREE.CanvasTexture(c);
  }
  const meteorTex = meteorTexture();
  const meteors: any[] = [];
  for (let i = 0; i < 8; i++) {
    const mat = new THREE.MeshBasicMaterial({
      map: meteorTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.visible = false;
    scene.add(mesh);
    meteors.push({
      mesh,
      alive: false,
      age: 0,
      life: 0,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      length: 0,
    });
  }
  function spawnMeteor() {
    const m = meteors.find((x: any) => !x.alive);
    if (!m) return;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const dir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi) * 0.6,
      Math.sin(phi) * Math.sin(theta),
    );
    const dist = 5500 + Math.random() * 1200;
    m.pos.copy(camera.position).addScaledVector(dir, dist);
    const t1 = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
    const t2 = new THREE.Vector3().crossVectors(dir, t1).normalize();
    const ang = Math.random() * Math.PI * 2;
    const tangent = t1
      .multiplyScalar(Math.cos(ang))
      .add(t2.multiplyScalar(Math.sin(ang)))
      .normalize();
    m.vel.copy(tangent).multiplyScalar(550 + Math.random() * 400);
    m.age = 0;
    m.life = 1.2 + Math.random() * 1.4;
    m.length = 280 + Math.random() * 320;
    m.alive = true;
    m.mesh.visible = true;
  }
  const _tmpFwd = new THREE.Vector3();
  const _tmpToCam = new THREE.Vector3();
  const _tmpUp = new THREE.Vector3();
  const _tmpMat = new THREE.Matrix4();
  function updateMeteors(dtSec: number) {
    for (const m of meteors) {
      if (!m.alive) continue;
      m.age += dtSec;
      if (m.age >= m.life) {
        m.alive = false;
        m.mesh.visible = false;
        m.mesh.material.opacity = 0;
        continue;
      }
      m.pos.addScaledVector(m.vel, dtSec);
      m.mesh.position.copy(m.pos);
      _tmpFwd.copy(m.vel).normalize();
      _tmpToCam.subVectors(camera.position, m.pos).normalize();
      _tmpUp.crossVectors(_tmpToCam, _tmpFwd).normalize();
      const zAxis = new THREE.Vector3().crossVectors(_tmpFwd, _tmpUp).normalize();
      _tmpMat.makeBasis(_tmpFwd, _tmpUp, zAxis);
      m.mesh.quaternion.setFromRotationMatrix(_tmpMat);
      m.mesh.scale.set(m.length, 10, 1);
      const t = m.age / m.life;
      const alpha = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;
      m.mesh.material.opacity = Math.max(0, Math.min(1, alpha)) * 0.85;
    }
    if (Math.random() < dtSec * 0.7) spawnMeteor();
  }

  // ===== Lights =====
  scene.add(new THREE.AmbientLight(0x4a4870, 0.6));
  const sunLight = new THREE.DirectionalLight(0xfff2d6, 1.3);
  sunLight.position.set(100, 80, 200);
  scene.add(sunLight);
  scene.add(new THREE.PointLight(0xb088ff, 1.0, 8000));
  const orangeLight = new THREE.PointLight(0xff8855, 0.9, 8000);
  orangeLight.position.set(2000, -500, 4000);
  scene.add(orangeLight);
  const tealLight = new THREE.PointLight(0x44d4c8, 0.7, 8000);
  tealLight.position.set(-3000, 0, -2000);
  scene.add(tealLight);

  // Moves everything one frame on; `dt` in ms, `dtSec` in seconds.
  function update(now: number, dt: number, dtSec: number) {
    // the turns below are a frame's at 60 frames a second, scaled to this one
    const dtN = dt / 16;
    for (const s of ships) {
      s.orbitPhase += s.orbitSpeed * dt;
      const arb =
        Math.abs(s.orbitAxis.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const b1 = new THREE.Vector3().crossVectors(s.orbitAxis, arb).normalize();
      const b2 = new THREE.Vector3().crossVectors(s.orbitAxis, b1).normalize();
      const cs = Math.cos(s.orbitPhase),
        sn = Math.sin(s.orbitPhase);
      const px = s.orbitCenter.x + (b1.x * cs + b2.x * sn) * s.orbitR;
      const py = s.orbitCenter.y + (b1.y * cs + b2.y * sn) * s.orbitR;
      const pz = s.orbitCenter.z + (b1.z * cs + b2.z * sn) * s.orbitR;
      const vx = -b1.x * sn + b2.x * cs;
      const vy = -b1.y * sn + b2.y * cs;
      const vz = -b1.z * sn + b2.z * cs;
      s.group.position.set(px, py, pz);
      s.group.lookAt(px + vx, py + vy, pz + vz);
      const blink = Math.sin(now * 0.006 + s.idx) > 0.5 ? 1 : 0.15;
      s.navLight.material.color.setRGB(blink, blink * 0.15, blink * 0.15);
      s.glow.material.opacity = 0.7 + 0.3 * Math.sin(now * 0.005 + s.idx * 1.7);
    }

    for (const bh of blackHoles) {
      bh.disk.rotation.z += bh.disk.userData.spin * dtN;
      bh.photon.lookAt(camera.position);
      bh.halo.material.opacity = 0.85 + 0.15 * Math.sin(now * 0.002);
    }

    for (const q of quasars) {
      q.group.rotation.z += 0.0006 * dtN;
      if (q.disk) q.disk.rotation.z += 0.005 * dtN;
      q.glow.material.opacity = 0.85 + 0.15 * Math.sin(now * 0.0015);
    }

    for (const d of dysonSpheres) {
      d.group.rotation.y += 0.0006 * dtN;
      d.lights.material.opacity = 0.6 + 0.4 * Math.sin(now * 0.002);
    }

    updateMeteors(dtSec);
  }

  return { update };
}
