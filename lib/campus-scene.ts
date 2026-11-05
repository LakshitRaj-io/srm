// Three.js scene for the homepage campus reveal. Loaded with a dynamic import, only on capable
// screens, so none of this ships to phones or in the initial bundle.
//
// The buildings are stylised reconstructions, not survey models:
// - University Building and Tech Park follow SRMIST's official photographs (structure-and-
//   infrastructure PDF; Tech Park facade photo) and the official floor counts (G+15 each).
//   Footprints are derived from official built-up area / floors, so proportions are approximate.
// - Tech Park 2 is a translucent placeholder volume with outlined edges: no verified exterior
//   reference was available, so it deliberately has no invented facade.
// - Positions are schematic. The lake nods to the official aerial photograph.
import {
  ACESFilmicToneMapping, AmbientLight, BoxGeometry, CanvasTexture, Color, ConeGeometry, DirectionalLight,
  EdgesGeometry, FogExp2, Group, HemisphereLight, InstancedMesh, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial,
  Object3D, PCFShadowMap, PerspectiveCamera, PlaneGeometry, RepeatWrapping, SRGBColorSpace, Scene, Vector3, WebGLRenderer,
  type Material, type Texture,
} from "three";

export type Stop = "intro" | "overview" | "ub" | "tp" | "tp2";
type Shot = { pos: Vector3; look: Vector3 };

const FLOOR = 4; // metres per storey, used only to turn floor counts into heights
const H15 = 16 * FLOOR; // G+15

// Schematic layout (metres).
const UB = { x: -95, z: 10, w: 52, d: 52, h: H15 };
const TP = { x: 25, z: -35, w: 84, d: 22, h: H15 };
const TP2 = { x: 120, z: 45, w: 40, d: 30, h: 9 * FLOOR };

const SHOTS: Record<Stop, Shot> = {
  intro: { pos: new Vector3(0, 420, 520), look: new Vector3(0, 0, 0) },
  overview: { pos: new Vector3(30, 230, 400), look: new Vector3(15, 55, 0) },
  ub: closeUp(UB, 140, 44, 215),
  tp: closeUp(TP, -45, 34, 175),
  tp2: closeUp(TP2, 95, 34, 130),
};

// A close-up that leaves the building right of centre, clear of the info card on the left.
function closeUp(b: { x: number; z: number; h: number }, dx: number, y: number, dz: number): Shot {
  const pos = new Vector3(b.x + dx, y, b.z + dz);
  const target = new Vector3(b.x, b.h * 0.5, b.z);
  const fwd = target.clone().sub(pos).setY(0).normalize();
  const right = new Vector3(-fwd.z, 0, fwd.x);
  return { pos, look: target.addScaledVector(right, -0.22 * pos.distanceTo(target)) };
}

export const ANCHORS: Record<"ub" | "tp" | "tp2", Vector3> = {
  ub: new Vector3(UB.x, UB.h + 10, UB.z),
  tp: new Vector3(TP.x, TP.h + 10, TP.z),
  tp2: new Vector3(TP2.x, TP2.h + 10, TP2.z),
};

// ---------- Procedural facade textures (drawn from the official photographs' layout) ----------
function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rx = 1, ry = 1): Texture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 4;
  return t;
}

// University Building: pale rose walls, bays of tall round-headed blue windows, cornice bands,
// and a glazed ground floor.
function ubFacade() {
  return canvasTex(512, 1024, (g) => {
    g.fillStyle = "#f0ddd9";
    g.fillRect(0, 0, 512, 1024);
    const glass = "#2f4f9a";
    // Three tiers of tall arched windows, five bays per face.
    const tiers = [[60, 300], [340, 300], [640, 300]];
    for (const [top, hgt] of tiers) {
      for (let b = 0; b < 5; b++) {
        const x = 26 + b * 98;
        for (let k = 0; k < 3; k++) {
          const wx = x + k * 24;
          g.fillStyle = glass;
          g.beginPath();
          g.moveTo(wx, top + hgt);
          g.lineTo(wx, top + 9);
          g.arc(wx + 8, top + 9, 8, Math.PI, 0);
          g.lineTo(wx + 16, top + hgt);
          g.closePath();
          g.fill();
        }
      }
      g.fillStyle = "#fbf3f1";
      g.fillRect(0, top + hgt + 6, 512, 10);
    }
    g.fillStyle = "#fbf3f1";
    g.fillRect(0, 20, 512, 16);
    g.fillStyle = "#3d64b3";
    g.fillRect(0, 960, 512, 64);
    g.fillStyle = "#e6cfcb";
    for (let x = 0; x < 512; x += 64) g.fillRect(x, 960, 6, 64);
  });
}

