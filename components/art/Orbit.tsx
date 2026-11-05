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
            className={`min-h-11 min-w-11 border-[3px] border-black px-1.5 py-1 font-display text-base font-black leading-none md:text-xl ${cur === idx ? "bg-gold text-black" : "bg-white text-black"}`}>{c[0]}</button>
        </div>
      </div>
    );
  };
  return (
    <div className="grid items-center gap-8 lg:grid-cols-12">
      <div className="orbit relative mx-auto aspect-square w-full max-w-[38rem] lg:col-span-7">
        <div aria-hidden="true" className="absolute inset-[6%] rounded-full border-[3px] border-black" />
        <div aria-hidden="true" className="absolute inset-[26%] rounded-full border-[3px] border-black" />
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue font-display text-2xl font-black text-white md:text-4xl">SRMIST</div>
        <div className="orbit-ring absolute inset-0">{inner.map((c, i) => node(c, i, 5, 24, 0))}</div>
        <div className="orbit-ring absolute inset-0">{outer.map((c, i) => node(c, i, 5, 44, 36))}</div>
      </div>
      <div aria-live="polite" className="bg-black p-6 text-white lg:col-span-5">
        <p className="font-display text-7xl font-black leading-none text-gold md:text-8xl">{abbr}</p>
        <p className="mt-3 text-xl font-bold leading-snug">{name}</p>
        <p className="mt-2">{desc}</p>
      </div>
    </div>
  );
}
