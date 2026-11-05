// A single Blender model on a transparent canvas, drawn only when something changes. Loaded with a
// dynamic import, so three.js never ships with the first page load. Sources: assets-src/blender.
import {
  Box3, CanvasTexture, Color, DirectionalLight, Group, HemisphereLight, Mesh, MeshBasicMaterial, MeshStandardMaterial, PMREMGenerator, PerspectiveCamera,
  PlaneGeometry, SRGBColorSpace, Scene, Vector3, WebGLRenderer, type Object3D,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// Only the front and one side of each building are documented, so turning stops before the rear.
export const YAW_LIMIT = 0.95;
const START_YAW = -0.5;

function contactShadow() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(128, 128, 20, 128, 128, 128);
  r.addColorStop(0, "rgba(0,0,0,0.34)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
}

function free(o: Object3D) {
  o.traverse((x) => {
    const m = x as Mesh;
    m.geometry?.dispose();
    for (const mat of [m.material].flat()) {
      if (!mat) continue;
      (mat as MeshStandardMaterial).map?.dispose();
      mat.dispose();
    }
  });
}

export function createModelView(canvas: HTMLCanvasElement, opts: { small: boolean }) {
  let dirty = true;
  let yaw = START_YAW;
  let aim = START_YAW;
  let raf = 0;
  let running = false;
  let radius = 60;
  let height = 64;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !opts.small, powerPreference: opts.small ? "low-power" : "default" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.small ? 1.25 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearAlpha(0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(26, 1, 5, 2000);

  // A plain sky for the glass to reflect.
  const pm = new PMREMGenerator(renderer);
  const sky = new Scene();
  sky.background = new Color("#a9cbef");
  scene.environment = pm.fromScene(sky, 0.04).texture;
  scene.environmentIntensity = 0.6;
  pm.dispose();

  scene.add(new HemisphereLight("#ffffff", "#b9b3a6", 1.7));
  const sun = new DirectionalLight("#fff4e4", 1.9);
  sun.position.set(-160, 240, 300);
  scene.add(sun);

  const pivot = new Group();
  scene.add(pivot);
  const shadowTex = contactShadow();
  const shadow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  let current: Object3D | null = null;
  const loader = new GLTFLoader();

  function frameCamera() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = (camera.fov * Math.PI) / 360;
    const fitV = (height * 0.62) / Math.tan(half);
    const fitH = (radius * 1.08) / (Math.tan(half) * camera.aspect);
    camera.position.set(0, height * 0.3, Math.max(fitV, fitH) + radius * 0.5);
    camera.lookAt(0, height * 0.47, 0);
    camera.updateProjectionMatrix();
    dirty = true;
  }

  async function show(file: string) {
    const g = await loader.loadAsync(`/models/${file}${opts.small ? "-sm" : ""}.glb`);
    if (current) { pivot.remove(current); free(current); }
    current = g.scene;
    const box = new Box3().setFromObject(current);
    const size = box.getSize(new Vector3());
    const mid = box.getCenter(new Vector3());
    current.position.set(-mid.x, -box.min.y, -mid.z);
    pivot.add(current);
    height = size.y;
    radius = Math.hypot(size.x, size.z) / 2;
    shadow.scale.set(radius * 2.7, radius * 2.7, 1);
    shadow.position.y = 0.05;
    current.traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | undefined;
      if (m?.map) m.map.anisotropy = opts.small ? 2 : 8;
    });
    yaw = aim = START_YAW;
    frameCamera();
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    const delta = aim - yaw;
    if (Math.abs(delta) < 0.0005 && !dirty) return;
    yaw += delta * 0.18;
    pivot.rotation.y = yaw;
    renderer.render(scene, camera);
    dirty = false;
  }

  return {
    show,
    resize: frameCamera,
    turn(by: number) { aim = Math.max(-YAW_LIMIT, Math.min(YAW_LIMIT, aim + by)); },
    setRunning(on: boolean) {
      if (on === running) return;
      running = on;
      if (on) { dirty = true; raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
    },
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      if (current) free(current);
      shadowTex.dispose();
      renderer.dispose();
    },
  };
}

export type ModelView = ReturnType<typeof createModelView>;
