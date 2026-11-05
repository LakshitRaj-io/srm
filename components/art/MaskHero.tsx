"use client";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { BUILDINGS } from "@/data/campus";
import type { CampusScene } from "@/lib/campus-scene";

const IMG = { src: "/images/campus.jpg", alt: "Aerial view of the SRMIST Kattankulathur campus beside a lake" };
// Scroll progress at which each building holds in frame.
const HOLD = [0.3, 0.57, 0.81];

function Copy() {
  return (
    <>
      <h1 className="t-hero text-white">Learn<br />Leap<br />Lead</h1>
      <p className="lede mt-5 text-white">SRM Institute of Science and Technology is a multidisciplinary university, founded in 1985 and accredited A++ by NAAC.</p>
    </>
  );
}

// Blender renders of the same models, for reduced motion and browsers without WebGL.
function Stills() {
  return (
    <section aria-labelledby="campus-stills" className="wrap section">
      <h2 id="campus-stills" className="t-section">Around the campus</h2>
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {BUILDINGS.map((b) => (
          <li key={b.id}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-tint"><Image src={b.still} alt={`3D model of ${b.name}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /></div>
            <p className="mt-2 font-medium">{b.name}</p>
          </li>
        ))}
      </ul>
      <Link href="/campus-tour" className="btn btn-blue mt-8">Explore the campus</Link>
    </section>
  );
}

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// One continuous scene. The SRM letters open onto the University Building, then the same camera
// moves past Tech Park and Tech Park 2 to a campus overview, which dissolves into the page.
export function MaskHero() {
  const ref = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<CampusScene | null>(null);
  const [live, setLive] = useState(false);
  const [noGl, setNoGl] = useState(false);
  const [stop, setStop] = useState(-1);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const zoom = useTransform(p, [0, 0.2], [1, 18]);
  const sheet = useTransform(p, [0.09, 0.2], [1, 0]);
  const barVis = useTransform(sheet, (x) => (x < 0.05 ? "hidden" : "visible"));
  const copy = useTransform(p, [0.17, 0.215, 0.255, 0.285], [0, 1, 1, 0]);
  const copyY = useTransform(p, [0.17, 0.215, 0.255, 0.285], [40, 0, 0, -30]);
  const copyVis = useTransform(copy, (x) => (x < 0.02 ? "hidden" : "visible"));
  const scrim = useTransform(p, [0.17, 0.215, 0.255, 0.3], [0, 1, 1, 0]);
  const controls = useTransform(p, [0.27, 0.31, 0.93, 0.965], [0, 1, 1, 0]);
  const controlsVis = useTransform(controls, (x) => (x < 0.02 ? "hidden" : "visible"));
  const dissolve = useTransform(p, [0.945, 0.995], [0, 1]);

  useMotionValueEvent(p, "change", (x) => {
    api.current?.setProgress(x);
    setStop(x < 0.27 || x > 0.95 ? -1 : x < 0.44 ? 0 : x < 0.69 ? 1 : 2);
  });

  useEffect(() => {
    if (reduced !== false) return;
    if (!webglOk()) { setNoGl(true); return; }
    let gone = false;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;
    import("@/lib/campus-scene")
      .then(async ({ createCampusScene }) => {
        if (gone || !canvas.current) return;
        const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        const scene = createCampusScene(canvas.current, { small: conn?.saveData || matchMedia("(max-width: 767px), (pointer: coarse)").matches });
        api.current = scene;
        ro = new ResizeObserver(() => scene.resize());
        ro.observe(canvas.current);
        io = new IntersectionObserver(([e]) => scene.setRunning(e.isIntersecting));
        io.observe(ref.current!);
        scene.setProgress(p.get());
        await scene.ready;
        if (!gone) setLive(true);
      })
      .catch((e) => { console.warn("[campus] showing renders instead:", e); setNoGl(true); });
    return () => {
      gone = true;
      ro?.disconnect();
      io?.disconnect();
      api.current?.dispose();
      api.current = null;
    };
  }, [reduced, p]);

  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    api.current?.setPointer((e.clientX / innerWidth - 0.5) * 2, -(e.clientY / innerHeight - 0.5) * 2);
  };

  const goTo = (i: number) => {
    const s = ref.current;
    if (!s) return;
    window.scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) * HOLD[i], behavior: "smooth" });
  };

  if (reduced || noGl) {
    return (
      <>
        <section id="campus-3d" className="on-dark relative isolate overflow-hidden bg-black">
          <Image {...IMG} fill priority sizes="100vw" className="-z-10 object-cover opacity-60" />
          <div className="wrap py-20"><Copy /></div>
        </section>
        <Stills />
      </>
    );
  }

  return (
    <section ref={ref} id="campus-3d" aria-label="Campus" onPointerMove={move} className="fx-tall on-dark relative h-[calc(var(--vh)*420)] bg-black md:h-[calc(var(--vh)*620)]">
      <div className="fx-pin sticky top-[var(--hdr)] h-[calc(var(--vh)*100-var(--hdr))] min-h-[30rem] overflow-hidden">
        <Image {...IMG} fill priority sizes="100vw" className="object-cover" />
        <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${live ? "opacity-100" : "opacity-0"}`} />

        <motion.div aria-hidden="true" style={{ opacity: scrim }} className="fx-show absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent md:bg-gradient-to-r md:from-black/65 md:via-black/20" />

        <motion.div aria-hidden="true" style={{ opacity: sheet }} className="fx-hide absolute inset-0 grid place-items-center overflow-hidden mask-sheet">
          <motion.span style={{ scale: zoom }} className="block font-display text-[min(44vw,calc(var(--vh)*52))] font-bold leading-[0.9] tracking-[-0.05em] mask-text">SRM</motion.span>
        </motion.div>
        <motion.div style={{ opacity: sheet, visibility: barVis }} className="fx-hide absolute inset-x-0 bottom-20 z-10 md:bottom-24">
          <div className="wrap flex flex-wrap items-end justify-between gap-x-6 gap-y-3 mask-text">
            <p aria-hidden="true" className="min-w-0">
              <span className="block text-sm font-medium md:text-base">Institute of Science and Technology</span>
              <span className="block text-2xl font-semibold tracking-tight md:text-4xl">Learn. Leap. Lead.</span>
            </p>
            <p className="flex shrink-0 items-center gap-4 text-sm font-medium">
              <span aria-hidden="true" className="hidden sm:inline">Scroll to enter</span>
              <a href="#start" className="inline-flex min-h-11 items-center rounded-full px-4 underline underline-offset-4 ring-1 ring-current/30 hover:ring-current">Skip intro <span aria-hidden="true">&nbsp;↓</span></a>
            </p>
          </div>
        </motion.div>

        <motion.div style={{ opacity: copy, y: copyY, visibility: copyVis }} className="fx-show absolute inset-0 flex items-center">
          <div className="wrap w-full"><Copy /></div>
        </motion.div>

        <motion.div style={{ opacity: controls, visibility: controlsVis }} className="fx-hide absolute inset-x-0 bottom-20 z-10 md:bottom-6">
          <div className="wrap flex flex-wrap items-center gap-1.5 md:gap-2">
            <div role="group" aria-label="Campus buildings" className="flex flex-wrap gap-1 rounded-2xl border border-white/20 bg-black/55 p-1 backdrop-blur-xl">
              {BUILDINGS.map((b, i) => (
                <button key={b.id} type="button" aria-pressed={stop === i} onClick={() => goTo(i)} className={`min-h-10 rounded-xl px-2.5 text-[0.8rem] font-medium transition-colors md:px-3.5 md:text-sm ${stop === i ? "bg-white text-black" : "text-white hover:bg-white/15"}`}>{b.name}</button>
              ))}
            </div>
            <Link href="/campus-tour" className="inline-flex min-h-11 items-center rounded-2xl border border-white/20 bg-black/55 px-3.5 text-[0.8rem] font-medium md:min-h-12 md:px-4 md:text-sm text-white backdrop-blur-xl hover:bg-black/75">Explore the campus</Link>
          </div>
        </motion.div>

        <motion.div aria-hidden="true" style={{ opacity: dissolve }} className="fx-hide pointer-events-none absolute inset-0 bg-surface" />
      </div>
    </section>
  );
}
