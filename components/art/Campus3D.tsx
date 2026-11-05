"use client";
import { useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BUILDINGS, CAMPUS_NOTE, type BuildingId } from "@/data/campus";
import type { CampusScene, Stop } from "@/lib/campus-scene";

const CAN_3D = "(min-width: 768px)";

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Lightweight drawing used on phones, without WebGL or JavaScript, and while the 3D loads.
// Same palette and composition as the 3D models; Tech Park 2 is drawn as an outline on purpose.
function Skyline({ active }: { active: BuildingId | null }) {
  const dim = (id: BuildingId) => (active && active !== id ? 0.35 : 1);
  return (
    <svg viewBox="0 0 640 300" role="img" aria-label="Illustration of the University Building, Tech Park and Tech Park 2" className="h-full w-full">
      <defs>
        <linearGradient id="c3d-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1b33" /><stop offset="1" stopColor="#1d3a5c" /></linearGradient>
        <pattern id="c3d-ub" width="14" height="44" patternUnits="userSpaceOnUse"><rect width="14" height="44" fill="#f0ddd9" /><path d="M4 40V8a3 3 0 0 1 6 0v32z" fill="#2f4f9a" /></pattern>
        <pattern id="c3d-blue" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#1f3f9e" /><rect width="2.5" height="10" fill="#f4f6fa" /></pattern>
        <pattern id="c3d-white" width="10" height="12" patternUnits="userSpaceOnUse"><rect width="10" height="12" fill="#f2f2ee" /><rect y="4" width="10" height="4" fill="#1c2b55" /></pattern>
        <pattern id="c3d-grid" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#2547a8" /><path d="M0 0H10M0 0V10" stroke="#6f8fe0" strokeWidth="1" /></pattern>
      </defs>
      <rect width="640" height="300" fill="url(#c3d-sky)" />
      <rect y="262" width="640" height="38" fill="#1d3a26" />
      <g opacity={dim("ub")} style={{ transition: "opacity .3s" }}>
        <rect x="40" y="96" width="150" height="166" fill="url(#c3d-ub)" />
        <rect x="40" y="96" width="150" height="6" fill="#fbf3f1" />
        <rect x="88" y="84" width="54" height="12" fill="#f6ebe8" />
        <rect x="40" y="250" width="150" height="12" fill="#3d64b3" />
      </g>
      <g opacity={dim("tp")} style={{ transition: "opacity .3s" }}>
        <rect x="222" y="104" width="34" height="158" fill="url(#c3d-blue)" />
        <rect x="256" y="98" width="34" height="164" fill="url(#c3d-white)" />
        <rect x="290" y="92" width="10" height="170" fill="#d63a2c" />
        <rect x="300" y="88" width="56" height="174" fill="#f3c80f" />
        <rect x="308" y="100" width="40" height="156" fill="url(#c3d-grid)" />
        <rect x="296" y="84" width="64" height="6" fill="#d63a2c" />
        <rect x="356" y="92" width="10" height="170" fill="#d63a2c" />
        <rect x="366" y="98" width="34" height="164" fill="url(#c3d-white)" />
        <rect x="400" y="104" width="34" height="158" fill="url(#c3d-blue)" />
      </g>
      <g opacity={dim("tp2")} style={{ transition: "opacity .3s" }}>
        <rect x="470" y="150" width="120" height="112" fill="#a9c2e8" fillOpacity="0.18" stroke="#dbe7ff" strokeWidth="1.5" strokeDasharray="5 4" />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={i} x1="470" x2="590" y1={150 + i * 12.4} y2={150 + i * 12.4} stroke="#dbe7ff" strokeOpacity="0.25" />)}
        <text x="530" y="210" textAnchor="middle" fill="#dbe7ff" fontSize="11" fontFamily="inherit">placeholder</text>
      </g>
    </svg>
  );
}

