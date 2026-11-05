"use client";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const MARK = { backgroundImage: "linear-gradient(var(--color-gold), var(--color-gold))", backgroundRepeat: "no-repeat", backgroundPosition: "0 55%" };

function Marked({ word, p, range }: { word: string; p: MotionValue<number>; range: [number, number] }) {
  const backgroundSize = useTransform(p, range, ["0% 78%", "100% 78%"]);
  return <motion.span style={{ ...MARK, backgroundSize }}>{word}</motion.span>;
}

// Black text that is always readable. A gold marker strikes through the facts as you scroll.
export function ScrubText({ text, marks, className = "" }: { text: string; marks: string[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  let n = 0;
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => {
        if (!marks.includes(w)) return <span key={i}>{w} </span>;
        const at = n++;
        return <span key={i}>{reduced ? <span style={{ ...MARK, backgroundSize: "100% 78%" }}>{w}</span> : <Marked word={w} p={p} range={[at / marks.length, (at + 1) / marks.length]} />} </span>;
      })}
    </p>
  );
}
