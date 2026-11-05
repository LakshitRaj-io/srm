// The campus landmarks are positioned on one real, georeferenced OpenStreetMap tile.
import {
  Box3, BoxGeometry, Color, DoubleSide, Group, HemisphereLight, LinearFilter, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, PMREMGenerator, PerspectiveCamera, Raycaster, RingGeometry, SRGBColorSpace,
  Scene, TextureLoader, Vector2, Vector3, WebGLRenderer,
  type Object3D,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CAMPUS_MAP_TILE } from "@/data/campus";

type CampusId = "ub" | "tp" | "tp2";
type CampusAsset = { id: CampusId; file: string; mapPosition: { x: number; z: number } };
const COLORS: Record<CampusId, string> = { ub: "#0755b2", tp: "#e96612", tp2: "#d0a20a" };
const MAP_OVERVIEW = new Vector3(13, 0, -74);

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

export function createCampusMapView(canvas: HTMLCanvasElement, opts: { small: boolean }) {
  let dirty = true;
  let yaw = -0.12;
  let aim = yaw;
  let zoom = 1;
  let aimZoom = 1;
  let raf = 0;
  let running = false;
  let disposed = false;
  const target = MAP_OVERVIEW.clone();
  const aimTarget = MAP_OVERVIEW.clone();

  const renderer = new WebGLRenderer({ canvas, alpha: false, antialias: !opts.small, powerPreference: opts.small ? "low-power" : "default" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.small ? 1.25 : 1.65));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.background = new Color("#dce7e1");
  const camera = new PerspectiveCamera(38, 1, 0.1, 1800);

  const pm = new PMREMGenerator(renderer);
  const sky = new Scene();
  sky.background = new Color("#c7d9e8");
  const environment = pm.fromScene(sky, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.42;
  pm.dispose();

  scene.add(new HemisphereLight("#ffffff", "#949990", 1.65));

  const campus = new Group();
  scene.add(campus);

  // A thin map board gives the tile a clean edge. The visible ground is the OSM tile itself.
  const mapBase = new Mesh(new BoxGeometry(CAMPUS_MAP_TILE.size, 1.4, CAMPUS_MAP_TILE.size), new MeshStandardMaterial({ color: "#d9e1d9", roughness: 1 }));
  mapBase.position.y = -0.85;
  campus.add(mapBase);
  const mapMaterial = new MeshBasicMaterial({ color: "#f2f4ef", side: DoubleSide });
  const ground = new Mesh(new BoxGeometry(CAMPUS_MAP_TILE.size, 0.08, CAMPUS_MAP_TILE.size), mapMaterial);
  ground.position.y = -0.1;
  campus.add(ground);

  const tileUrl = `https://tile.openstreetmap.org/${CAMPUS_MAP_TILE.zoom}/${CAMPUS_MAP_TILE.x}/${CAMPUS_MAP_TILE.y}.png`;
  const tileLoader = new TextureLoader();
  tileLoader.setCrossOrigin("anonymous");
  tileLoader.load(tileUrl, (texture) => {
    if (disposed) { texture.dispose(); return; }
    texture.colorSpace = SRGBColorSpace;
    texture.magFilter = LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    mapMaterial.map = texture;
    mapMaterial.color.set("#ffffff");
    mapMaterial.needsUpdate = true;
    dirty = true;
  }, undefined, () => console.warn("[campus map] OpenStreetMap tile could not be loaded; showing the map surface without it."));

  const loader = new GLTFLoader();
  const loaded = new Map<CampusId, Group>();
  const rings = new Map<CampusId, Mesh>();
  const raycaster = new Raycaster();
  const pointer = new Vector2();

  function updateCamera() {
    camera.position.set(target.x + 225 / zoom, target.y + 202 / zoom, target.z + 265 / zoom);
    camera.lookAt(target.x, target.y + 11, target.z);
    camera.updateMatrixWorld();
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    updateCamera();
    dirty = true;
  }

  function focus(id: CampusId | null) {
    if (!id) {
      aimTarget.copy(MAP_OVERVIEW);
      aimZoom = 1;
      return;
    }
    const anchor = loaded.get(id);
    if (anchor) {
      campus.updateMatrixWorld(true);
      anchor.getWorldPosition(aimTarget);
      aimTarget.y = 0;
    }
    aimZoom = 1.35;
  }

  function select(id: CampusId) {
    for (const [key, ring] of rings) {
      const material = ring.material as MeshBasicMaterial;
      material.color.set(key === id ? "#f5bf35" : "#ffffff");
      material.opacity = key === id ? 0.96 : 0.56;
    }
    focus(id);
    dirty = true;
  }

  async function load(assets: CampusAsset[]) {
    const results = await Promise.all(assets.map(async (asset) => {
      const suffix = opts.small ? "-sm" : "";
      const gltf = await loader.loadAsync(`/models/${asset.file}${suffix}.glb`);
      return { asset, model: gltf.scene };
    }));
    if (disposed) {
      results.forEach(({ model }) => free(model));
      return;
    }

    results.forEach(({ asset, model }) => {
      const bounds = new Box3().setFromObject(model);
      const size = bounds.getSize(new Vector3());
      const center = bounds.getCenter(new Vector3());
      model.position.set(-center.x, -bounds.min.y, -center.z);
      model.userData.buildingId = asset.id;
      const anchor = new Group();
      anchor.position.set(asset.mapPosition.x, 0, asset.mapPosition.z);
      anchor.userData.buildingId = asset.id;
      anchor.add(model);
      loaded.set(asset.id, anchor);
      campus.add(anchor);

      const radius = Math.max(size.x, size.z) * 0.58 + 2;
      const ring = new Mesh(new RingGeometry(radius, radius + 1.5, 56), new MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.56, side: DoubleSide, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(asset.mapPosition.x, 0.16, asset.mapPosition.z);
      campus.add(ring);
      rings.set(asset.id, ring);

      const shadow = new Mesh(new BoxGeometry(Math.max(size.x * 0.78, 8), 0.12, Math.max(size.z * 0.78, 8)), new MeshBasicMaterial({ color: "#26382f", transparent: true, opacity: 0.22, depthWrite: false }));
      shadow.position.set(asset.mapPosition.x, 0.1, asset.mapPosition.z);
      campus.add(shadow);

      model.traverse((o) => {
        const mesh = o as Mesh;
        const materials = [mesh.material].flat();
        materials.forEach((material) => {
          if (!material) return;
          const textured = material as MeshStandardMaterial;
          if (textured.map) textured.map.anisotropy = opts.small ? 2 : 8;
        });
      });
    });
    resize();
  }

  function buildingAt(clientX: number, clientY: number): CampusId | null {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height || loaded.size === 0) return null;
    pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const roots = [...loaded.values()];
    const hit = raycaster.intersectObjects(roots, true)[0]?.object;
    let node: Object3D | null = hit ?? null;
    while (node && !node.userData.buildingId) node = node.parent;
    if (node?.userData.buildingId) return node.userData.buildingId as CampusId;

    // The models have transparent edges; accept taps inside their projected silhouette too.
    campus.updateMatrixWorld(true);
    camera.updateMatrixWorld();
    const candidates = [...loaded.entries()].map(([id, anchor]) => {
      const bounds = new Box3().setFromObject(anchor);
      const min = new Vector2(Infinity, Infinity);
      const max = new Vector2(-Infinity, -Infinity);
      for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
        const point = new Vector3(x, y, z).project(camera);
        min.x = Math.min(min.x, rect.left + ((point.x + 1) / 2) * rect.width);
        max.x = Math.max(max.x, rect.left + ((point.x + 1) / 2) * rect.width);
        min.y = Math.min(min.y, rect.top + ((1 - point.y) / 2) * rect.height);
        max.y = Math.max(max.y, rect.top + ((1 - point.y) / 2) * rect.height);
      }
      const inside = clientX >= min.x && clientX <= max.x && clientY >= min.y && clientY <= max.y;
      const dx = clientX - (min.x + max.x) / 2;
      const dy = clientY - (min.y + max.y) / 2;
      return { id, inside, distance: dx * dx + dy * dy };
    }).filter((candidate) => candidate.inside).sort((a, b) => a.distance - b.distance);
    return candidates[0]?.id ?? null;
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    const yawDelta = aim - yaw;
    if (Math.abs(yawDelta) > 0.0005) {
      yaw += yawDelta * 0.16;
      campus.rotation.y = yaw;
      dirty = true;
    }
    if (target.distanceToSquared(aimTarget) > 0.01) {
      target.lerp(aimTarget, 0.12);
      dirty = true;
    }
    if (Math.abs(zoom - aimZoom) > 0.001) {
      zoom += (aimZoom - zoom) * 0.12;
      dirty = true;
    }
    if (!dirty) return;
    updateCamera();
    renderer.render(scene, camera);
    dirty = false;
  }

  resize();
  return {
    load,
    select,
    buildingAt,
    resize,
    turn(by: number) { aim += by; },
    zoomBy(factor: number) { aimZoom = Math.min(1.85, Math.max(0.72, aimZoom * factor)); dirty = true; },
    overview() { focus(null); dirty = true; },
    setRunning(on: boolean) {
      if (on === running) return;
      running = on;
      if (on) { dirty = true; raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      running = false;
      free(campus);
      environment.dispose();
      renderer.dispose();
    },
  };
}

export type CampusMapView = ReturnType<typeof createCampusMapView>;
