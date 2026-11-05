"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useCalm } from "@/lib/calm";

const IMG = { src: "/images/campus.jpg", alt: "Aerial view of the SRMIST Kattankulathur campus beside a lake" };

function Copy() {
  return (
    <>
      <h1 className="t-hero text-white">Learn. Leap. Lead.</h1>
      <p className="lede mt-4">SRM Institute of Science and Technology is a multidisciplinary university, founded in 1985 and accredited A++ by NAAC.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/academics#finder" className="btn btn-gold">Find a programme</Link>
        <Link href="/admissions" className="btn btn-line">Admissions 2027</Link>
      </div>
    </>
  );
}

// A sheet with SRM cut out of it. Scrolling flies through the letters into the campus photo.
// It uses only the photo and CSS transforms. "Skip intro" jumps to the three journeys. Reduced
// motion and lite devices get the plain photo; without JavaScript the fx-* classes do the same.
export function MaskHero() {
  const ref = useRef<HTMLElement>(null);
  const calm = useCalm();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const zoom = useTransform(p, [0, 0.55], [1, 16]);
  const sheet = useTransform(p, [0.3, 0.55], [1, 0]);
  const photo = useTransform(p, [0, 1], [1.3, 1]);
  const copy = useTransform(p, [0.45, 0.65], [0, 1]);
  const copyY = useTransform(p, [0.45, 0.65], [60, 0]);
  // Hide the intro bar once it has faded. The copy stays in the accessibility tree and tab order
  // throughout, so the page keeps its heading; tabbing into it jumps to where it is visible.
  const bar = useTransform(p, [0.2, 0.38], [1, 0]);
  const barVis = useTransform(bar, (v) => (v < 0.05 ? "hidden" : "visible"));
  const copyHit = useTransform(copy, (v) => (v < 0.5 ? "none" : "auto"));
  const reveal = () => {
    const el = ref.current;
    if (el && copy.get() < 1) window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight, behavior: "instant" });
  };

  if (calm) {
    return (
      <section className="on-dark relative isolate flex min-h-[calc(var(--vh)*100-var(--hdr))] items-end overflow-hidden bg-black text-white">
        <Image {...IMG} fill priority sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/65 via-55% to-transparent" />
        <div className="wrap w-full pb-20 pt-24"><Copy /></div>
      </section>
    );
  }

  return (
    <section ref={ref} className="fx-tall on-dark relative h-[calc(var(--vh)*170)] bg-black text-white md:h-[calc(var(--vh)*260)]">
      <div className="fx-pin sticky top-[var(--hdr)] h-[calc(var(--vh)*100-var(--hdr))] min-h-[30rem] overflow-hidden">
        <motion.div style={{ scale: photo }} className="absolute inset-0 will-change-transform">
          <Image {...IMG} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <motion.div aria-hidden="true" style={{ opacity: copy }} className="fx-show absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 via-55% to-transparent" />
        <motion.div aria-hidden="true" style={{ opacity: sheet }} className="fx-hide absolute inset-0 grid place-items-center overflow-hidden mask-sheet">
          <motion.span style={{ scale: zoom }} className="block font-display text-[min(44vw,calc(var(--vh)*52))] font-bold leading-[0.9] tracking-[-0.05em] mask-text will-change-transform">SRM</motion.span>
        </motion.div>
        <motion.div style={{ opacity: bar, visibility: barVis }} className="fx-hide absolute inset-x-0 bottom-20 z-10 md:bottom-24">
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
        <motion.div onFocusCapture={reveal} style={{ opacity: copy, y: copyY, pointerEvents: copyHit }} className="fx-show absolute inset-0 flex items-end">
          <div className="wrap w-full pb-20"><Copy /></div>
        </motion.div>
      </div>
    </section>
  );
}