// Tech Park centre: yellow frame around a blue curtain-wall grid.
function tpCentre() {
  return canvasTex(512, 1024, (g) => {
    g.fillStyle = "#f3c80f";
    g.fillRect(0, 0, 512, 1024);
    g.fillStyle = "#2547a8";
    g.fillRect(56, 70, 400, 900);
    g.strokeStyle = "#6f8fe0";
    g.lineWidth = 3;
    for (let x = 56; x <= 456; x += 50) { g.beginPath(); g.moveTo(x, 70); g.lineTo(x, 970); g.stroke(); }
    for (let y = 70; y <= 970; y += 56) { g.beginPath(); g.moveTo(56, y); g.lineTo(456, y); g.stroke(); }
  });
}

// Tech Park outer wings: blue glass with thick white vertical mullions.
function tpBlue() {
  return canvasTex(256, 1024, (g) => {
    g.fillStyle = "#1f3f9e";
    g.fillRect(0, 0, 256, 1024);
    g.fillStyle = "#f4f6fa";
    for (let x = 0; x < 256; x += 42) g.fillRect(x, 0, 10, 1024);
    g.fillStyle = "rgba(255,255,255,0.18)";
    for (let y = 0; y < 1024; y += 64) g.fillRect(0, y, 256, 3);
  });
}

// Tech Park white wings: horizontal ribbon windows.
function tpWhite() {
  return canvasTex(256, 1024, (g) => {
    g.fillStyle = "#f2f2ee";
    g.fillRect(0, 0, 256, 1024);
    g.fillStyle = "#1c2b55";
    for (let y = 30; y < 1024; y += 64) g.fillRect(36, y, 184, 22);
  });
}

