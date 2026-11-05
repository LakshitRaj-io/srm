"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TOUR_URL } from "@/data/campus";

// SRMIST's official 360° tour, embedded only after the visitor chooses to start it (it is a heavy
// WebGL player from another origin). We never read or restyle its content; the official link is
// always available beside it.
export function TourEmbed() {
  const [on, setOn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const [canFs, setCanFs] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => setCanFs(!!document.fullscreenEnabled), []);
  useEffect(() => {
    if (!on || loaded) return;
    const id = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(id);
  }, [on, loaded]);

  const start = () => setOn(true);
  // Move keyboard focus into the tour once its frame exists.
  useEffect(() => { if (on) frame.current?.focus(); }, [on]);
  const fullscreen = () => { box.current?.requestFullscreen?.().catch(() => {}); };

  return (
    <div>
      <div ref={box} className="relative h-[clamp(26rem,calc(var(--vh)*78),52rem)] overflow-hidden rounded-2xl border border-line bg-black">
        {on ? (
          <>
            <iframe ref={frame} src={TOUR_URL} title="SRMIST official virtual campus tour (360°), hosted on srmist.edu.in" allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
              allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setLoaded(true)} className="absolute inset-0 h-full w-full border-0" />
            {!loaded ? <p role="status" className="guide-wait absolute inset-0 grid place-items-center text-white">Loading the official tour…</p> : null}
          </>
        ) : (
          <div className="on-dark absolute inset-0 text-white">
            <Image src="/images/campus.jpg" alt="Aerial view of the SRMIST Kattankulathur campus beside a lake" fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">360° · Official</p>
              <p className="mt-2 max-w-xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl">Walk the Kattankulathur campus in panoramas, from your browser.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={start} className="btn btn-gold">Start the virtual tour</button>
                <a href={TOUR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">Open on srmist.edu.in ↗<span className="sr-only"> (opens in a new tab)</span></a>
              </div>
              <p className="mt-3 text-sm text-white/75">The tour loads from SRMIST's site and downloads a few megabytes.</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-ink-soft">{on ? (slow && !loaded ? "Taking a while? The tour may be blocked by your network or browser. Open it in a new tab instead." : "Drag or swipe to look around. Press Esc to leave fullscreen.") : "Provided by SRMIST. This concept site doesn't control the tour's content."}</p>
        <div className="flex flex-wrap gap-2">
          {on && canFs ? <button type="button" onClick={fullscreen} className="btn btn-line min-h-10">Fullscreen</button> : null}
          {on ? <button type="button" onClick={() => { setOn(false); setLoaded(false); setSlow(false); }} className="btn btn-line min-h-10">Close tour</button> : null}
          <a href={TOUR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line min-h-10">Open in a new tab ↗<span className="sr-only"> (official tour on srmist.edu.in)</span></a>
        </div>
      </div>
    </div>
  );
}
