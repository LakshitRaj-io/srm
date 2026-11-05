"use client";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

function Step({ i, title, text, onSee }: { i: number; title: string; text: string; onSee: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const on = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (on) onSee(i); }, [on, i, onSee]);
  return (
    <li ref={ref} className="flex min-h-[46svh] flex-col justify-center border-b-[3px] border-black py-8 last:border-b-0">
      <h3 className="text-5xl md:text-7xl"><span className="lg:hidden">{i + 1}. </span>{title}</h3>
      <p className="lede mt-3">{text}</p>
    </li>
  );
}

// A giant numeral stays pinned while the four steps pass it.
export function ScrollSteps({ steps }: { steps: readonly (readonly [string, string])[] }) {
  const [cur, setCur] = useState(0);
  return (
    <div className="grid lg:grid-cols-12">
      <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 overflow-hidden font-display text-[min(36rem,70svh)] font-extrabold leading-[0.82] text-blue">
          <span key={cur} className="slam block">{cur + 1}</span>
        </div>
      </div>
      <ol className="lg:col-span-7">
        {steps.map(([t, d], i) => (<Step key={t} i={i} title={t} text={d} onSee={setCur} />))}
      </ol>
    </div>
  );
}
