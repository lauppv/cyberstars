import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function RestRoomPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    script.onload = () => {
      if (destroyed) return;
      initScene(container);
    };
    document.head.appendChild(script);

    function initScene(el: HTMLElement) {
      const THREE = (window as any).THREE;
      if (!THREE || destroyed) return;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x05050d, 0.00006);

      const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 60000);
      camera.position.set(0, 0, 0);
      camera.rotation.order = "YXZ";

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setClearColor(0x05050d, 1);
      el.querySelector("#rest-scene")!.appendChild(renderer.domElement);

      // ===== Nebulae =====
      function nebulaTex(color: string) {
        const c = document.createElement("canvas"); c.width = c.height = 256;
        const ctx = c.getContext("2d")!;
        const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        g.addColorStop(0, color + "cc");
        g.addColorStop(0.4, color + "44");
        g.addColorStop(1, color + "00");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
        return new THREE.CanvasTexture(c);
      }
      const nebPalette = ["#6c5ce7", "#ff6b6b", "#00d68f", "#3b6bff", "#ff8aff", "#ffa040"];
      for (let i = 0; i < 60; i++) {
        const tex = nebulaTex(nebPalette[i % nebPalette.length]);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.12 + Math.random() * 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
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
        new THREE.Color(0xffffff), new THREE.Color(0xcfd9ff),
        new THREE.Color(0xffd1a1), new THREE.Color(0xa8c4ff),
        new THREE.Color(0xe8b8ff), new THREE.Color(0xfff0a0),
      ];
      for (let i = 0; i < SKY_STAR_COUNT; i++) {
        const u = Math.random(), v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = SKY_R * (0.85 + Math.random() * 0.3);
        skyPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        skyPos[i * 3 + 1] = r * Math.cos(phi);
        skyPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        const col = starColors[Math.floor(Math.random() * starColors.length)];
        skyCol[i * 3] = col.r; skyCol[i * 3 + 1] = col.g; skyCol[i * 3 + 2] = col.b;
      }
      skyGeo.setAttribute("position", new THREE.BufferAttribute(skyPos, 3));
      skyGeo.setAttribute("color", new THREE.BufferAttribute(skyCol, 3));
      const skyMat = new THREE.PointsMaterial({ size: 8, vertexColors: true, transparent: true, opacity: 1, sizeAttenuation: true, depthWrite: false });
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
        for (let k = 0; k < 4; k++) lat += (Math.random() - 0.5);
        lat *= 0.085;
        const r = SKY_R * (0.95 + Math.random() * 0.1);
        mwPos[i * 3] = r * Math.cos(lat) * Math.cos(theta);
        mwPos[i * 3 + 1] = r * Math.sin(lat);
        mwPos[i * 3 + 2] = r * Math.cos(lat) * Math.sin(theta);
        const warm = Math.random();
        if (warm < 0.5) { mwCol[i * 3] = 1.0; mwCol[i * 3 + 1] = 0.96; mwCol[i * 3 + 2] = 0.86; }
        else if (warm < 0.8) { mwCol[i * 3] = 0.9; mwCol[i * 3 + 1] = 0.88; mwCol[i * 3 + 2] = 1.0; }
        else { mwCol[i * 3] = 1.0; mwCol[i * 3 + 1] = 0.85; mwCol[i * 3 + 2] = 0.65; }
      }
      mwGeo.setAttribute("position", new THREE.BufferAttribute(mwPos, 3));
      mwGeo.setAttribute("color", new THREE.BufferAttribute(mwCol, 3));
      const mwMat = new THREE.PointsMaterial({ size: 7, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending });
      milkyGroup.add(new THREE.Points(mwGeo, mwMat));

      function dustTex(tint: string) {
        const c = document.createElement("canvas"); c.width = c.height = 128;
        const ctx = c.getContext("2d")!;
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, tint + "b0");
        g.addColorStop(0.45, tint + "55");
        g.addColorStop(1, tint + "00");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
      }
      const mwTints = ["#fff0c8", "#f0e0a8", "#ffd0a0", "#e8c4ff", "#a0b8ff", "#ffb898"];
      function darkDustTex() {
        const c = document.createElement("canvas"); c.width = c.height = 128;
        const ctx = c.getContext("2d")!;
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(8,4,16,0.85)");
        g.addColorStop(0.5, "rgba(8,4,16,0.4)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
      }
      for (let i = 0; i < 110; i++) {
        const theta = Math.random() * Math.PI * 2;
        let lat = 0; for (let k = 0; k < 4; k++) lat += (Math.random() - 0.5);
        lat *= 0.075;
        const r = SKY_R * 0.92;
        const tint = mwTints[Math.floor(Math.random() * mwTints.length)];
        const mat = new THREE.SpriteMaterial({ map: dustTex(tint), transparent: true, opacity: 0.16 + Math.random() * 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
        const s = new THREE.Sprite(mat);
        s.position.set(r * Math.cos(lat) * Math.cos(theta), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(theta));
        const sc = 600 + Math.random() * 1600;
        s.scale.set(sc, sc * 0.55, 1);
        milkyGroup.add(s);
      }
      const darkTex = darkDustTex();
      for (let i = 0; i < 35; i++) {
        const theta = Math.random() * Math.PI * 2;
        const lat = (Math.random() - 0.5) * 0.025;
        const r = SKY_R * 0.93;
        const mat = new THREE.SpriteMaterial({ map: darkTex, transparent: true, opacity: 0.5, blending: THREE.NormalBlending, depthWrite: false });
        const s = new THREE.Sprite(mat);
        s.position.set(r * Math.cos(lat) * Math.cos(theta), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(theta));
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
        midCol[i * 3] = col.r; midCol[i * 3 + 1] = col.g; midCol[i * 3 + 2] = col.b;
      }
      midGeo.setAttribute("position", new THREE.BufferAttribute(midPos, 3));
      midGeo.setAttribute("color", new THREE.BufferAttribute(midCol, 3));
      scene.add(new THREE.Points(midGeo, new THREE.PointsMaterial({ size: 3, vertexColors: true, transparent: true, opacity: 1, sizeAttenuation: true, depthWrite: false })));

      // ===== Planet helpers =====
      function planetTexture(palette: string[], type: string) {
        const c = document.createElement("canvas"); c.width = 512; c.height = 256;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = palette[0]; ctx.fillRect(0, 0, 512, 256);
        if (type === "banded" || type === "gas") {
          for (let y = 0; y < 256; y += 2) {
            const t = y / 256;
            const noise = Math.sin(t * 24 + Math.random()) * 0.4 + Math.sin(t * 8) * 0.6;
            const ci = Math.floor(Math.abs(noise) * palette.length) % palette.length;
            ctx.fillStyle = palette[ci];
            ctx.globalAlpha = 0.6 + Math.random() * 0.4;
            ctx.fillRect(0, y, 512, 2);
          }
          ctx.globalAlpha = 1;
          ctx.fillStyle = palette[palette.length - 1];
          ctx.beginPath(); ctx.ellipse(160, 130, 28, 14, 0, 0, Math.PI * 2); ctx.fill();
        } else if (type === "rocky" || type === "desert" || type === "lava") {
          for (let i = 0; i < 700; i++) {
            const r = 2 + Math.random() * 22;
            ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
            ctx.globalAlpha = 0.4 + Math.random() * 0.5;
            ctx.beginPath();
            ctx.arc(Math.random() * 512, Math.random() * 256, r, 0, Math.PI * 2);
            ctx.fill();
          }
          if (type === "lava") {
            for (let i = 0; i < 80; i++) {
              ctx.fillStyle = "#ff5520";
              ctx.globalAlpha = 0.9;
              ctx.beginPath();
              ctx.arc(Math.random() * 512, Math.random() * 256, 1 + Math.random() * 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;
        } else if (type === "earthlike" || type === "ocean") {
          ctx.fillStyle = palette[0]; ctx.fillRect(0, 0, 512, 256);
          for (let i = 0; i < 14; i++) {
            ctx.fillStyle = palette[1 + (i % (palette.length - 1))];
            ctx.beginPath();
            const cx = Math.random() * 512, cy = Math.random() * 256;
            for (let a = 0; a < Math.PI * 2; a += 0.3) {
              const rr = 18 + Math.random() * 50;
              const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * 0.5;
              if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath(); ctx.fill();
          }
          ctx.fillStyle = "rgba(255,255,255,.5)";
          for (let i = 0; i < 32; i++) {
            ctx.beginPath();
            ctx.ellipse(Math.random() * 512, Math.random() * 256, 8 + Math.random() * 30, 4 + Math.random() * 8, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (type === "ice") {
          ctx.fillStyle = palette[0]; ctx.fillRect(0, 0, 512, 256);
          for (let i = 0; i < 40; i++) {
            ctx.fillStyle = palette[1 + (i % (palette.length - 1))];
            ctx.globalAlpha = 0.5 + Math.random() * 0.4;
            ctx.fillRect(Math.random() * 512, Math.random() * 256, 4 + Math.random() * 40, 1 + Math.random() * 4);
          }
          ctx.strokeStyle = palette[palette.length - 1];
          ctx.globalAlpha = 0.7;
          ctx.lineWidth = 1;
          for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            let x = Math.random() * 512, y = Math.random() * 256;
            ctx.moveTo(x, y);
            for (let j = 0; j < 6; j++) { x += (Math.random() - 0.5) * 60; y += (Math.random() - 0.5) * 30; ctx.lineTo(x, y); }
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        return tex;
      }

      function ringTexture(colors: string[]) {
        const c = document.createElement("canvas"); c.width = 256; c.height = 32;
        const ctx = c.getContext("2d")!;
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

      // ===== Planet catalogue =====
      const PLANET_TYPES = [
        { type: "rocky", palette: ["#a04020", "#d96030", "#f08040", "#642010"], glow: 0xff8855, names: ["Mars-7", "Outer Mars", "Red Rock", "Vermillion", "Rust"] },
        { type: "rocky", palette: ["#6a5040", "#8a6850", "#a08060", "#3a2820"], glow: 0xa08070, names: ["Sienna", "Hadley", "Drylands", "Ochre"] },
        { type: "earthlike", palette: ["#1a3a6f", "#2a78c4", "#3aa05f", "#dca555", "#f0e0a8"], glow: 0x70a8e0, names: ["Kepler-Prime", "Terra Nova", "Verdania", "Atlas", "Echo"] },
        { type: "earthlike", palette: ["#1f4a30", "#2d8060", "#46d4a8", "#0a2820", "#80f0c8"], glow: 0x66e4be, names: ["Veridian", "Aurelis", "Mossworld", "Greenhalo"] },
        { type: "ocean", palette: ["#0a3a6a", "#1a78d0", "#5fb8f0", "#0a1a3a"], glow: 0x70b8ff, names: ["Aquaria", "Tideborn", "Pelago", "Oceanus"] },
        { type: "desert", palette: ["#8a6a20", "#d4a060", "#b08040", "#3a2a10"], glow: 0xe0b070, names: ["Ker", "Saharah", "Brimwaste", "Goldsand"] },
        { type: "gas", palette: ["#5a3a8a", "#8a5fd0", "#b088f0", "#3a2060", "#d0a8ff"], glow: 0xb088ff, names: ["Violetus", "Auroma", "Lavender Giant", "Indigo Hall"] },
        { type: "gas", palette: ["#3a4a8a", "#5a78d0", "#88a0f0", "#202850"], glow: 0x88a0ff, names: ["Cobaltus", "Azure Hall", "Sapphis", "Nimbus"] },
        { type: "gas", palette: ["#8a4030", "#d07050", "#f0a050", "#502010", "#ffc080"], glow: 0xff9050, names: ["Amber Giant", "Honeyfall", "Sunburn", "Magma Cloud"] },
        { type: "ice", palette: ["#a8c8ff", "#dde8f8", "#608ad0", "#ffffff", "#88a8d0"], glow: 0xa8c8ff, names: ["Frostbite", "Cryos", "Glaciem", "Pale Eight"] },
        { type: "ice", palette: ["#80e0e0", "#b0f0f0", "#48a0a0", "#ffffff"], glow: 0x90f0f0, names: ["Mintglass", "Hoarfrost", "Cyanite"] },
        { type: "lava", palette: ["#3a0a0a", "#8a1a08", "#d04408", "#ff7020", "#1a0000"], glow: 0xff5020, names: ["Cinder", "Pyrre", "Hellforge", "Charcoal"] },
        { type: "rocky", palette: ["#404060", "#606080", "#8080a0", "#2a2a40"], glow: 0x8080b0, names: ["Moonlet Aelia", "Silvermoon", "Twilight Rock"] },
      ];

      const planets: any[] = [];
      const placedPositions: any[] = [];

      function makePlanet(spec: any, position: number[]) {
        const group = new THREE.Group();
        group.position.set(...position);

        const tex = planetTexture(spec.palette, spec.type);
        const planet = new THREE.Mesh(
          new THREE.SphereGeometry(spec.radius, 40, 40),
          new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: spec.type === "ocean" ? 0.4 : 0.05 })
        );
        planet.rotation.z = (Math.random() - 0.5) * 0.5;
        planet.userData.spin = 0.001 + Math.random() * 0.003;
        group.add(planet);

        const atmMat = new THREE.MeshBasicMaterial({ color: spec.glow, transparent: true, opacity: 0.16, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false });
        group.add(new THREE.Mesh(new THREE.SphereGeometry(spec.radius * 1.08, 24, 24), atmMat));

        if (spec.type === "lava") {
          planet.material.emissive = new THREE.Color(0xff3010);
          planet.material.emissiveIntensity = 0.45;
        }

        if ((spec.type === "gas" || spec.type === "banded") && Math.random() < 0.55) {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(spec.radius * 1.55, spec.radius * 2.4, 96),
            new THREE.MeshBasicMaterial({ map: ringTexture(spec.palette), transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })
          );
          ring.rotation.x = Math.PI * (0.38 + Math.random() * 0.18);
          ring.rotation.z = (Math.random() - 0.5) * 0.5;
          group.add(ring);
        } else if (Math.random() < 0.18) {
          const ring = new THREE.Mesh(
            new THREE.RingGeometry(spec.radius * 1.5, spec.radius * 2.2, 96),
            new THREE.MeshBasicMaterial({ map: ringTexture(spec.palette), transparent: true, opacity: 0.65, side: THREE.DoubleSide, depthWrite: false })
          );
          ring.rotation.x = Math.PI * 0.42;
          group.add(ring);
        }

        // moons
        const moonCount = Math.random() < 0.45 ? 0 : (Math.random() < 0.7 ? 1 : (Math.random() < 0.7 ? 2 : 3));
        const moons: any[] = [];
        for (let mi = 0; mi < moonCount; mi++) {
          const moonR = spec.radius * (0.08 + Math.random() * 0.22);
          const moonDist = spec.radius * (2.2 + mi * 1.2 + Math.random() * 0.9);
          const moonAngle = Math.random() * Math.PI * 2;
          const tiltX = (Math.random() - 0.5) * Math.PI;
          const tiltZ = (Math.random() - 0.5) * Math.PI * 0.7;
          const orbitPivot = new THREE.Group();
          orbitPivot.rotation.x = tiltX;
          orbitPivot.rotation.z = tiltZ;
          const moon = new THREE.Mesh(
            new THREE.SphereGeometry(moonR, 16, 16),
            new THREE.MeshStandardMaterial({ color: new THREE.Color(0.55 + Math.random() * 0.3, 0.55 + Math.random() * 0.3, 0.6 + Math.random() * 0.3), roughness: 0.9 })
          );
          moon.position.set(Math.cos(moonAngle) * moonDist, 0, Math.sin(moonAngle) * moonDist);
          moon.userData.orbit = { radius: moonDist, angle: moonAngle, speed: (Math.random() < 0.5 ? -1 : 1) * (0.0006 + Math.random() * 0.0024) };
          orbitPivot.add(moon);
          group.add(orbitPivot);
          moons.push(moon);
        }
        planet.userData.moons = moons;

        const name = spec.names[Math.floor(Math.random() * spec.names.length)] + " " + ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "π", "ρ", "σ", "τ", "φ", "χ", "ψ", "ω"][Math.floor(Math.random() * 22)];
        scene.add(group);
        planets.push({ group, planet, radius: spec.radius, name, type: spec.type });
        placedPositions.push(new THREE.Vector3(...position));
        return group;
      }

      function pickPos(minDist = 2500, maxDist = 24000, attempts = 20) {
        for (let n = 0; n < attempts; n++) {
          const r = minDist + Math.pow(Math.random(), 0.9) * (maxDist - minDist);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1) - Math.PI / 2;
          const pos = new THREE.Vector3(
            Math.cos(theta) * Math.cos(phi) * r,
            Math.sin(phi) * r,
            Math.sin(theta) * Math.cos(phi) * r,
          );
          let ok = true;
          for (const p of placedPositions) {
            if (p.distanceTo(pos) < 2200) { ok = false; break; }
          }
          if (ok) return [pos.x, pos.y, pos.z];
        }
        return [Math.random() * 30000 - 15000, Math.random() * 8000 - 4000, Math.random() * 30000 - 15000];
      }

      // Near planets
      const nearSpecs = [
        { ...PLANET_TYPES[0], radius: 90 },
        { ...PLANET_TYPES[2], radius: 160 },
        { ...PLANET_TYPES[6], radius: 240 },
        { ...PLANET_TYPES[9], radius: 100 },
        { ...PLANET_TYPES[11], radius: 70 },
      ];
      nearSpecs.forEach((s, i) => {
        const a = (i / nearSpecs.length) * Math.PI * 2 + Math.random();
        const r = 700 + Math.random() * 1400;
        makePlanet(s, [Math.cos(a) * r, (Math.random() - 0.5) * 400, Math.sin(a) * r - 800]);
      });

      // Far planets
      function pickPosFar() { return pickPos(3500, 60000, 30); }
      for (let i = 0; i < 140; i++) {
        const t = PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)];
        const radius = 40 + Math.pow(Math.random(), 0.9) * 240;
        makePlanet({ ...t, radius }, pickPosFar());
      }

      // ===== Black holes =====
      const blackHoles: any[] = [];
      function makeBlackHole(position: number[], scale = 1) {
        const grp = new THREE.Group();
        grp.position.set(...position);
        grp.add(new THREE.Mesh(new THREE.SphereGeometry(70 * scale, 48, 48), new THREE.MeshBasicMaterial({ color: 0x000000 })));

        const dc = document.createElement("canvas"); dc.width = dc.height = 512;
        const dctx = dc.getContext("2d")!;
        const g = dctx.createRadialGradient(256, 256, 80, 256, 256, 256);
        g.addColorStop(0, "rgba(255,250,200,0)");
        g.addColorStop(0.18, "rgba(255,240,150,1)");
        g.addColorStop(0.32, "rgba(255,180,80,1)");
        g.addColorStop(0.55, "rgba(220,80,40,.85)");
        g.addColorStop(0.78, "rgba(140,40,120,.45)");
        g.addColorStop(1, "rgba(60,20,80,0)");
        dctx.fillStyle = g; dctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 200; i++) {
          const a = Math.random() * Math.PI * 2;
          const d = 100 + Math.random() * 140;
          dctx.fillStyle = "rgba(255,220,160," + (Math.random() * 0.4) + ")";
          dctx.beginPath();
          dctx.arc(256 + Math.cos(a) * d, 256 + Math.sin(a) * d, 2 + Math.random() * 4, 0, Math.PI * 2);
          dctx.fill();
        }
        const diskTex = new THREE.CanvasTexture(dc);
        const disk = new THREE.Mesh(
          new THREE.RingGeometry(75 * scale, 280 * scale, 96),
          new THREE.MeshBasicMaterial({ map: diskTex, transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
        );
        disk.rotation.x = Math.PI * 0.42;
        disk.rotation.z = (Math.random() - 0.5);
        disk.userData.spin = 0.002 + Math.random() * 0.002;
        grp.add(disk);

        const photon = new THREE.Mesh(
          new THREE.RingGeometry(74 * scale, 79 * scale, 96),
          new THREE.MeshBasicMaterial({ color: 0xffe8a8, transparent: true, opacity: 0.85, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        grp.add(photon);

        const hc = document.createElement("canvas"); hc.width = hc.height = 256;
        const hctx = hc.getContext("2d")!;
        const hg = hctx.createRadialGradient(128, 128, 30, 128, 128, 128);
        hg.addColorStop(0, "rgba(255,180,80,0)");
        hg.addColorStop(0.35, "rgba(255,200,120,.5)");
        hg.addColorStop(0.6, "rgba(140,40,120,.2)");
        hg.addColorStop(1, "rgba(0,0,0,0)");
        hctx.fillStyle = hg; hctx.fillRect(0, 0, 256, 256);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        halo.scale.set(800 * scale, 800 * scale, 1);
        grp.add(halo);

        scene.add(grp);
        blackHoles.push({ group: grp, disk, photon, halo, scale, position: new THREE.Vector3(...position) });
        placedPositions.push(new THREE.Vector3(...position));
      }
      makeBlackHole([-3500, 600, -4200], 1.0);
      makeBlackHole([12000, -800, 6000], 1.4);
      makeBlackHole([-8500, 200, 14000], 0.7);
      makeBlackHole([18000, 1200, -16000], 1.1);
      makeBlackHole([-22000, -1500, -8000], 0.85);

      // ===== Quasars (bipolar jets) =====
      const quasars: any[] = [];
      function makeJetTexture() {
        const c = document.createElement("canvas"); c.width = 64; c.height = 1024;
        const ctx = c.getContext("2d")!;
        const g = ctx.createLinearGradient(0, 1024, 0, 0);
        g.addColorStop(0, "rgba(255,240,200,1)");
        g.addColorStop(0.06, "rgba(255,200,140,1)");
        g.addColorStop(0.20, "rgba(200,130,255,.85)");
        g.addColorStop(0.55, "rgba(140,80,220,.4)");
        g.addColorStop(0.85, "rgba(80,40,160,.12)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 1024);
        const h = ctx.createLinearGradient(0, 0, 64, 0);
        h.addColorStop(0, "rgba(0,0,0,0)");
        h.addColorStop(0.5, "rgba(0,0,0,1)");
        h.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "destination-in";
        ctx.fillStyle = h; ctx.fillRect(0, 0, 64, 1024);
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 14; i++) {
          const y = 100 + Math.random() * 700;
          const rad = 8 + Math.random() * 16;
          const kg = ctx.createRadialGradient(32, y, 0, 32, y, rad);
          const a = 0.5 + Math.random() * 0.4;
          kg.addColorStop(0, "rgba(255,230,200," + a + ")");
          kg.addColorStop(1, "rgba(255,230,200,0)");
          ctx.fillStyle = kg; ctx.fillRect(0, y - rad, 64, rad * 2);
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

        grp.add(new THREE.Mesh(new THREE.SphereGeometry(28, 24, 24), new THREE.MeshBasicMaterial({ color: 0xfff4d0 })));

        const cv = document.createElement("canvas"); cv.width = cv.height = 256;
        const ctx = cv.getContext("2d")!;
        const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        g.addColorStop(0, "rgba(255,255,240,1)");
        g.addColorStop(0.18, "rgba(255,220,160,.85)");
        g.addColorStop(0.45, "rgba(220,140,255,.45)");
        g.addColorStop(0.75, "rgba(120,60,200,.15)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        glow.scale.set(620, 620, 1);
        grp.add(glow);

        function jet(direction: number) {
          const j = new THREE.Group();
          const planeMat = new THREE.MeshBasicMaterial({ map: jetTex, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
          const p1 = new THREE.Mesh(new THREE.PlaneGeometry(280, 3600), planeMat);
          const p2 = new THREE.Mesh(new THREE.PlaneGeometry(280, 3600), planeMat.clone());
          p1.position.y = 1800; p2.position.y = 1800;
          p2.rotation.y = Math.PI / 2;
          j.add(p1); j.add(p2);
          const innerMat = new THREE.MeshBasicMaterial({ map: jetTex, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
          const inner = new THREE.Mesh(new THREE.PlaneGeometry(70, 3200), innerMat);
          inner.position.y = 1600;
          j.add(inner);
          if (direction < 0) j.rotation.x = Math.PI;
          return j;
        }
        grp.add(jet(1)); grp.add(jet(-1));

        const dc = document.createElement("canvas"); dc.width = dc.height = 512;
        const dctx = dc.getContext("2d")!;
        const dg = dctx.createRadialGradient(256, 256, 30, 256, 256, 256);
        dg.addColorStop(0, "rgba(255,250,200,0)");
        dg.addColorStop(0.10, "rgba(255,230,160,1)");
        dg.addColorStop(0.30, "rgba(255,170,80,.85)");
        dg.addColorStop(0.60, "rgba(220,90,160,.5)");
        dg.addColorStop(0.85, "rgba(120,40,160,.2)");
        dg.addColorStop(1, "rgba(0,0,0,0)");
        dctx.fillStyle = dg; dctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 240; i++) {
          const ang = Math.random() * Math.PI * 2;
          const rad = 80 + Math.random() * 160;
          dctx.fillStyle = "rgba(255,220,160," + (Math.random() * 0.5) + ")";
          dctx.beginPath();
          dctx.arc(256 + Math.cos(ang) * rad, 256 + Math.sin(ang) * rad, 1.5 + Math.random() * 3.5, 0, Math.PI * 2);
          dctx.fill();
        }
        const disk = new THREE.Mesh(
          new THREE.RingGeometry(40, 280, 96),
          new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(dc), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
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

        const star = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffe8a0 }));
        grp.add(star);

        const sgcv = document.createElement("canvas"); sgcv.width = sgcv.height = 128;
        const sgc = sgcv.getContext("2d")!;
        const sg = sgc.createRadialGradient(64, 64, 0, 64, 64, 64);
        sg.addColorStop(0, "rgba(255,240,180,1)");
        sg.addColorStop(0.4, "rgba(255,200,80,0.6)");
        sg.addColorStop(1, "rgba(255,120,40,0)");
        sgc.fillStyle = sg; sgc.fillRect(0, 0, 128, 128);
        const starHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(sgcv), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        starHalo.scale.set(900, 900, 1);
        grp.add(starHalo);

        const latticeMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
        function ring(rotX: number, rotY: number, rotZ: number) {
          const r = new THREE.Mesh(new THREE.TorusGeometry(R, 3, 6, 96), latticeMat);
          r.rotation.set(rotX, rotY, rotZ);
          grp.add(r);
        }
        ring(0, 0, 0); ring(Math.PI / 2, 0, 0); ring(0, Math.PI / 2, 0);
        ring(Math.PI / 4, Math.PI / 4, 0); ring(-Math.PI / 4, Math.PI / 4, 0); ring(Math.PI / 4, -Math.PI / 4, 0);

        const panelMat = new THREE.MeshBasicMaterial({ color: 0x2a3045, transparent: true, opacity: 0.85 });
        for (let i = 0; i < 32; i++) {
          const u = Math.random(), v = Math.random();
          const theta = 2 * Math.PI * u;
          const phi = Math.acos(2 * v - 1);
          const panel = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 4), panelMat);
          panel.position.set(R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta));
          panel.lookAt(0, 0, 0);
          grp.add(panel);
        }

        const pointGeo = new THREE.BufferGeometry();
        const POINT_N = 60;
        const pPos = new Float32Array(POINT_N * 3);
        for (let i = 0; i < POINT_N; i++) {
          const u = Math.random(), v = Math.random();
          const theta = 2 * Math.PI * u;
          const phi = Math.acos(2 * v - 1);
          pPos[i * 3] = R * Math.sin(phi) * Math.cos(theta);
          pPos[i * 3 + 1] = R * Math.cos(phi);
          pPos[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);
        }
        pointGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
        const lights = new THREE.Points(pointGeo, new THREE.PointsMaterial({ color: 0xffd070, size: 6, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
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
          new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.45, metalness: 0.65 })
        );
        hull.rotation.x = Math.PI / 2;
        grp.add(hull);
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(5, 1.6, 4.5),
          new THREE.MeshStandardMaterial({ color: 0x55606e, roughness: 0.5, metalness: 0.6 })
        );
        body.position.z = -2;
        grp.add(body);
        const wing = new THREE.Mesh(
          new THREE.BoxGeometry(10, 0.4, 2.5),
          new THREE.MeshStandardMaterial({ color: 0x404a55, roughness: 0.55, metalness: 0.55 })
        );
        wing.position.z = -1.5;
        grp.add(wing);
        const cv = document.createElement("canvas"); cv.width = cv.height = 64;
        const ctx = cv.getContext("2d")!;
        const eg = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        eg.addColorStop(0, "rgba(180,220,255,1)");
        eg.addColorStop(0.4, "rgba(80,140,255,0.6)");
        eg.addColorStop(1, "rgba(40,80,200,0)");
        ctx.fillStyle = eg; ctx.fillRect(0, 0, 64, 64);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        glow.scale.set(18, 18, 1);
        glow.position.z = -5;
        grp.add(glow);
        const navLight = new THREE.Mesh(
          new THREE.SphereGeometry(0.4, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xff3a3a })
        );
        navLight.position.set(0, 0.8, 0);
        grp.add(navLight);

        // Orbit centers closer to the player's zone so ships are actually visible
        const orbitCenter = new THREE.Vector3(
          (Math.random() - 0.5) * 12000,
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 12000
        );
        const orbitR = 800 + Math.random() * 3000;
        const orbitAxis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        const orbitSpeed = (Math.random() < 0.5 ? -1 : 1) * (0.00015 + Math.random() * 0.0003);
        const orbitPhase = Math.random() * Math.PI * 2;

        scene.add(grp);
        ships.push({ group: grp, glow, navLight, orbitCenter, orbitR, orbitAxis, orbitSpeed, orbitPhase, idx });
      }
      for (let i = 0; i < 14; i++) makeShip(i);

      // ===== Shooting stars =====
      function meteorTexture() {
        const c = document.createElement("canvas"); c.width = 256; c.height = 32;
        const ctx = c.getContext("2d")!;
        const g = ctx.createLinearGradient(0, 16, 256, 16);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.55, "rgba(255,230,180,0.45)");
        g.addColorStop(0.88, "rgba(255,255,255,1)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 32);
        ctx.globalCompositeOperation = "destination-in";
        const tg = ctx.createLinearGradient(0, 0, 0, 32);
        tg.addColorStop(0, "rgba(0,0,0,0)");
        tg.addColorStop(0.5, "rgba(0,0,0,1)");
        tg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = tg; ctx.fillRect(0, 0, 256, 32);
        return new THREE.CanvasTexture(c);
      }
      const meteorTex = meteorTexture();
      const meteors: any[] = [];
      for (let i = 0; i < 8; i++) {
        const mat = new THREE.MeshBasicMaterial({ map: meteorTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, opacity: 0 });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
        mesh.visible = false;
        scene.add(mesh);
        meteors.push({ mesh, alive: false, age: 0, life: 0, pos: new THREE.Vector3(), vel: new THREE.Vector3(), length: 0 });
      }
      function spawnMeteor() {
        const m = meteors.find((x: any) => !x.alive);
        if (!m) return;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi) * 0.6, Math.sin(phi) * Math.sin(theta));
        const dist = 5500 + Math.random() * 1200;
        m.pos.copy(camera.position).addScaledVector(dir, dist);
        const t1 = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
        const t2 = new THREE.Vector3().crossVectors(dir, t1).normalize();
        const ang = Math.random() * Math.PI * 2;
        const tangent = t1.multiplyScalar(Math.cos(ang)).add(t2.multiplyScalar(Math.sin(ang))).normalize();
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
          if (m.age >= m.life) { m.alive = false; m.mesh.visible = false; m.mesh.material.opacity = 0; continue; }
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
          const alpha = t < 0.12 ? (t / 0.12) : (1 - (t - 0.12) / 0.88);
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

      // ===== Input =====
      const keys = { w: false, a: false, s: false, d: false };
      let yawRate = 0, pitchRate = 0;
      let started = false;
      let paused = false;

      const DEAD_ZONE = 0.18;
      const MAX_YAW_RATE = 2.4;
      const MAX_PITCH_RATE = 1.6;

      const introEl = el.querySelector("#rest-intro") as HTMLElement;
      const cursorEl = el.querySelector("#rest-cursor") as HTMLElement;
      const pauseEl = el.querySelector("#rest-pause") as HTMLElement;
      const edgeTop = el.querySelector(".edge-hint.top") as HTMLElement;
      const edgeBottom = el.querySelector(".edge-hint.bottom") as HTMLElement;
      const edgeLeft = el.querySelector(".edge-hint.left") as HTMLElement;
      const edgeRight = el.querySelector(".edge-hint.right") as HTMLElement;
      const headingEl = el.querySelector("#rest-heading") as HTMLElement | null;
      const dirElm = el.querySelector("#rest-dir") as HTMLElement | null;
      const evaEl = el.querySelector("#rest-evaTimer") as HTMLElement;
      const hrEl = el.querySelector("#rest-hrate") as HTMLElement;
      const o2dec = el.querySelector("#rest-o2dec") as HTMLElement;
      const posEl = el.querySelector("#rest-posReadout") as HTMLElement;
      const evaEl2 = el.querySelector("#rest-evaTimer2") as HTMLElement;
      const hrEl2 = el.querySelector("#rest-hrate2") as HTMLElement;
      const o2dec2 = el.querySelector("#rest-o2dec2") as HTMLElement;
      const posEl2 = el.querySelector("#rest-posReadout2") as HTMLElement;
      const pressureVal = el.querySelector("#rest-pressureVal") as HTMLElement;
      const pressureTick = el.querySelector("#rest-pressureTick") as HTMLElement;
      const o2DialVal = el.querySelector("#rest-o2DialVal") as HTMLElement;
      const o2Tick = el.querySelector("#rest-o2Tick") as HTMLElement;
      let pressureTarget = 101.3, pressureCurrent = 101.3, nextPressureChange = 5000;
      let o2Target = 97, o2Current = 97, nextO2Change = 8000;
      const velEl = el.querySelector("#rest-velocity") as HTMLElement;
      const nearestEl = el.querySelector("#rest-nearestBody") as HTMLElement;

      function setPaused(v: boolean) {
        paused = v;
        pauseEl.classList.toggle("show", v);
        if (v) { yawRate = 0; pitchRate = 0; }
      }

      function steerCurve(t: number) { return Math.pow(t, 1.4); }

      const onMouseMove = (e: MouseEvent) => {
        cursorEl.style.left = e.clientX + "px";
        cursorEl.style.top = e.clientY + "px";
        if (paused) return;
        const nx = (e.clientX / innerWidth) - 0.5;
        const ny = (e.clientY / innerHeight) - 0.5;
        const ax = Math.abs(nx), ay = Math.abs(ny);
        const dx = ax < DEAD_ZONE ? 0 : Math.sign(nx) * steerCurve((ax - DEAD_ZONE) / (0.5 - DEAD_ZONE));
        const dy = ay < DEAD_ZONE ? 0 : Math.sign(ny) * steerCurve((ay - DEAD_ZONE) / (0.5 - DEAD_ZONE));
        yawRate = -dx * MAX_YAW_RATE;
        pitchRate = -dy * MAX_PITCH_RATE;
        const rotating = dx !== 0 || dy !== 0;
        cursorEl.classList.toggle("rotating", rotating);
        edgeLeft.classList.toggle("show", nx < -DEAD_ZONE);
        edgeRight.classList.toggle("show", nx > DEAD_ZONE);
        edgeTop.classList.toggle("show", ny < -DEAD_ZONE);
        edgeBottom.classList.toggle("show", ny > DEAD_ZONE);
      };

      const onMouseLeave = () => {
        yawRate = 0; pitchRate = 0;
        cursorEl.classList.remove("rotating");
        edgeLeft.classList.remove("show"); edgeRight.classList.remove("show");
        edgeTop.classList.remove("show"); edgeBottom.classList.remove("show");
      };

      function start() {
        if (started) return;
        started = true;
        introEl.classList.add("gone");
      }

      const onKeyDown = (e: KeyboardEvent) => {
        if (!started && (e.code === "Enter" || e.code === "Space")) { start(); e.preventDefault(); return; }
        if (e.code === "Escape") { if (started) setPaused(!paused); return; }
        if (e.code === "KeyQ") { handleExit(); return; }
        if (paused) return;
        if (e.code === "KeyW") keys.w = true;
        if (e.code === "KeyA") keys.a = true;
        if (e.code === "KeyS") keys.s = true;
        if (e.code === "KeyD") keys.d = true;
      };
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === "KeyW") keys.w = false;
        if (e.code === "KeyA") keys.a = false;
        if (e.code === "KeyS") keys.s = false;
        if (e.code === "KeyD") keys.d = false;
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);

      el.querySelector("#rest-enterBtn")!.addEventListener("click", (e: any) => { e.stopPropagation(); start(); });
      introEl.addEventListener("click", start);
      el.querySelector("#rest-resumeBtn")!.addEventListener("click", (e: any) => { e.stopPropagation(); setPaused(false); });
      pauseEl.addEventListener("click", () => setPaused(false));

      // ===== Resize =====
      const onResize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      };
      window.addEventListener("resize", onResize);

      // ===== HUD =====
      const startTime = performance.now();
      let currentPOI = "—";
      function fmt2(n: number) { return n.toString().padStart(2, "0"); }
      function tickHUD(now: number, speed: number) {
        const elapsed = Math.floor((now - startTime) / 1000);
        const evaStr = fmt2(Math.floor(elapsed / 3600)) + ":" + fmt2(Math.floor((elapsed % 3600) / 60)) + ":" + fmt2(elapsed % 60);
        evaEl.textContent = evaStr;
        evaEl2.textContent = evaStr;
        const hrVal = String(60 + Math.round(2 * Math.sin(now * 0.001)));
        hrEl.innerHTML = hrVal + " <small>BPM</small>";
        hrEl2.textContent = hrVal;
        const o2val = String(7 - Math.floor(elapsed / 60) % 4);
        o2dec.textContent = o2val;
        o2dec2.textContent = o2val;
        const d = camera.position.length();
        const posStr = (d >= 0 ? "+" : "") + (d / 1000).toFixed(3);
        posEl.textContent = posStr + " LY";
        posEl2.textContent = posStr;
        velEl.textContent = Math.round(speed * 600).toLocaleString();

        if (now > nextPressureChange) {
          pressureTarget = 100.8 + Math.random() * 1.4;
          nextPressureChange = now + 6000 + Math.random() * 12000;
        }
        pressureCurrent += (pressureTarget - pressureCurrent) * 0.02;
        const pInt = Math.floor(pressureCurrent);
        const pDec = (pressureCurrent - pInt).toFixed(1).slice(1);
        pressureVal.innerHTML = pInt + "<small>" + pDec + "</small>";
        const pressureAngle = ((pressureCurrent - 100) / 3) * 180 - 90;
        pressureTick.style.setProperty("--a", pressureAngle.toFixed(0) + "deg");

        if (now > nextO2Change) {
          o2Target = 94 + Math.random() * 5;
          nextO2Change = now + 8000 + Math.random() * 14000;
        }
        o2Current += (o2Target - o2Current) * 0.015;
        const o2Int = Math.round(o2Current);
        o2DialVal.innerHTML = o2Int + "<small>%</small>";
        const o2Angle = ((o2Current - 90) / 10) * 180 - 90;
        o2Tick.style.setProperty("--a", o2Angle.toFixed(0) + "deg");
      }

      function updateNearest() {
        let best: any = null, bestD = Infinity;
        for (const p of planets) {
          const d = camera.position.distanceTo(p.group.position);
          if (d < bestD) { bestD = d; best = p; }
        }
        for (const b of blackHoles) {
          const d = camera.position.distanceTo(b.group.position);
          if (d < bestD) { bestD = d; best = { name: "Black hole", type: "bh", radius: 200 }; }
        }
        if (!best) return;
        nearestEl.textContent = best.name + " · " + (bestD / 100).toFixed(1) + "k km";
      }
      let nearestTick = 0;

      // ===== Main loop =====
      const fwd = new THREE.Vector3(), right = new THREE.Vector3();
      const velocity = new THREE.Vector3();
      const targetVel = new THREE.Vector3();
      let velSmoothed = 0;
      const MAX_SPEED = 3.6;
      const ACCEL_TAU = 2.8;
      const DECEL_TAU = 5.0;
      let lastT = performance.now();
      let rafId = 0;

      function animate(now: number) {
        if (destroyed) return;
        rafId = requestAnimationFrame(animate);
        const dt = Math.min(50, now - lastT); lastT = now;
        const dtN = dt / 16;
        const dtSec = dt / 1000;

        if (paused) { renderer.render(scene, camera); return; }

        camera.rotateY(yawRate * dtSec);
        camera.rotateX(pitchRate * dtSec);

        fwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
        right.set(1, 0, 0).applyQuaternion(camera.quaternion);

        let dirX = 0, dirZ = 0;
        if (started) {
          if (keys.w) dirZ += 1;
          if (keys.s) dirZ -= 1;
          if (keys.d) dirX += 1;
          if (keys.a) dirX -= 1;
        }
        const hasInput = (dirX !== 0 || dirZ !== 0);

        targetVel.set(0, 0, 0);
        if (hasInput) {
          const mag = Math.hypot(dirX, dirZ);
          const nx = dirX / mag, nz = dirZ / mag;
          targetVel.addScaledVector(fwd, nz * MAX_SPEED);
          targetVel.addScaledVector(right, nx * MAX_SPEED);
        }

        const tau = hasInput ? ACCEL_TAU : DECEL_TAU;
        const k = 1 - Math.exp(-dtSec / tau);
        velocity.lerp(targetVel, k);

        if (velocity.lengthSq() > 1e-6) {
          camera.position.addScaledVector(velocity, dtN);
        }

        velSmoothed = velocity.length();

        skyStars.position.copy(camera.position);
        milkyGroup.position.copy(camera.position);
        const galaxySpin = now * 0.0000015;
        skyStars.rotation.y = galaxySpin;
        milkyGroup.rotation.y = galaxySpin;

        for (const p of planets) {
          p.planet.rotation.y += p.planet.userData.spin;
          const ms = p.planet.userData.moons || [];
          for (const moon of ms) {
            const o = moon.userData.orbit;
            if (!o) continue;
            o.angle += o.speed;
            moon.position.x = Math.cos(o.angle) * o.radius;
            moon.position.z = Math.sin(o.angle) * o.radius;
          }
        }

        for (const s of ships) {
          s.orbitPhase += s.orbitSpeed * dt;
          const arb = Math.abs(s.orbitAxis.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
          const b1 = new THREE.Vector3().crossVectors(s.orbitAxis, arb).normalize();
          const b2 = new THREE.Vector3().crossVectors(s.orbitAxis, b1).normalize();
          const cs = Math.cos(s.orbitPhase), sn = Math.sin(s.orbitPhase);
          const px = s.orbitCenter.x + (b1.x * cs + b2.x * sn) * s.orbitR;
          const py = s.orbitCenter.y + (b1.y * cs + b2.y * sn) * s.orbitR;
          const pz = s.orbitCenter.z + (b1.z * cs + b2.z * sn) * s.orbitR;
          const vx = (-b1.x * sn + b2.x * cs);
          const vy = (-b1.y * sn + b2.y * cs);
          const vz = (-b1.z * sn + b2.z * cs);
          s.group.position.set(px, py, pz);
          s.group.lookAt(px + vx, py + vy, pz + vz);
          const blink = (Math.sin(now * 0.006 + s.idx) > 0.5) ? 1 : 0.15;
          s.navLight.material.color.setRGB(blink, blink * 0.15, blink * 0.15);
          s.glow.material.opacity = 0.7 + 0.3 * Math.sin(now * 0.005 + s.idx * 1.7);
        }

        for (const bh of blackHoles) {
          bh.disk.rotation.z += bh.disk.userData.spin;
          bh.photon.lookAt(camera.position);
          bh.halo.material.opacity = 0.85 + 0.15 * Math.sin(now * 0.002);
        }

        for (const q of quasars) {
          q.group.rotation.z += 0.0006;
          if (q.disk) q.disk.rotation.z += 0.005;
          q.glow.material.opacity = 0.85 + 0.15 * Math.sin(now * 0.0015);
        }

        for (const d of dysonSpheres) {
          d.group.rotation.y += 0.0006;
          d.lights.material.opacity = 0.6 + 0.4 * Math.sin(now * 0.002);
        }

        tickHUD(now, velSmoothed);
        if ((nearestTick++ % 12) === 0) updateNearest();
        updateMeteors(dtSec);

        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(animate);

      // Cleanup
      cleanupRef.current = () => {
        destroyed = true;
        cancelAnimationFrame(rafId);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    }

    function handleExit() {
      if (cleanupRef.current) cleanupRef.current();
      navigate("/");
    }

    (container.querySelector(".rest-exit") as HTMLElement)?.addEventListener("click", (e) => {
      e.preventDefault();
      handleExit();
    });

    return () => {
      destroyed = true;
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [navigate]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999]" style={{ cursor: "none", background: "#000", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <style>{restRoomStyles}</style>

      <div id="rest-intro" className="intro">
        <div className="intro-kicker">{"◈"} CSTR-9 {"·"} STELLARIS {"·"} MARK IV</div>
        <div className="intro-title">Welcome aboard, captain.</div>
        <div className="intro-sub">A drift vessel for unhurried exploration. Take the helm — glide through 100+ worlds, past nebulae and black holes. No goals. No timer. Just the cosmos through your viewport.</div>
        <div className="intro-controls">
          <div className="row"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>Move / strafe</span></div>
          <div className="row"><kbd>Mouse</kbd><span>Center = still {"·"} edge = rotate (360{"°"})</span></div>
          <div className="row"><kbd>Esc</kbd><span>Pause</span></div>
          <div className="row"><kbd>Q</kbd><span>Exit to dashboard</span></div>
        </div>
        <button className="intro-btn" id="rest-enterBtn">{"▸"} Begin Drift</button>
        <div className="intro-hint">Move the mouse to look around {"·"} W to fly forward</div>
      </div>

      <div id="rest-scene" style={{ position: "fixed", inset: 0, zIndex: 0 }} />

      <div className="ck-window-glass" />

      {/* Cockpit */}
      <div className="cockpit">
        <div className="ck-top">
          <div className="ck-vent">{Array.from({ length: 24 }, (_, i) => <span key={i} />)}</div>
          <div className="ck-ship-tag"><span className="pulse" /><span>CSTR-9 STELLARIS</span><small>MK IV</small></div>
          <div className="ck-vent">{Array.from({ length: 24 }, (_, i) => <span key={i} />)}</div>
        </div>

        {/* Bottom dashboard */}
        <div className="ck-dash">
          <div className="ck-dash-inner">
            <div className="ck-cluster">
              <div className="dial">
                <div className="dial-tick" id="rest-pressureTick" style={{ "--a": "30deg" } as any} />
                <div className="dial-label">Cabin Pressure</div>
                <div className="dial-value" id="rest-pressureVal">101<small>.3</small></div>
                <div className="dial-unit">kPa</div>
              </div>

              <div className="center-display">
                <div className="cd-poi" id="rest-poiTitle">
                  <div className="cd-poi-kicker">{"⬡"} CyberStars {"·"} Drift Protocol</div>
                  <div className="cd-poi-text" id="rest-poiName">Open space</div>
                </div>
                <div className="cd-mid">
                  <div className="scope">
                    <div className="scope-cross" />
                    <div className="scope-sweep" />
                    <div className="scope-blip scope-b1" />
                    <div className="scope-blip scope-b2" />
                    <div className="scope-blip scope-b3" />
                    <div className="scope-self" />
                  </div>
                  <div className="cd-readouts">
                    <div className="cd-cell"><span className="cd-label">Velocity</span><span className="cd-value"><span id="rest-velocity">0</span> <small>km/s</small></span></div>
                    <div className="cd-cell"><span className="cd-label">Thrust</span><span className="cd-value">000<small>%</small></span></div>
                    <div className="cd-cell"><span className="cd-label">Engine</span><span className="cd-value">DRIFT-1</span></div>
                    <div className="cd-cell"><span className="cd-label">Course</span><span className="cd-value">OPEN</span></div>
                    <div className="cd-cell"><span className="cd-label">EVA</span><span className="cd-value"><span id="rest-evaTimer2">00:00:00</span></span></div>
                    <div className="cd-cell"><span className="cd-label">Position</span><span className="cd-value"><span id="rest-posReadout2">+0.000</span> <small>LY</small></span></div>
                    <div className="cd-cell"><span className="cd-label">Heart</span><span className="cd-value"><span id="rest-hrate2">62</span> <small>BPM</small></span></div>
                    <div className="cd-cell"><span className="cd-label">O₂</span><span className="cd-value">9<span id="rest-o2dec2">7</span><small>%</small></span></div>
                  </div>
                </div>
              </div>

              <div className="dial">
                <div className="dial-tick" id="rest-o2Tick" style={{ "--a": "0deg" } as any} />
                <div className="dial-label">O₂ Level</div>
                <div className="dial-value" id="rest-o2DialVal">97<small>%</small></div>
                <div className="dial-unit">nominal</div>
              </div>
            </div>

            <div className="ck-bottom-strip">
              <div className="btn-grid">
                <span className="btn amber lit" /><span className="btn amber" /><span className="btn green" /><span className="btn" /><span className="btn amber" /><span className="btn" />
                <span className="btn amber" /><span className="btn red" /><span className="btn amber" /><span className="btn green" /><span className="btn amber lit" /><span className="btn toggle" />
              </div>
              <div className="yoke-stick"><div className="grip" /><div className="shaft" /><div className="base" /></div>
              <div className="yoke-stick"><div className="grip" /><div className="shaft" /><div className="base" /></div>
              <div className="btn-grid">
                <span className="btn green" /><span className="btn amber" /><span className="btn" /><span className="btn amber" /><span className="btn red" /><span className="btn toggle" />
                <span className="btn" /><span className="btn amber lit" /><span className="btn green" /><span className="btn amber" /><span className="btn amber" /><span className="btn" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden HUD data for nearest body */}
      <span id="rest-nearestBody" style={{ display: "none" }}>{"—"}</span>

      <div className="cursor-dot" id="rest-cursor" />
      <div className="edge-hint top" />
      <div className="edge-hint bottom" />
      <div className="edge-hint left" />
      <div className="edge-hint right" />

      <a href="#" className="rest-exit exit">{"✕"} EXIT REST MODE</a>

      <div className="pause" id="rest-pause">
        <div className="pause-icon">{"✦"}</div>
        <div className="pause-title">Paused</div>
        <div className="pause-sub">Take a moment. Click anywhere or press <kbd style={{ fontFamily: "var(--mono)", background: "rgba(255,255,255,.1)", padding: "1px 6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,.15)" }}>Esc</kbd> to keep drifting.</div>
        <button className="pause-cta" id="rest-resumeBtn">{"▸"} RESUME</button>
      </div>

      {/* Hidden HUD data */}
      <div style={{ display: "none" }}>
        <span id="rest-evaTimer">00:00:00</span>
        <span id="rest-hrate">62 BPM</span>
        <span id="rest-o2dec">7</span>
        <span id="rest-posReadout">+0.000 LY</span>
      </div>
    </div>
  );
}

const restRoomStyles = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--accent:#6C5CE7;--success:#00D68F;--warning:#FFAA00;--mono:'JetBrains Mono','Fira Code',monospace;--font:'Space Grotesk',system-ui,sans-serif}
.ck-window-glass{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 55% 45% at 50% 35%,transparent 65%,rgba(0,0,0,.35) 100%);z-index:9;mix-blend-mode:multiply}
.cockpit{position:fixed;inset:0;z-index:10;pointer-events:none;font-family:var(--mono);color:#e8e8f0}
.cockpit *{pointer-events:none}
.ck-top{position:absolute;top:0;left:0;right:0;height:46px;background:linear-gradient(180deg,#050810 0%,#0e131c 60%,#161c28 100%);border-bottom:1px solid #1a2330;box-shadow:0 4px 14px rgba(0,0,0,.7),inset 0 -1px 0 rgba(255,170,68,.2);display:flex;align-items:center;padding:0 16px;gap:14px}
.ck-top::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:2px;background:linear-gradient(90deg,transparent 8%,rgba(255,170,68,.55) 30%,rgba(255,170,68,.55) 70%,transparent 92%)}
.ck-vent{flex:1;height:14px;display:flex;gap:3px;align-items:center;justify-content:center;overflow:hidden}
.ck-vent span{flex:0 0 3px;height:100%;background:rgba(255,170,68,.42);border-radius:1px;box-shadow:0 0 4px rgba(255,170,68,.4)}
.ck-vent span:nth-child(3n){background:rgba(0,214,143,.55);box-shadow:0 0 4px rgba(0,214,143,.5)}
.ck-vent span:nth-child(7n){background:rgba(92,196,255,.6);box-shadow:0 0 4px rgba(92,196,255,.5)}
.ck-ship-tag{font-size:11px;font-weight:700;letter-spacing:3px;color:rgba(255,170,68,.85);text-shadow:0 0 8px rgba(255,170,68,.5);padding:0 22px;border-left:1px solid #2a3245;border-right:1px solid #2a3245;display:flex;align-items:center;gap:14px;white-space:nowrap;height:32px}
.ck-ship-tag .pulse{width:8px;height:8px;border-radius:50%;background:#00d68f;box-shadow:0 0 8px #00d68f;animation:ledP 2s ease-in-out infinite}
.ck-ship-tag small{font-size:9px;color:rgba(180,200,220,.5);letter-spacing:2px;font-weight:500}
@keyframes ledP{0%,100%{opacity:1}50%{opacity:.35}}
.dial{width:128px;height:128px;border-radius:50%;background:radial-gradient(circle at 50% 30%,#1a2030 0%,#0a0d18 70%);border:2px solid #1a2330;box-shadow:inset 0 0 22px rgba(0,0,0,.75),0 6px 14px rgba(0,0,0,.55),0 0 0 1px rgba(255,170,68,.15);position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;flex-shrink:0}
.dial::before{content:'';position:absolute;inset:7px;border-radius:50%;border:1px solid rgba(255,170,68,.32);box-shadow:inset 0 0 10px rgba(255,170,68,.1)}
.dial::after{content:'';position:absolute;inset:14px;border-radius:50%;border:1px dashed rgba(255,170,68,.18);background:radial-gradient(circle,transparent 60%,rgba(255,170,68,.04) 100%)}
.dial-label{font-size:8px;letter-spacing:2.5px;color:rgba(255,170,68,.75);text-transform:uppercase;font-weight:700;margin-bottom:3px;position:relative;z-index:1}
.dial-value{font-size:26px;font-weight:700;color:#ffb858;text-shadow:0 0 12px rgba(255,170,68,.65);font-variant-numeric:tabular-nums;font-family:var(--mono);line-height:1;position:relative;z-index:1}
.dial-value small{font-size:13px;opacity:.8;font-weight:500;letter-spacing:1px}
.dial-unit{font-size:9px;color:rgba(255,170,68,.55);letter-spacing:1.5px;margin-top:3px;text-transform:uppercase;position:relative;z-index:1}
.dial-tick{position:absolute;top:50%;left:50%;width:2px;height:54px;transform-origin:bottom center;background:linear-gradient(to top,#00d68f,transparent 80%);box-shadow:0 0 6px #00d68f;border-radius:1px;transform:translate(-50%,-100%) rotate(var(--a,30deg));z-index:0}
.ck-dash{position:absolute;bottom:0;left:0;right:0;height:280px;background:linear-gradient(180deg,#0a0d18 0%,#0c1018 50%,#050810 100%);border-top:2px solid #1a2330;box-shadow:0 -8px 28px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,170,68,.16)}
.ck-dash::before{content:'';position:absolute;top:-2px;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 5%,rgba(255,170,68,.55) 20%,rgba(255,170,68,.55) 80%,transparent 95%)}
.ck-dash-inner{position:relative;height:100%;display:flex;flex-direction:column;padding:20px 6% 16px}
.ck-cluster{display:flex;align-items:center;gap:18px;flex:1;min-height:0}
.center-display{flex:1;align-self:stretch;background:linear-gradient(180deg,#06080e 0%,#0a0d14 100%);border:1px solid #2a3245;border-radius:6px;padding:10px 14px;position:relative;display:flex;flex-direction:column;gap:6px;box-shadow:inset 0 0 28px rgba(0,214,143,.06),0 0 16px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.04);overflow:hidden}
.center-display::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.18) 3px,rgba(0,0,0,.18) 4px);pointer-events:none;border-radius:6px}
.center-display > *{position:relative;z-index:1}
.cd-poi{display:flex;flex-direction:column;align-items:center;text-align:center;padding-bottom:6px;border-bottom:1px dashed rgba(255,170,68,.25);transition:opacity .6s ease}
.cd-poi-kicker{font-family:var(--mono);font-size:8px;letter-spacing:3.2px;color:rgba(255,170,68,.7);text-transform:uppercase;margin-bottom:1px}
.cd-poi-text{font-family:var(--font);font-size:14px;font-weight:600;color:rgba(255,255,255,.92);text-shadow:0 0 10px rgba(255,170,68,.3);letter-spacing:.4px}
.cd-cell{display:flex;flex-direction:column;align-items:center;text-align:center;padding:4px 2px;border-right:1px solid rgba(0,214,143,.1);border-bottom:1px solid rgba(0,214,143,.1)}
.cd-cell:nth-child(4n){border-right:none}
.cd-cell:nth-child(n+5){border-bottom:none}
.cd-label{font-size:8px;letter-spacing:1.8px;color:rgba(220,120,255,.75);text-transform:uppercase;margin-bottom:2px}
.cd-value{font-size:13px;font-weight:700;color:rgba(120,255,200,.95);text-shadow:0 0 8px rgba(0,214,143,.45);font-family:var(--mono);font-variant-numeric:tabular-nums;line-height:1.1}
.cd-value small{font-size:9px;opacity:.6;letter-spacing:1px;font-weight:500}
.cd-mid{display:flex;gap:12px;flex:1;min-height:0;align-items:stretch}
.cd-readouts{flex:1;display:grid;grid-template-columns:repeat(4,1fr);align-content:center;gap:0}
.scope{position:relative;flex-shrink:0;width:96px;height:96px;border-radius:50%;border:1px solid rgba(0,214,143,.32);background:radial-gradient(circle at 50% 50%,rgba(0,214,143,.06) 0%,transparent 70%);box-shadow:0 0 18px rgba(0,214,143,.1),inset 0 0 14px rgba(0,214,143,.08)}
.scope::before,.scope::after{content:'';position:absolute;border-radius:50%;pointer-events:none}
.scope::before{inset:13%;border:1px dashed rgba(0,214,143,.18)}
.scope::after{inset:36%;border:1px solid rgba(0,214,143,.25)}
.scope-sweep{position:absolute;top:50%;left:50%;width:50%;height:1px;transform-origin:left center;background:linear-gradient(90deg,rgba(0,214,143,.85),transparent);box-shadow:0 0 6px rgba(0,214,143,.6);animation:sweep 5s linear infinite}
@keyframes sweep{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.scope-cross::before,.scope-cross::after{content:'';position:absolute;background:rgba(0,214,143,.14)}
.scope-cross::before{left:50%;top:0;bottom:0;width:1px}
.scope-cross::after{top:50%;left:0;right:0;height:1px}
.scope-self{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:#fff;box-shadow:0 0 8px #fff;transform:translate(-50%,-50%);z-index:2}
.scope-blip{position:absolute;width:4px;height:4px;border-radius:50%;background:#ffaa44;box-shadow:0 0 5px #ffaa44;transform:translate(-50%,-50%)}
.scope-b1{left:72%;top:32%;animation:blipA 7s ease-in-out infinite}
.scope-b2{left:28%;top:65%;animation:blipB 11s ease-in-out infinite;background:#5cc4ff;box-shadow:0 0 5px #5cc4ff}
.scope-b3{left:58%;top:78%;animation:blipA 9s ease-in-out -3s infinite}
@keyframes blipA{0%,100%{opacity:0}30%,60%{opacity:1}}
@keyframes blipB{0%,100%{opacity:.2}40%,80%{opacity:.9}}
.ck-bottom-strip{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-top:14px;height:74px}
.btn-grid{display:grid;grid-template-columns:repeat(6,18px);grid-template-rows:repeat(2,1fr);gap:3px;height:42px;align-self:flex-start;margin-top:14px}
.btn{background:linear-gradient(180deg,#1a2030,#0a0d18);border:1px solid #2a3245;border-radius:2px;position:relative;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}
.btn.amber{background:linear-gradient(180deg,#3a1f08,#1a0d05);border-color:#5a3010;box-shadow:inset 0 0 6px rgba(255,140,40,.4),0 0 4px rgba(255,140,40,.18)}
.btn.amber::after{content:'';position:absolute;left:4px;right:4px;top:50%;transform:translateY(-50%);height:2px;background:#ffaa44;border-radius:1px;box-shadow:0 0 4px #ffaa44}
.btn.amber.lit::after{background:#ffe0a0;box-shadow:0 0 8px #ffe0a0}
.btn.green{background:linear-gradient(180deg,#0a3a25,#051a10);border-color:#1a5a3a}
.btn.green::after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:5px;height:5px;border-radius:50%;background:#00d68f;box-shadow:0 0 5px #00d68f}
.btn.red{background:linear-gradient(180deg,#3a0a0a,#1a0505);border-color:#5a1a1a}
.btn.red::after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:5px;height:5px;border-radius:50%;background:#ff4a4a;box-shadow:0 0 5px #ff4a4a;animation:ledP 1.8s ease-in-out infinite}
.btn.toggle{background:linear-gradient(180deg,#252a35,#0a0d14);border-color:#454a55}
.btn.toggle::after{content:'';position:absolute;left:50%;top:30%;transform:translateX(-50%);width:4px;height:8px;border-radius:1px;background:linear-gradient(180deg,#c0c0d0,#606070)}
.yoke-stick{position:relative;width:74px;height:104px;flex-shrink:0}
.yoke-stick .base{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:88px;height:30px;background:linear-gradient(180deg,#2a3040,#0e1218);border:1px solid #2a3245;border-radius:18px 18px 4px 4px;box-shadow:0 4px 10px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06)}
.yoke-stick .base::before{content:'';position:absolute;top:6px;left:50%;transform:translateX(-50%);width:50px;height:3px;background:#00d68f;border-radius:2px;box-shadow:0 0 4px rgba(0,214,143,.6);opacity:.7}
.yoke-stick .shaft{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);width:13px;height:42px;background:linear-gradient(90deg,#15191f 0%,#3a4255 50%,#15191f 100%);border-radius:3px;box-shadow:inset 0 0 4px rgba(0,0,0,.5)}
.yoke-stick .grip{position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:44px;height:44px;background:linear-gradient(180deg,#252a35 0%,#15191f 100%);border:1px solid #353a45;border-radius:10px 10px 5px 5px;box-shadow:0 -3px 8px rgba(0,0,0,.5),inset 0 0 8px rgba(0,0,0,.5)}
.yoke-stick .grip::before{content:'';position:absolute;top:6px;left:50%;transform:translateX(-50%);width:10px;height:10px;border-radius:50%;background:#ff4a4a;box-shadow:0 0 7px #ff4a4a;animation:ledP 1.5s ease-in-out infinite}
.yoke-stick .grip::after{content:'';position:absolute;top:24px;left:9px;right:9px;height:2px;background:#00d68f;border-radius:1px;box-shadow:0 0 4px #00d68f}
.poi-banner{position:absolute;top:68px;left:50%;transform:translateX(-50%);text-align:center;font-family:var(--font);transition:opacity .6s ease;z-index:14;pointer-events:none}
.exit{position:fixed;top:18px;right:18px;z-index:20;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.15);color:#e8e8f0;padding:8px 16px;border-radius:20px;font-family:var(--mono);font-size:11px;font-weight:600;letter-spacing:1.5px;cursor:pointer;backdrop-filter:blur(8px);transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;pointer-events:auto}
.exit:hover{background:rgba(255,107,107,.2);border-color:rgba(255,107,107,.5);color:#fff}
.intro{position:fixed;inset:0;z-index:50;background:radial-gradient(ellipse at center,rgba(10,8,24,.92) 0%,#000 80%);display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:24px;cursor:pointer;transition:opacity .8s ease,visibility .8s ease}
.intro.gone{opacity:0;visibility:hidden;pointer-events:none}
.intro-kicker{font-family:var(--mono);font-size:11px;letter-spacing:4px;color:rgba(108,92,231,.9);text-transform:uppercase;margin-bottom:14px}
.intro-title{font-family:var(--font);font-size:42px;font-weight:700;letter-spacing:-1px;margin-bottom:14px;max-width:640px;line-height:1.15;color:#e8e8f0}
.intro-sub{font-size:14px;color:rgba(180,180,210,.7);max-width:520px;line-height:1.6;margin-bottom:24px}
.intro-controls{display:grid;grid-template-columns:repeat(2,1fr);gap:10px 28px;font-family:var(--mono);font-size:11px;color:rgba(200,200,220,.8);text-align:left;margin:0 auto 28px;padding:18px 26px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;max-width:520px}
.intro-controls .row{display:flex;align-items:center;gap:10px}
.intro-controls kbd{font-family:var(--mono);font-size:10px;font-weight:700;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);padding:3px 7px;border-radius:4px;color:#fff;min-width:22px;text-align:center;letter-spacing:0;display:inline-block}
.intro-btn{padding:14px 32px;background:rgba(108,92,231,.15);border:1px solid rgba(108,92,231,.5);color:#fff;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:2px;border-radius:30px;cursor:pointer;transition:all .2s;backdrop-filter:blur(8px)}
.intro-btn:hover{background:var(--accent);box-shadow:0 0 30px rgba(108,92,231,.5)}
.intro-hint{margin-top:18px;font-family:var(--mono);font-size:10px;letter-spacing:2px;color:rgba(150,150,170,.5);text-transform:uppercase}
.pause{position:fixed;inset:0;z-index:40;background:rgba(5,5,15,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:24px;opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease;pointer-events:auto;cursor:pointer;color:#e8e8f0}
.pause.show{opacity:1;visibility:visible}
.pause-icon{font-size:42px;margin-bottom:14px;opacity:.7;animation:pauseBreath 3s ease-in-out infinite}
@keyframes pauseBreath{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.95;transform:scale(1.08)}}
.pause-title{font-size:24px;font-weight:600;letter-spacing:-.3px;margin-bottom:8px}
.pause-sub{font-size:13px;color:rgba(200,200,220,.65);max-width:380px;line-height:1.6}
.pause-cta{margin-top:24px;padding:12px 28px;background:rgba(108,92,231,.2);border:1px solid rgba(108,92,231,.5);color:#fff;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:2px;border-radius:30px;cursor:pointer}
.cursor-dot{position:fixed;width:14px;height:14px;border-radius:50%;border:1.5px solid rgba(180,220,255,.7);background:rgba(180,220,255,.15);box-shadow:0 0 10px rgba(180,220,255,.4);pointer-events:none;z-index:30;transform:translate(-50%,-50%);left:50%;top:50%;transition:border-color .15s,background .15s,box-shadow .15s}
.cursor-dot.rotating{border-color:rgba(255,170,60,.85);background:rgba(255,170,60,.15);box-shadow:0 0 12px rgba(255,170,60,.5)}
.cursor-dot::after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:3px;height:3px;border-radius:50%;background:rgba(180,220,255,.95);box-shadow:0 0 6px rgba(180,220,255,.8)}
.cursor-dot.rotating::after{background:rgba(255,220,140,.95);box-shadow:0 0 6px rgba(255,200,100,.9)}
.edge-hint{position:fixed;pointer-events:none;z-index:8;opacity:0;transition:opacity .2s}
.edge-hint.show{opacity:.55}
.edge-hint.top{top:0;left:0;right:0;height:90px;background:linear-gradient(to bottom,rgba(255,170,60,.25),transparent)}
.edge-hint.bottom{bottom:0;left:0;right:0;height:90px;background:linear-gradient(to top,rgba(255,170,60,.25),transparent)}
.edge-hint.left{top:0;bottom:0;left:0;width:90px;background:linear-gradient(to right,rgba(255,170,60,.25),transparent)}
.edge-hint.right{top:0;bottom:0;right:0;width:90px;background:linear-gradient(to left,rgba(255,170,60,.25),transparent)}
`;
