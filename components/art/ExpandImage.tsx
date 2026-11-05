"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

// A framed photo opens out until it fills the screen.
export function ExpandImage({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clipPath = useTransform(p, [0, 0.7], ["inset(20% 24% 20% 24%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(p, [0, 0.7], [1.3, 1]);
  const opacity = useTransform(p, [0.55, 0.8], [0, 1]);

  if (reduced) {
    return (
      <figure className="relative h-[calc(var(--vh)*70)]">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
        <figcaption className="absolute bottom-6 left-6 rounded-full bg-black/60 px-4 py-2 font-medium text-white backdrop-blur-md">{caption}</figcaption>
      </figure>
    );
  }
  return (
    <section ref={ref} aria-label={caption} className="fx-tall relative h-[calc(var(--vh)*150)] bg-surface md:h-[calc(var(--vh)*220)]">
      <div className="fx-pin sticky top-0 h-[calc(var(--vh)*100)] overflow-hidden">
        <motion.div style={{ clipPath }} className="fx-show absolute inset-0">
          <motion.div style={{ scale }} className="absolute inset-0">
            <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
          </motion.div>
        </motion.div>
        <motion.p style={{ opacity }} className="fx-show absolute bottom-6 left-6 rounded-full bg-black/60 px-4 py-2 font-medium text-white backdrop-blur-md">{caption}</motion.p>
      </div>
    </section>
  );
}