// ---------- Scene ----------
export function createCampusScene(canvas: HTMLCanvasElement, opts: { reduced: boolean; onPins: (pins: Record<string, { x: number; y: number; on: boolean }>) => void }) {
  const wide = window.innerWidth >= 1200;
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const sky = new Color("#0d1b33");
  scene.background = sky;
  scene.fog = new FogExp2(sky.getHex(), 0.0014);

  const camera = new PerspectiveCamera(42, 1, 1, 3000);
  camera.position.copy(SHOTS.intro.pos);
  const look = SHOTS.intro.look.clone();
  camera.lookAt(look);

  scene.add(new HemisphereLight("#cfe0ff", "#20321f", 1.1));
  scene.add(new AmbientLight("#ffffff", 0.25));
  const sun = new DirectionalLight("#ffe7c2", 2.6);
  sun.position.set(260, 380, 220);
  sun.castShadow = true;
  sun.shadow.mapSize.set(wide ? 2048 : 1024, wide ? 2048 : 1024);
  Object.assign(sun.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 50, far: 1200 });
  scene.add(sun);

  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };
  const mat = (o: ConstructorParameters<typeof MeshStandardMaterial>[0]) => keep(new MeshStandardMaterial(o));
  const box = (w: number, h: number, d: number) => keep(new BoxGeometry(w, h, d));

  // Ground, paths and lake.
  const ground = new Mesh(keep(new PlaneGeometry(2400, 2400)), mat({ color: "#1d3a26", roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const pathMat = mat({ color: "#59606b", roughness: 0.95 });
  for (const [x, z, w, d] of [[0, 70, 520, 10], [-30, -10, 10, 260], [70, 5, 10, 160]] as const) {
    const p = new Mesh(box(w, 0.4, d), pathMat);
    p.position.set(x, 0.2, z);
    p.receiveShadow = true;
    scene.add(p);
  }
  const lake = new Mesh(keep(new PlaneGeometry(1400, 320)), mat({ color: "#0b2a4a", roughness: 0.15, metalness: 0.4 }));
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(0, 0.3, 300);
  scene.add(lake);

  // Trees: one instanced mesh, kept away from the buildings.
  const trees = new InstancedMesh(keep(new ConeGeometry(5, 16, 7)), mat({ color: "#27573a", roughness: 1 }), wide ? 90 : 60);
  const trunkless = new Object3D();
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let placed = 0;
  while (placed < trees.count) {
    const x = (rnd() - 0.5) * 560;
    const z = (rnd() - 0.5) * 360;
    const clear = [UB, TP, TP2].every((b) => Math.abs(x - b.x) > b.w / 2 + 14 || Math.abs(z - b.z) > b.d / 2 + 14) && Math.abs(z - 70) > 10 && z < 130;
    if (!clear) continue;
    const s = 0.6 + rnd() * 0.6;
    trunkless.position.set(x, 8 * s, z);
    trunkless.scale.setScalar(s);
    trunkless.updateMatrix();
    trees.setMatrixAt(placed++, trunkless.matrix);
  }
  trees.castShadow = true;
  scene.add(trees);

  const solid = (g: Group, w: number, h: number, d: number, m: Material | Material[], x = 0, y = 0, z = 0) => {
    const mesh = new Mesh(box(w, h, d), m);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
    return mesh;
  };

  // University Building.
  const ub = new Group();
  const ubTex = keep(ubFacade());
  const ubSide = mat({ map: ubTex, roughness: 0.75 });
  const ubTop = mat({ color: "#e9d3cf", roughness: 0.9 });
  solid(ub, UB.w, UB.h, UB.d, [ubSide, ubSide, ubTop, ubTop, ubSide, ubSide]);
  solid(ub, UB.w * 0.42, 6, UB.d * 0.42, mat({ color: "#f6ebe8", roughness: 0.8 }), 0, UB.h, 0);
  ub.position.set(UB.x, 0, UB.z);
  ub.rotation.y = 0.12;
  scene.add(ub);

  // Tech Park: blue wing | white wing | red strip | yellow-framed centre | red strip | white wing | blue wing.
  const tp = new Group();
  const blue = mat({ map: keep(tpBlue()), roughness: 0.25, metalness: 0.35 });
  const white = mat({ map: keep(tpWhite()), roughness: 0.85 });
  const centre = mat({ map: keep(tpCentre()), roughness: 0.35, metalness: 0.2 });
  const red = mat({ color: "#d63a2c", roughness: 0.6 });
  const roofGrey = mat({ color: "#d9dbe0", roughness: 0.9 });
  const faces = (side: Material) => [roofGrey, roofGrey, roofGrey, roofGrey, side, side];
  const parts: [number, Material, number][] = [[14, blue, TP.h - 6], [14, white, TP.h - 2], [4, red, TP.h + 2], [22, centre, TP.h + 3], [4, red, TP.h + 2], [14, white, TP.h - 2], [14, blue, TP.h - 6]];
  let cx = -TP.w / 2;
  for (const [w, m, h] of parts) {
    const isRed = m === red;
    solid(tp, w, h, isRed ? TP.d + 2 : TP.d, isRed ? red : faces(m), cx + w / 2, 0, 0);
    cx += w;
  }
  solid(tp, 26, 2.5, TP.d + 3, red, 0, TP.h + 3, 0); // red roof cap over the centre
  tp.position.set(TP.x, 0, TP.z);
  scene.add(tp);

  // Tech Park 2: honest placeholder volume, outlined.
  const tp2 = new Group();
  const ghostGeo = box(TP2.w, TP2.h, TP2.d);
  const ghost = new Mesh(ghostGeo, mat({ color: "#a9c2e8", transparent: true, opacity: 0.28, roughness: 0.2, metalness: 0.1, depthWrite: false }));
  ghost.position.y = TP2.h / 2;
  tp2.add(ghost);
  const edges = new LineSegments(keep(new EdgesGeometry(ghostGeo)), keep(new LineBasicMaterial({ color: "#dbe7ff", transparent: true, opacity: 0.9 })));
  edges.position.y = TP2.h / 2;
  tp2.add(edges);
  for (let i = 1; i < 9; i++) {
    const band = new LineSegments(keep(new EdgesGeometry(keep(new BoxGeometry(TP2.w, 0.01, TP2.d)))), keep(new LineBasicMaterial({ color: "#dbe7ff", transparent: true, opacity: 0.25 })));
    band.position.y = i * FLOOR;
    tp2.add(band);
  }
  tp2.position.set(TP2.x, 0, TP2.z);
  scene.add(tp2);

  // Base plinths so buildings sit on the ground.
  const plinth = mat({ color: "#8b8f96", roughness: 0.9 });
  for (const b of [UB, TP, TP2]) {
    const p = new Mesh(box(b.w + 16, 0.6, b.d + 16), plinth);
    p.position.set(b.x, 0.3, b.z);
    p.receiveShadow = true;
    scene.add(p);
  }

  // ---------- Camera animation ----------
  let from: Shot = { pos: camera.position.clone(), look: look.clone() };
  let to: Shot = from;
  let t0 = 0;
  let dur = 0;
  let arc = 0;
  let resolve: (() => void) | null = null;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function flyTo(stop: Stop, instant = opts.reduced, ms = 2400): Promise<void> {
    resolve?.();
    from = { pos: camera.position.clone(), look: look.clone() };
    to = SHOTS[stop];
    arc = from.pos.distanceTo(to.pos) > 120 ? 40 : 0;
    t0 = performance.now();
    dur = instant ? 0 : ms;
    return new Promise((r) => { resolve = r; });
  }

  // Cinematic intro: aerial → each building → overview. Each stop calls back for its label.
  let run = 0;
  async function playIntro(onStop: (s: Stop) => void) {
    const me = ++run;
    const cancelled = () => me !== run;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    camera.position.copy(SHOTS.intro.pos);
    look.copy(SHOTS.intro.look);
    for (const [s, travel, hold] of [["ub", 3000, 1800], ["tp", 2200, 1800], ["tp2", 2000, 1700], ["overview", 2400, 0]] as const) {
      if (cancelled()) return;
      onStop(s);
      await flyTo(s, false, travel);
      if (cancelled()) return;
      await wait(hold);
    }
  }
  const cancelIntro = () => { run++; };

  // ---------- Loop ----------
  let running = false;
  let raf = 0;
  const v = new Vector3();
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (dur >= 0 && resolve) {
      const t = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      const k = ease(t);
      camera.position.lerpVectors(from.pos, to.pos, k);
      camera.position.y += Math.sin(Math.PI * k) * arc;
      look.lerpVectors(from.look, to.look, k);
      if (t >= 1) { const r = resolve; resolve = null; r(); }
    }
    camera.lookAt(look);
    renderer.render(scene, camera);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const pins: Record<string, { x: number; y: number; on: boolean }> = {};
    for (const [id, a] of Object.entries(ANCHORS)) {
      v.copy(a).project(camera);
      pins[id] = { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, on: v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 };
    }
    opts.onPins(pins);
  }
  function setRunning(on: boolean) {
    if (on === running) return;
    running = on;
    if (on) raf = requestAnimationFrame(frame);
    else cancelAnimationFrame(raf);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1.2 ? 52 : 42;
    camera.updateProjectionMatrix();
  }
  resize();

  function dispose() {
    setRunning(false);
    run++;
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
  }

  return { flyTo, playIntro, cancelIntro, setRunning, resize, dispose };
}

export type CampusScene = ReturnType<typeof createCampusScene>;
