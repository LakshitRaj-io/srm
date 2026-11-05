// Runtime scene for the Blender models in public/models. Sources: assets-src/blender.
// One camera path runs from the SRM reveal past each building to a campus overview. Building
// positions are a composed arrangement, not a site plan. Frames render only when something moved.
import {
  BackSide, CatmullRomCurve3, Color, DirectionalLight, Group, HemisphereLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, MirroredRepeatWrapping, PCFShadowMap, PMREMGenerator,
  PerspectiveCamera, PlaneGeometry, SRGBColorSpace, Scene, ShaderMaterial, SphereGeometry, TextureLoader, Vector2, Vector3, WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const PLACE = {
  ub: { file: "university-building", pos: new Vector3(-132, -5, 12), rot: 0.24 },
  tp: { file: "tech-park", pos: new Vector3(0, 0, -30), rot: 0 },
  tp2: { file: "tech-park-2", pos: new Vector3(122, -5, -10), rot: -0.42 },
} as const;

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
// Camera keyframes: progress, eye, target. Eyes pull back on narrow screens so nothing clips.
const KEYS: [number, Vector3, Vector3][] = [
  [0.0, v(-118, 20, 205), v(-126, 29, 0)],
  [0.2, v(-120, 16, 172), v(-126, 29, 0)],
  [0.36, v(-232, 12, 132), v(-128, 27, -6)],
  [0.5, v(-58, 6, 150), v(0, 28, -20)],
  [0.62, v(-14, 5, 122), v(0, 29, -24)],
  [0.74, v(36, 10, 158), v(116, 27, 0)],
  [0.86, v(84, 12, 150), v(124, 27, -6)],
  [1.0, v(0, 100, 300), v(0, 22, -30)],
];

export function createCampusScene(canvas: HTMLCanvasElement, opts: { small: boolean }) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.small ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  let dirty = true;
  let target = 0;
  let cur = 0;
  const pointer = new Vector2();
  const aim = new Vector2();
  let running = false;
  let raf = 0;

  const scene = new Scene();
  const camera = new PerspectiveCamera(36, 1, 1, 3000);

  // Same blue as the Blender renders and the hero sky.
  const skyMat = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: { top: { value: new Color("#4f8fd8") }, low: { value: new Color("#e9f2f9") } },
    vertexShader: "varying vec3 p; void main(){ p=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 low; varying vec3 p; void main(){ float t=pow(clamp(p.y*1.5+0.02,0.0,1.0),0.7); gl_FragColor=vec4(mix(low,top,t),1.0); \n#include <colorspace_fragment>\n }",
  });
  const sky = new Mesh(new SphereGeometry(1500, 32, 16), skyMat);
  scene.add(sky);

  // Glass reflects the sky.
  const pm = new PMREMGenerator(renderer);
  const skyOnly = new Scene();
  skyOnly.add(sky.clone());
  scene.environment = pm.fromScene(skyOnly, 0.02).texture;
  scene.environmentIntensity = 0.55;
  pm.dispose();

  scene.add(new HemisphereLight("#ffffff", "#8d9a7c", 1.5));
  const sun = new DirectionalLight("#fff4e4", 2.1);
  sun.position.set(-190, 260, 300);
  sun.target.position.set(0, 0, -20);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(opts.small ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -240, right: 240, top: 170, bottom: -170, near: 40, far: 900 });
  sun.shadow.bias = -0.0006;
  scene.add(sun, sun.target);

  const ground = new Mesh(new PlaneGeometry(3000, 3000), new MeshStandardMaterial({ color: "#9bc184", roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5.05;
  ground.receiveShadow = true;
  scene.add(ground);

  // Official campus trees, cut from the University Building photograph, as distant planting.
  new TextureLoader().load("/images/ub/trees.webp", (t) => {
    t.colorSpace = SRGBColorSpace;
    t.repeat.set(0.5, 0.3);
    t.offset.set(0.12, 0);
    const m = new MeshBasicMaterial({ map: t, transparent: true, alphaTest: 0.4 });
    for (const [x, z, w, r] of [[-290, -130, 320, 0.2], [-20, -175, 460, 0], [320, -125, 320, -0.25]] as const) {
      const b = new Mesh(new PlaneGeometry(w, w * 0.2), m);
      b.position.set(x, -5 + w * 0.1, z);
      b.rotation.y = r;
      scene.add(b);
    }
    dirty = true;
  });

  // Lawn from the official drone view of the Tech Park forecourt.
  new TextureLoader().load("/images/campus/lawn.jpg", (t) => {
    t.colorSpace = SRGBColorSpace;
    t.wrapS = t.wrapT = MirroredRepeatWrapping;
    t.repeat.set(26, 26);
    t.anisotropy = opts.small ? 4 : 8;
    const gm = ground.material as MeshStandardMaterial;
    gm.map = t;
    gm.color.set("#ffffff");
    gm.needsUpdate = true;
    dirty = true;
  });

  const suffix = opts.small ? "-sm" : "";
  const loader = new GLTFLoader();
  const load = async (key: keyof typeof PLACE) => {
    const p = PLACE[key];
    const g = await loader.loadAsync(`/models/${p.file}${suffix}.glb`);
    const root = new Group();
    root.add(g.scene);
    root.position.copy(p.pos);
    root.rotation.y = p.rot;
    root.traverse((o) => {
      if ((o as Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        const m = (o as Mesh).material as MeshStandardMaterial;
        if (m.map) m.map.anisotropy = opts.small ? 4 : 8;
      }
    });
    scene.add(root);
    renderer.shadowMap.needsUpdate = true;
    dirty = true;
  };

  let eye: CatmullRomCurve3;
  let look: CatmullRomCurve3;
  let fit = 1;
  let lift = 0;
  const times = KEYS.map((k) => k[0]);
  const keyT = (p: number) => {
    let i = 0;
    while (i < times.length - 2 && p > times[i + 1]) i++;
    const f = clamp((p - times[i]) / (times[i + 1] - times[i]));
    return (i + f * f * (3 - 2 * f)) / (times.length - 1);
  };
  const a = new Vector3();
  const b = new Vector3();

  function place(p: number) {
    const t = keyT(p);
    eye.getPoint(t, a);
    look.getPoint(t, b);
    b.y -= lift;
    a.sub(b).multiplyScalar(fit).add(b);
    a.x += pointer.x * 3;
    a.y = Math.max(-2.5, a.y + pointer.y * 1.5);
    camera.position.copy(a);
    camera.lookAt(b);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit = clamp(1.4 / camera.aspect, 1, 2.05);
    lift = (fit - 1) * 15; // on tall screens, sit the buildings above the controls
    eye = new CatmullRomCurve3(KEYS.map((k) => k[1]), false, "centripetal");
    look = new CatmullRomCurve3(KEYS.map((k) => k[2]), false, "centripetal");
    dirty = true;
  }
  resize();

  const ready = load("ub").then(() => Promise.all([load("tp"), load("tp2")]));

  function frame() {
    raf = requestAnimationFrame(frame);
    const dp = target - cur;
    const dm = aim.distanceTo(pointer);
    if (Math.abs(dp) < 0.00004 && dm < 0.002 && !dirty) return;
    cur += dp * 0.16;
    pointer.lerp(aim, 0.07);
    place(cur);
    renderer.render(scene, camera);
    dirty = false;
  }

  return {
    ready,
    resize,
    setRunning(on: boolean) {
      if (on === running) return;
      running = on;
      if (on) { dirty = true; raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
    },
    setProgress(p: number) { target = clamp(p); },
    setPointer(x: number, y: number) { aim.set(x, y); },
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose();
        const list = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        for (const x of list) {
          (x as MeshStandardMaterial).map?.dispose();
          x.dispose();
        }
      });
      renderer.dispose();
    },
  };
}

export type CampusScene = ReturnType<typeof createCampusScene>;
