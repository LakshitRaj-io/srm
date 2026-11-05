"use client";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

// A photo that wipes open once, then drifts inside its frame as the page moves past it.
export function Parallax({ src, alt, className = "", priority = false, sizes = "100vw", speed = 9 }: { src: string; alt: string; className?: string; priority?: boolean; sizes?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl bg-tint ${className}`}>
      <motion.div
        initial={priority || reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={seen || priority || reduced ? { clipPath: "inset(0 0 0% 0)" } : undefined}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute inset-0"
      >
        <motion.div style={{ ...(reduced ? {} : { y }), top: `-${speed + 3}%`, bottom: `-${speed + 3}%` }} className="absolute inset-x-0">
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}
