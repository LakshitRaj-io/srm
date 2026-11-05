"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Seal } from "./Seal";

const IMG = { src: "/images/campus.jpg", alt: "Aerial view of the SRMIST Kattankulathur campus beside a lake" };

function Copy() {
  return (
    <>
      <h1 className="t-hero text-white">Learn<br />Leap<br />Lead</h1>
      <p className="lede mt-5 text-white">SRM Institute of Science and Technology is a multidisciplinary university, founded in 1985 and accredited A++ by NAAC.</p>
    </>
  );
}

// White sheet with SRM cut out of it. Scrolling flies through the letters into the campus.
export function MaskHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const zoom = useTransform(p, [0, 0.62], [1, 16]);
  const sheet = useTransform(p, [0.4, 0.62], [1, 0]);
  const photo = useTransform(p, [0, 1], [1.3, 1]);
  const copy = useTransform(p, [0.58, 0.76], [0, 1]);
  const copyY = useTransform(p, [0.58, 0.76], [60, 0]);

  if (reduced) {
    return (
      <section className="on-dark relative isolate overflow-hidden bg-black">
        <Image {...IMG} fill priority sizes="100vw" className="-z-10 object-cover opacity-60" />
        <div className="wrap py-20"><Copy /></div>
      </section>
    );
  }

  return (
    <section ref={ref} className="on-dark relative h-[280svh] bg-black">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ scale: photo }} className="absolute inset-0">
          <Image {...IMG} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <motion.div style={{ opacity: copy }} className="absolute inset-0 bg-black/55" />
        <motion.div aria-hidden="true" style={{ opacity: sheet }} className="absolute inset-0 grid place-items-center overflow-hidden bg-white mix-blend-screen">
          <motion.span style={{ scale: zoom }} className="block font-display text-[min(40vw,78svh)] font-extrabold leading-[0.8] text-black">SRM</motion.span>
        </motion.div>
        <motion.div aria-hidden="true" style={{ opacity: sheet }} className="absolute inset-x-0 bottom-5 z-10">
          <div className="wrap flex items-end justify-between gap-4 text-black">
            <p className="font-display text-2xl font-extrabold uppercase leading-none md:text-4xl">Institute of Science and Technology</p>
            <p className="shrink-0 font-bold">Scroll to enter</p>
          </div>
        </motion.div>
        <motion.div style={{ opacity: copy, y: copyY }} className="absolute inset-0 flex items-center">
          <div className="wrap flex w-full items-end justify-between gap-6">
            <div><Copy /></div>
            <div className="hidden md:block"><Seal size="13rem" /></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
