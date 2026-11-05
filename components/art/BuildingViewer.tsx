"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { BUILDINGS, type BuildingId } from "@/data/campus";
import { useCalm } from "@/lib/calm";
import type { ModelView } from "@/lib/campus-scene";

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Always starts as a Blender render, so it works without JavaScript or WebGL. Capable devices swap
// to the live model once it is near the screen; everyone else can choose to load it.
export function BuildingViewer({ ids, className = "" }: { ids: BuildingId[]; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef<ModelView | null>(null);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const calm = useCalm();
  const [can3d, setCan3d] = useState(false);
  const [want, setWant] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "live" | "failed">("idle");
  const [cur, setCur] = useState(ids[0]);
  const list = BUILDINGS.filter((b) => ids.includes(b.id));
  const b = BUILDINGS.find((x) => x.id === cur)!;

  useEffect(() => setCan3d(webglOk()), []);

  // Capable devices load it when it comes near. The rest wait for the button.
  useEffect(() => {
    if (!can3d || calm || !box.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setWant(true); io.disconnect(); } }, { rootMargin: "300px 0px" });
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
      .then(async ({ createModelView }) => {
        if (gone || !canvas.current) return;
        const v = createModelView(canvas.current, { small: calm || matchMedia("(max-width: 767px), (pointer: coarse)").matches });
        view.current = v;
        await v.show(BUILDINGS.find((x) => x.id === ids[0])!.file);
        if (gone) return;
        ro = new ResizeObserver(() => v.resize());
        ro.observe(canvas.current!);
        io = new IntersectionObserver(([e]) => v.setRunning(e.isIntersecting));
        io.observe(box.current!);
        setState("live");
      })
      .catch((e) => { console.warn("[model] keeping the render:", e); setState("failed"); });
    return () => {
      gone = true;
      ro?.disconnect();
      io?.disconnect();
      view.current?.dispose();
      view.current = null;
    };
    // The first building is loaded here; later picks go through pick().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [want]);

  const pick = (id: BuildingId) => {
    setCur(id);
    if (state === "live") view.current?.show(BUILDINGS.find((x) => x.id === id)!.file).catch(() => setState("failed"));
  };

  const live = state === "live";
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (!live) return;
    drag.current = { x: e.clientX, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return;
    view.current?.turn((e.clientX - drag.current.x) * 0.006);
    drag.current.x = e.clientX;
  };
  const up = () => { drag.current = null; };

  return (
    <div className={className}>
      <div ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-tint ${live ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}>
        <Image src={b.still} alt={`3D model of ${b.name}, built from official SRMIST images`} fill sizes="(min-width:1024px) 60vw, 100vw" className={`object-contain p-3 transition-opacity duration-500 ${live ? "opacity-0" : "opacity-100"}`} />
        <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${live ? "opacity-100" : "opacity-0"}`} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        {list.length > 1 ? (
          <div role="group" aria-label="Choose a building" className="flex flex-wrap gap-1 rounded-xl bg-tint p-1">
            {list.map((x) => (
              <button key={x.id} type="button" aria-pressed={cur === x.id} onClick={() => pick(x.id)} className={`min-h-10 rounded-lg px-3 text-sm font-medium ${cur === x.id ? "bg-surface shadow-sm" : "hover:text-accent"}`}>{x.name}</button>
            ))}
          </div>
        ) : <p className="font-medium">{b.name}</p>}
        {live ? (
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Turn left" onClick={() => view.current?.turn(-0.3)} className="grid h-11 w-11 place-items-center rounded-lg text-lg hover:bg-tint"><span aria-hidden="true">←</span></button>
            <button type="button" aria-label="Turn right" onClick={() => view.current?.turn(0.3)} className="grid h-11 w-11 place-items-center rounded-lg text-lg hover:bg-tint"><span aria-hidden="true">→</span></button>
          </div>
        ) : can3d && state !== "failed" ? (
          <button type="button" disabled={state === "loading"} onClick={() => setWant(true)} className="btn btn-line text-sm disabled:opacity-60">{state === "loading" ? "Loading 3D…" : "View in 3D"}</button>
        ) : null}
      </div>
    </div>
  );
}