function Info({ id, onClose }: { id: BuildingId; onClose?: () => void }) {
  const b = BUILDINGS.find((x) => x.id === id)!;
  return (
    <div className="min-w-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-semibold tracking-tight">{b.name}</h3>
        {onClose ? <button type="button" onClick={onClose} className="-mr-2 -mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xl hover:bg-white/10" aria-label="Back to campus overview">×</button> : null}
      </div>
      <p className="mt-1.5 text-white/85">{b.line}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">{b.facts.map((f) => <li key={f} className="rounded-full bg-white/12 px-2.5 py-1 text-sm">{f}</li>)}</ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {b.links.map(([l, h]) => <Link key={h} href={h} className="btn btn-line min-h-10 text-sm">{l}</Link>)}
      </div>
      <p className="mt-3 text-xs text-white/65">
        {b.fidelity} Source: {b.sources.map(([l, h], i) => <span key={h}>{i ? ", " : ""}<a href={h} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{l}<span className="sr-only"> (opens in a new tab)</span></a></span>)}.
      </p>
    </div>
  );
}

// Signature reveal after the hero: a short, skippable flythrough of three campus landmarks that
// resolves into a navigable overview. It never pins or hijacks scrolling. Phones, browsers without
// WebGL and visitors without JavaScript get the lightweight drawing with the same content.
export function Campus3D() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const api = useRef<CampusScene | null>(null);
  const started = useRef(false);
  const mounted = useRef(false);
  const reduced = useReducedMotion();
  const near = useInView(root, { margin: "400px 0px" });
  const seen = useInView(root, { amount: 0.45, once: true });
  const visible = useInView(root, { amount: 0.05 });
  const [mode, setMode] = useState<"static" | "loading" | "3d">("static");
  const [stop, setStop] = useState<Stop>("overview");
  const [touring, setTouring] = useState(false);
  const [played, setPlayed] = useState(false);
  const [staticPick, setStaticPick] = useState<BuildingId | null>(null);

  // Decide once on the client whether this device gets the 3D scene.
  const [eligible, setEligible] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setEligible(matchMedia(CAN_3D).matches && !conn?.saveData && webglOk());
  }, []);

  // Load three.js and build the scene only when the section is close to the viewport.
  useEffect(() => {
    if (!eligible || !near || started.current) return;
    started.current = true;
    setMode("loading");
    import("@/lib/campus-scene")
      .then(({ createCampusScene }) => {
        if (!mounted.current || !canvas.current || api.current) return;
        api.current = createCampusScene(canvas.current, {
          reduced: !!reduced,
          onPins: (pins) => {
            for (const [id, p] of Object.entries(pins)) {
              const el = pinRefs.current[id];
              if (!el) continue;
              el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
              el.style.opacity = p.on ? "1" : "0";
            }
          },
        });
        if (reduced) api.current.flyTo("overview", true);
        setMode("3d");
      })
      .catch((e) => { console.warn("[campus-3d] falling back to the drawing:", e); if (mounted.current) setMode("static"); });
  }, [eligible, near, reduced]);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; api.current?.dispose(); api.current = null; started.current = false; };
  }, []);

  useEffect(() => { api.current?.setRunning(mode === "3d" && visible); }, [mode, visible]);

  useEffect(() => {
    if (mode !== "3d" || !canvas.current) return;
    const ro = new ResizeObserver(() => api.current?.resize());
    ro.observe(canvas.current);
    return () => ro.disconnect();
  }, [mode]);

  const playingRef = useRef(false);
  const runRef = useRef(0);
  const play = async () => {
    const a = api.current;
    if (!a || playingRef.current) return;
    const me = ++runRef.current;
    playingRef.current = true;
    setPlayed(true);
    setTouring(true);
    await a.playIntro(setStop);
    if (runRef.current !== me) return; // superseded by a later run or a manual stop
    playingRef.current = false;
    setTouring(false);
  };

  // The flythrough plays by itself once, the first time most of the section is on screen.
  useEffect(() => {
    if (mode === "3d" && seen && !played && !reduced) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, seen, played, reduced]);

  const go = (s: Stop) => {
    api.current?.cancelIntro();
    runRef.current++;
    playingRef.current = false;
    setTouring(false);
    setStop(s);
    api.current?.flyTo(s);
  };

  const building = stop === "ub" || stop === "tp" || stop === "tp2" ? stop : null;
  const tabs: [Stop, string][] = [["overview", "Overview"], ...BUILDINGS.map((b) => [b.id, b.name] as [Stop, string])];

  return (
    <section ref={root} id="campus-3d" aria-labelledby="campus-3d-h" className="on-dark relative isolate overflow-hidden bg-[#0d1b33] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black to-transparent" />

      <div className="relative lg:h-[clamp(36rem,calc(var(--vh)*92),56rem)]">
      <div className="relative h-[clamp(24rem,calc(var(--vh)*62),36rem)] lg:absolute lg:inset-0 lg:h-auto">
        {/* 3D canvas, or the drawing */}
        {eligible ? (
          <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${mode === "3d" ? "opacity-100" : "opacity-0"}`} />
        ) : null}
        {mode !== "3d" ? (
          <div className="absolute inset-x-0 bottom-0 top-36 flex items-end justify-center px-4 pb-4 md:top-40 lg:pb-44">
            <div className="h-full max-h-[22rem] w-full max-w-3xl"><Skyline active={staticPick} /></div>
          </div>
        ) : null}

        {/* Labels that follow the buildings in 3D */}
        {mode === "3d" ? BUILDINGS.map((b) => (
          <button key={b.id} ref={(el) => { pinRefs.current[b.id] = el; }} type="button" tabIndex={-1} aria-hidden="true" onClick={() => go(b.id)}
            className={`absolute left-0 top-0 z-10 rounded-full border px-3 py-1.5 text-sm font-semibold shadow-lg transition-[opacity,background-color] duration-300 ${stop === b.id ? "border-white bg-white text-black" : "border-white/40 bg-black/55 text-white backdrop-blur-md hover:bg-black/75"}`}
            style={{ opacity: 0 }}>
            {b.name}{b.id === "tp2" ? <span className="ml-1 font-normal opacity-75">(placeholder)</span> : null}
          </button>
        )) : null}

        {/* Heading */}
        <div className="wrap relative z-20 pt-14 md:pt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">Into the campus</p>
          <h2 id="campus-3d-h" className="t-section mt-2 max-w-xl">Three landmarks, one campus</h2>
          {mode === "loading" ? <p className="guide-wait mt-3 text-sm text-white/75">Building the 3D campus…</p> : null}
        </div>

        {/* Controls and the building card */}
      </div>

        <div className="relative z-20 lg:absolute lg:inset-x-0 lg:bottom-0">
          <div className="wrap pb-6">
            <div className="grid items-end gap-3 lg:grid-cols-12">
              <div aria-live="polite" className="rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-xl md:p-5 lg:col-span-6">
                {mode === "3d" && building ? (
                  <Info id={building} onClose={touring ? undefined : () => go("overview")} />
                ) : mode !== "3d" && staticPick ? (
                  <Info id={staticPick} onClose={() => setStaticPick(null)} />
                ) : (
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">Campus overview</h3>
                    <p className="mt-1.5 text-white/85">Pick a landmark to learn what's inside and where to go next, or step inside with the official 360° tour.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href="/campus-tour" className="btn btn-gold min-h-10 text-sm">Take the virtual tour</Link>
                      <Link href="/academics#finder" className="btn btn-line min-h-10 text-sm">Find a programme</Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:col-span-6 lg:justify-end">
                <div role="group" aria-label="Campus landmarks" className="flex flex-wrap gap-1 rounded-2xl border border-white/15 bg-black/55 p-1 backdrop-blur-xl">
                  {tabs.map(([s, l]) => {
                    const on = mode === "3d" ? stop === s : (staticPick ?? "overview") === s;
                    return (
                      <button key={s} type="button" aria-pressed={on} onClick={() => (mode === "3d" ? go(s) : setStaticPick(s === "overview" ? null : (s as BuildingId)))}
                        className={`min-h-10 rounded-xl px-3 text-sm font-medium transition-colors ${on ? "bg-white text-black" : "text-white hover:bg-white/15"}`}>{l}</button>
                    );
                  })}
                </div>
                {mode === "3d" ? (
                  touring ? (
                    <button type="button" onClick={() => go("overview")} className="btn btn-line min-h-10 text-sm">Skip to overview</button>
                  ) : !reduced ? (
                    <button type="button" onClick={play} className="btn btn-line min-h-10 text-sm">{played ? "Replay flythrough" : "Play flythrough"}</button>
                  ) : null
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-xs text-white/60">{CAMPUS_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
