"use client";
import { useCalm } from "@/lib/calm";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Digits riffle like a departures board, then land on the real value. The real value is
// what renders first, so no zero or placeholder is ever shown.
export function Scramble({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useCalm();
  const [text, setText] = useState(value);

  useEffect(() => {
    if (!seen || reduced) return;
    const frames = 16;
    let f = 0;
    const id = setInterval(() => {
      f++;
      const locked = Math.floor((f / frames) * value.length);
      setText(value.split("").map((c, i) => (i >= locked && /\d/.test(c) ? String(Math.floor(Math.random() * 10)) : c)).join(""));
      if (f >= frames) { clearInterval(id); setText(value); }
    }, 50);
    return () => clearInterval(id);
  }, [seen, reduced, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">{text}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
