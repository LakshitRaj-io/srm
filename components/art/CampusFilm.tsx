"use client";
import { useCalm } from "@/lib/calm";
import { useInView } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

const FRAMES = [
  ["/images/library.jpg", "Central Library", "Rows of bookshelves in the SRMIST Central Library"],
  ["/images/techpark2.jpg", "Tech Park", "The colourful glass facade of the SRMIST Tech Park"],
  ["/images/pool.jpg", "Aquatic complex", "The outdoor swimming pool at the SRMIST aquatic complex"],
  ["/images/stadium.jpg", "Athletics track", "Aerial view of the SRMIST athletics track and field"],
  ["/images/culture.jpg", "Cultural stage", "Students performing on stage at an SRMIST cultural event"],
  ["/images/ncc.jpg", "National Cadet Corps", "NCC cadets on parade at SRMIST"],
  ["/images/walkway.jpg", "Campus walkways", "A covered walkway through the SRMIST campus"],
] as const;
const N = FRAMES.length;
const INTERVAL = 4500;

// Signed distance from the current card, wrapping so the carousel loops: -3 … 3.
const offset = (i: number, cur: number) => {
  let d = (((i - cur) % N) + N) % N;
  if (d > N / 2) d -= N;
  return d;
};

// Seven campus photos on a 3D carousel. It advances on its own every few seconds while it is on
// screen, and never takes over page scrolling: scrolling down always moves the page.
// Autoplay pauses on hover, focus, touch, the pause button, an off-screen carousel or a hidden tab,
// and is off entirely with reduced motion. Swipe, arrow keys, the buttons or a side card move it.
export function CampusFilm() {
  const root = useRef<HTMLElement>(null);
  const reduced = useCalm();
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false); // hover or focus inside
  const inView = useInView(root, { amount: 0.2 });
  const [tabHidden, setTabHidden] = useState(false);
  const visible = inView && !tabHidden;
  const [said, setSaid] = useState("");
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);

  const running = playing && !hold && visible && !reduced;

  const go = useCallback((i: number, manual = true) => {
    const next = ((i % N) + N) % N;
    setCur(next);
    if (manual) setSaid(`Photo ${next + 1} of ${N}: ${FRAMES[next][1]}`);
  }, []);

  useEffect(() => {
    const vis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => go(cur + 1, false), INTERVAL);
    return () => clearTimeout(id);
  }, [running, cur, go]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
  };

  // Horizontal swipes change the photo; vertical movement is left to the browser (touch-action: pan-y).
  const down = (e: PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId }; };
  const up = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - d.y)) { go(cur + (dx < 0 ? 1 : -1)); if (e.pointerType !== "mouse") setPlaying(false); }
  };

  const btn = "grid h-11 w-11 place-items-center rounded-full border border-line text-lg hover:bg-tint";

  return (
    <section ref={root} aria-labelledby="film" aria-roledescription="carousel" className="section relative z-10 overflow-hidden bg-surface"
      onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHold(false); }}>
      <div className="wrap flex w-full flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="film" className="t-section">Life on campus</h2>
          <p className="mt-2 text-ink-soft"><span className="font-semibold text-fg">{FRAMES[cur][1]}</span> · {cur + 1} of {N}</p>
        </div>
        <div className="flex items-center gap-2">
          {!reduced ? (
            <button type="button" className={btn} onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause automatic slideshow" : "Play automatic slideshow"}>
              <span aria-hidden="true" className="text-sm">{playing ? "❚❚" : "▶"}</span>
            </button>
          ) : null}
          <button type="button" className={btn} onClick={() => go(cur - 1)} aria-label="Previous photo"><span aria-hidden="true">←</span></button>
          <button type="button" className={btn} onClick={() => go(cur + 1)} aria-label="Next photo"><span aria-hidden="true">→</span></button>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{said}</p>

      <div tabIndex={0} onKeyDown={onKey} onPointerDown={down} onPointerUp={up} onPointerCancel={() => (drag.current = null)}
        aria-label="Campus photos. Use the arrow keys, the buttons or swipe to move between them."
        className="coverflow relative mx-auto mt-8 h-[clamp(17rem,calc(var(--vh)*58),38rem)] max-w-[90rem] select-none [touch-action:pan-y]">
        {FRAMES.map(([src, label, alt], i) => {
          const d = offset(i, cur);
          const a = Math.abs(d);
          return (
            <figure key={src} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${N}: ${label}`} aria-hidden={d !== 0}
              onClick={() => { if (d !== 0) go(i); }}
              className={`cover-card absolute left-1/2 top-0 h-full w-[78%] overflow-hidden rounded-2xl bg-tint sm:w-[58%] lg:w-[44%] ${d === 0 ? "is-front" : ""}`}
              style={{ "--d": d, "--a": a, zIndex: 10 - a, opacity: a > 2 ? 0 : a === 2 ? 0.45 : 1, visibility: a > 2 ? "hidden" : "visible" } as CSSProperties}>
              {a <= 2 ? <Image src={src} alt={d === 0 ? alt : ""} fill draggable={false} loading={a <= 1 ? "eager" : "lazy"} sizes="(min-width:1024px) 44vw, (min-width:640px) 58vw, 78vw" className="pointer-events-none object-cover" /> : null}
              <div aria-hidden="true" className="cover-shade absolute inset-0" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3.5 py-1.5 text-sm font-medium text-white">{label}</figcaption>
            </figure>
          );
        })}
      </div>

      <div aria-hidden="true" className="wrap mt-6 flex justify-center gap-1.5">
        {FRAMES.map((f, i) => (
          <span key={f[0]} className="h-1 w-8 overflow-hidden rounded-full bg-line">
            {i === cur ? <span key={`${cur}-${running}`} className={`block h-full bg-accent ${running ? "cover-progress" : ""}`} style={{ "--t": `${INTERVAL}ms` } as CSSProperties} /> : i < cur ? <span className="block h-full bg-accent/50" /> : null}
          </span>
        ))}
      </div>
    </section>
  );
}
