"use client";
import { useState } from "react";
import { centres } from "@/data/site";

const place = (i: number, n: number, r: number, off = 0) => {
  const a = ((i / n) * 360 + off) * (Math.PI / 180);
  return { left: `${50 + r * Math.cos(a)}%`, top: `${50 + r * Math.sin(a)}%` };
};

// The ten centres circling the university. Select one to read about it.
export function Orbit() {
  const [cur, setCur] = useState(0);
  const inner = centres.slice(0, 5);
  const outer = centres.slice(5);
  const [abbr, name, desc] = centres[cur];
  const node = (c: (typeof centres)[number], i: number, n: number, r: number, off: number) => {
    const idx = centres.indexOf(c);
    return (
      <div key={c[0]} className="absolute -translate-x-1/2 -translate-y-1/2" style={place(i, n, r, off)}>
        <div className="orbit-node">
          <button type="button" aria-pressed={cur === idx} aria-label={c[1]} onMouseEnter={() => setCur(idx)} onFocus={() => setCur(idx)} onClick={() => setCur(idx)}
            className={`min-h-9 min-w-11 rounded-full border border-line px-2.5 py-1 text-xs font-semibold md:text-sm ${cur === idx ? "bg-blue text-white" : "bg-surface text-fg"}`}>{c[0]}</button>
        </div>
      </div>
    );
  };
  return (
    <div className="grid items-center gap-8 lg:grid-cols-12">
      <div className="orbit relative mx-auto aspect-square w-full max-w-[38rem] lg:col-span-7">
        <div aria-hidden="true" className="absolute inset-[6%] rounded-full border border-line" />
        <div aria-hidden="true" className="absolute inset-[26%] rounded-full border border-line" />
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue text-sm font-semibold text-white md:text-lg">SRMIST</div>
        <div className="orbit-ring absolute inset-0">{inner.map((c, i) => node(c, i, 5, 24, 0))}</div>
        <div className="orbit-ring absolute inset-0">{outer.map((c, i) => node(c, i, 5, 44, 36))}</div>
      </div>
      <div aria-live="polite" className="rounded-2xl border border-line bg-surface p-6 lg:col-span-5">
        <p className="text-4xl font-semibold tracking-tight text-accent">{abbr}</p>
        <p className="mt-3 text-xl font-semibold leading-snug">{name}</p>
        <p className="mt-2 text-ink-soft">{desc}</p>
      </div>
    </div>
  );
}
