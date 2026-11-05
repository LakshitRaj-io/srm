"use client";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FRAMES = [
  ["/images/library.jpg", "Central Library", "Rows of bookshelves in the SRMIST Central Library"],
  ["/images/techpark2.jpg", "Tech Park", "The colourful glass facade of the SRMIST Tech Park"],
  ["/images/pool.jpg", "Aquatic complex", "The outdoor swimming pool at the SRMIST aquatic complex"],
  ["/images/stadium.jpg", "Athletics track", "Aerial view of the SRMIST athletics track and field"],
  ["/images/culture.jpg", "Cultural stage", "Students performing on stage at an SRMIST cultural event"],
  ["/images/ncc.jpg", "National Cadet Corps", "NCC cadets on parade at SRMIST"],
  ["/images/walkway.jpg", "Campus walkways", "A covered walkway through the SRMIST campus"],
] as const;

// Scrolling down moves the campus sideways past a pinned window.
export function CampusFilm() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [dist, setDist] = useState(0);
  const [cur, setCur] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(p, (v) => -v * dist);
  useMotionValueEvent(p, "change", (v) => setCur(Math.min(FRAMES.length - 1, Math.floor(v * FRAMES.length))));

  useEffect(() => {
    const size = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth));
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  const frames = FRAMES.map(([src, label, alt]) => (
    <figure key={src} className="relative h-full w-[82vw] shrink-0 overflow-hidden rounded-2xl md:w-[48vw]">
      <Image src={src} alt={alt} fill loading="eager" sizes="(min-width:768px) 52vw, 82vw" className="object-cover" />
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-md">{label}</figcaption>
    </figure>
  ));

  if (reduced) {
    return (
      <section aria-labelledby="film" className="wrap section">
        <h2 id="film" className="t-section mb-6">Life on campus</h2>
        <div tabIndex={0} role="region" aria-labelledby="film" className="flex h-[60svh] gap-4 overflow-x-auto">{frames}</div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="film" className="relative z-10 h-[400svh] bg-surface">
      <div className="sticky top-[4.7rem] flex h-[calc(100svh-4.7rem)] flex-col justify-center gap-4 overflow-hidden py-4">
        <div className="wrap flex w-full items-end justify-between gap-4">
          <h2 id="film" className="t-section">Life on campus</h2>
          <p aria-hidden="true" className="text-sm font-medium tabular-nums text-ink-soft">{cur + 1}/{FRAMES.length}</p>
        </div>
        <motion.div ref={track} style={{ x }} className="flex min-h-0 flex-1 gap-4 px-[clamp(1rem,3vw,2.5rem)]">{frames}</motion.div>
        <div aria-hidden="true" className="wrap w-full"><div className="h-0.5 overflow-hidden rounded-full bg-line"><motion.div style={{ scaleX: p }} className="h-full origin-left bg-accent" /></div></div>
      </div>
    </section>
  );
}
