"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const IMG = { src: "/images/campus.jpg", alt: "Aerial view of the SRMIST Kattankulathur campus beside a lake" };

function Copy() {
  return (
    <>
      <h1 className="t-hero text-white">Learn<br />Leap<br />Lead</h1>
      <p className="lede mt-5 text-white">SRM Institute of Science and Technology is a multidisciplinary university, founded in 1985 and accredited A++ by NAAC.</p>
    </>
  );
}

// A sheet with SRM cut out of it. Scrolling flies through the letters into the campus.
// The scene is shorter on phones (170 vs 260 viewport heights), the motto is readable from the
// first frame, and "Skip intro" jumps straight to the three journeys. Without JavaScript the
// fx-* classes collapse it to a plain photo with the headline (see globals.css).
export function MaskHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const zoom = useTransform(p, [0, 0.55], [1, 16]);
  const sheet = useTransform(p, [0.3, 0.55], [1, 0]);
  const photo = useTransform(p, [0, 1], [1.3, 1]);
  const copy = useTransform(p, [0.45, 0.65], [0, 1]);
  const copyY = useTransform(p, [0.45, 0.65], [60, 0]);
  // Hide the intro bar from focus and pointers once it has faded out.
  const barVis = useTransform(sheet, (v) => (v < 0.05 ? "hidden" : "visible"));

  if (reduced) {
    return (
      <section className="on-dark relative isolate overflow-hidden bg-black">
        <Image {...IMG} fill priority sizes="100vw" className="-z-10 object-cover opacity-60" />
        <div className="wrap py-20"><Copy /></div>
      </section>
    );
  }

  return (
    <section ref={ref} className="fx-tall on-dark relative h-[calc(var(--vh)*170)] bg-black md:h-[calc(var(--vh)*260)]">
      <div className="fx-pin sticky top-[var(--hdr)] h-[calc(var(--vh)*100-var(--hdr))] min-h-[30rem] overflow-hidden">
        <motion.div style={{ scale: photo }} className="absolute inset-0">
          <Image {...IMG} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <motion.div style={{ opacity: copy }} className="fx-show absolute inset-0 bg-black/55" />
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
        <motion.div style={{ opacity: copy, y: copyY }} className="fx-show absolute inset-0 flex items-center">
          <div className="wrap flex w-full items-end justify-between gap-6">
            <div><Copy /></div>
            <Image src="/images/srm-crest.png" alt="" width={160} height={160} className="hidden h-24 w-24 md:block" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
