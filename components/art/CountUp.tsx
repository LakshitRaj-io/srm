"use client";
import { useCalm } from "@/lib/calm";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Counts up to a figure each time it comes into view. The real value renders first and is what
// screen readers get, so no zero or placeholder is ever the only thing on the page.
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { amount: 0.5 });
  const calm = useCalm();
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = value.match(/^(\D*)([\d,]+)(.*)$/);
    if (!seen || calm || !m) return;
    const end = Number(m[2].replace(/,/g, ""));
    const grouped = m[2].includes(",");
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 1400);
      const v = Math.round(end * (1 - (1 - k) ** 4));
      setText(`${m[1]}${grouped ? v.toLocaleString("en-US") : v}${m[3]}`);
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); setText(value); };
  }, [seen, calm, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">{text}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
