"use client";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

function Word({ word, p, range }: { word: string; p: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(p, range, [0.14, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

// A sentence that inks itself in, word by word, as you scroll.
export function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  if (reduced) return <p className={className}>{text}</p>;
  return (
    <>
      <p className="sr-only">{text}</p>
      <p ref={ref} aria-hidden="true" className={className}>
        {words.map((w, i) => (<Word key={i} word={w} p={p} range={[i / words.length, (i + 1) / words.length]} />))}
      </p>
    </>
  );
}
