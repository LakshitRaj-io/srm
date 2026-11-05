"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { BUILDINGS, CAMPUS_MAP_TILE, TOUR_URL, type BuildingId } from "@/data/campus";
import { useCalm } from "@/lib/calm";
import type { CampusMapView } from "@/lib/campus-scene";

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const previewPositions: Record<BuildingId, { left: string; top: string; width: string; height: string }> = {
  ub: { left: "9%", top: "8%", width: "31%", height: "70%" },
  tp: { left: "30%", top: "6%", width: "34%", height: "71%" },
  tp2: { left: "57%", top: "17%", width: "35%", height: "69%" },
};

// One campus scene contains all three landmark models. A static image composition keeps the
// same map visible while WebGL loads or on devices that cannot run it.
export function BuildingViewer({ ids, className = "" }: { ids: BuildingId[]; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef<CampusMapView | null>(null);
  const drag = useRef<{ x: number; startX: number; startY: number; id: number; moved: boolean } | null>(null);
  const calm = useCalm();
  const [can3d, setCan3d] = useState(false);
  const [want, setWant] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "live" | "failed">("idle");
  const [cur, setCur] = useState(ids[0]);
  const curRef = useRef(cur);
  curRef.current = cur;
  const list = BUILDINGS.filter((b) => ids.includes(b.id));
  const b = BUILDINGS.find((x) => x.id === cur)!;

  useEffect(() => setCan3d(webglOk()), []);

  useEffect(() => {
    if (!can3d || calm || !box.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setWant(true); io.disconnect(); }
    }, { rootMargin: "300px 0px" });
    io.observe(box.current);
    return () => io.disconnect();
  }, [can3d, calm]);

  useEffect(() => {
    if (!want || !canvas.current) return;
    let gone = false;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    setState("loading");
    import("@/lib/campus-scene")
      .then(async ({ createCampusMapView }) => {
        if (gone || !canvas.current) return;
        const v = createCampusMapView(canvas.current, { small: calm || matchMedia("(max-width: 767px), (pointer: coarse)").matches });
        view.current = v;
        await v.load(list.map(({ id, file, mapPosition }) => ({ id, file, mapPosition })));
        if (gone) return;
        v.select(curRef.current);
        v.overview();
        ro = new ResizeObserver(() => v.resize());
        ro.observe(canvas.current!);
        io = new IntersectionObserver(([e]) => v.setRunning(e.isIntersecting));
        io.observe(box.current!);
        setState("live");
      })
      .catch((e) => { console.warn("[campus map] keeping the preview:", e); if (!gone) setState("failed"); });
    return () => {
      gone = true;
      ro?.disconnect();
      io?.disconnect();
      view.current?.dispose();
      view.current = null;
    };
    // The scene loads all buildings together; selections update its focus ring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [want]);

  useEffect(() => {
    const el = box.current;
    if (!el || state !== "live") return;
    const zoom = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      view.current?.zoomBy(e.deltaY < 0 ? 1.12 : 0.89);
    };
    el.addEventListener("wheel", zoom, { passive: false });
    return () => el.removeEventListener("wheel", zoom);
  }, [state]);

  const pick = (id: BuildingId) => {
    if (curRef.current !== id) {
      curRef.current = id;
      setCur(id);
    }
    view.current?.select(id);
  };

  const live = state === "live";
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (!live) return;
    drag.current = { x: e.clientX, startX: e.clientX, startY: e.clientY, id: e.pointerId, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return;
    if (Math.hypot(e.clientX - drag.current.startX, e.clientY - drag.current.startY) > 5) drag.current.moved = true;
    if (drag.current.moved) view.current?.turn((e.clientX - drag.current.x) * 0.006);
    drag.current.x = e.clientX;
  };
  const up = (e: PointerEvent<HTMLDivElement>) => {
    const active = drag.current;
    if (active?.id === e.pointerId && !active.moved) {
      const hit = view.current?.buildingAt(e.clientX, e.clientY);
      if (hit) pick(hit);
    }
    drag.current = null;
  };
  const tile = `https://tile.openstreetmap.org/${CAMPUS_MAP_TILE.zoom}/${CAMPUS_MAP_TILE.x}/${CAMPUS_MAP_TILE.y}.png`;
  const mapLink = `https://www.openstreetmap.org/?mlat=${b.location.latitude}&mlon=${b.location.longitude}#map=18/${b.location.latitude}/${b.location.longitude}`;

  return (
    <div className={`pt-3 ${className}`}>
      <div className="grid gap-4 lg:h-full lg:grid-cols-[1.4fr_0.6fr] lg:grid-rows-[minmax(0,1fr)]">
        <section aria-labelledby="campus-map-title" className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 md:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">One campus · three landmarks</p>
              <h3 id="campus-map-title" className="text-lg font-bold tracking-tight">Interactive 3D campus map</h3>
            </div>
            <a href={TOUR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-blue min-h-10">Start the 360° virtual tour ↗<span className="sr-only"> on the official SRMIST site (opens in a new tab)</span></a>
          </div>

          <div ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className={`relative isolate aspect-[1.35] min-h-[18rem] overflow-hidden border-y border-line bg-[#e5eee4] sm:aspect-[1.55] lg:aspect-auto lg:min-h-0 lg:flex-1 ${live ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}>
            {!live ? (
              <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#dfe8df]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${tile}")` }} />
                <div className="absolute inset-0 bg-white/10" />
                {list.map((item) => {
                  const place = previewPositions[item.id];
                  const selected = cur === item.id;
                  const glow = item.id === "tp" ? "drop-shadow-[0_0_18px_rgba(233,102,18,0.72)]" : item.id === "tp2" ? "drop-shadow-[0_0_18px_rgba(208,162,10,0.72)]" : "drop-shadow-[0_0_18px_rgba(7,85,178,0.72)]";
                  return <Image key={item.id} src={item.still} alt="" width={900} height={600} style={{ ...place, position: "absolute" }} className={`object-contain drop-shadow-[0_16px_12px_rgba(0,0,0,0.22)] ${selected ? glow : "opacity-90"}`} />;
                })}
              </div>
            ) : null}

            <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${live ? "opacity-100" : "opacity-0"}`} />
            <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/70 bg-[#0d1b33]/80 px-3 py-2 text-xs font-semibold text-white shadow-lg md:left-6 md:top-6">Drag to rotate · Ctrl + scroll to zoom · select a building to focus</div>
            {!live ? (
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                {state === "loading" ? <span className="rounded-full bg-[#0d1b33]/85 px-4 py-2.5 text-sm font-semibold text-white">Loading the shared 3D scene…</span> : can3d && state !== "failed" ? <button type="button" onClick={() => setWant(true)} className="rounded-full bg-[#0d1b33] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white">Load 3D map</button> : null}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-4 py-1.5 text-xs text-ink-soft md:px-6">
            <p>Map data © <a className="underline underline-offset-2" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · building markers are approximate</p>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline underline-offset-2">View location on OpenStreetMap ↗</a>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 md:px-6">
            <div className="flex flex-wrap gap-2" role="group" aria-label="3D map controls">
              <button type="button" disabled={!live} onClick={() => view.current?.zoomBy(1.15)} className="min-h-10 min-w-10 rounded-full border border-line px-3 text-lg font-bold disabled:opacity-50" aria-label="Zoom in">+</button>
              <button type="button" disabled={!live} onClick={() => view.current?.zoomBy(0.87)} className="min-h-10 min-w-10 rounded-full border border-line px-3 text-lg font-bold disabled:opacity-50" aria-label="Zoom out">−</button>
              <button type="button" disabled={!live} onClick={() => view.current?.overview()} className="min-h-10 rounded-full border border-line px-4 text-sm font-bold disabled:opacity-50">Show all three</button>
            </div>
            <div role="group" aria-label="Select a building in the 3D campus map" className="flex flex-wrap gap-2">
            {list.map((item) => {
              const selected = cur === item.id;
              const tone = item.id === "tp" ? "border-[#e96612] text-[#bc4d08]" : item.id === "tp2" ? "border-[#d0a20a] text-[#715900]" : "border-[#0755b2] text-[#0755b2]";
              return <button key={item.id} type="button" aria-pressed={selected} onFocus={() => pick(item.id)} onClick={() => pick(item.id)} className={`min-h-10 rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0d1b33] ${selected ? `${tone} bg-white` : "border-line text-ink hover:bg-tint"}`}>
                {item.shortName}<span className="sr-only">: {item.name}</span>
              </button>;
            })}
            </div>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-accent underline underline-offset-2">{b.location.latitude.toFixed(5)}° N, {b.location.longitude.toFixed(5)}° E{b.location.approximate ? " · approx." : ""}</a>
          </div>
        </section>

        <article aria-live="polite" aria-atomic="true" aria-labelledby="selected-building-title" tabIndex={0} className="overflow-hidden rounded-3xl bg-[#0d1b33] text-white shadow-xl lg:overflow-y-auto">
          <div className="relative isolate flex min-h-36 flex-col justify-end overflow-hidden p-5">
            <Image src={b.still} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="-z-10 object-cover opacity-60" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071a36] via-[#071a36]/65 to-[#071a36]/10" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">Focused on map · {b.shortName}</p>
            <h3 id="selected-building-title" className="mt-2 text-2xl font-bold tracking-tight">{b.name}</h3>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f5bf35]">Inside this building</p>
            <ul className="mt-4 grid gap-3 text-sm font-medium leading-relaxed">
              {b.highlights.map((highlight) => <li key={highlight} className="flex gap-3"><span aria-hidden="true" className="text-lg leading-none text-[#f5bf35]">↗</span><span>{highlight}</span></li>)}
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
