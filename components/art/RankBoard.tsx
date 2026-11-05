"use client";
import type { CSSProperties, ReactNode } from "react";
import { ExtLink } from "@/components/ExtLink";
import { WWW, nirf } from "@/data/site";
import { useTilt } from "@/lib/tilt";
import { CountUp } from "./CountUp";

// A pane of 3D glass that leans toward the pointer and pops out of the wall on hover.
export function Glass({ i = 0, as: Tag = "div", className = "", children }: { i?: number; as?: "div" | "li"; className?: string; children: ReactNode }) {
  const tilt = useTilt(16);
  return (
    <Tag data-rise="pop" style={{ "--n": i } as CSSProperties} className={className}>
      <div {...tilt} className="glass flex h-full flex-col justify-center">
        <span aria-hidden="true" className="glass-glare" />
        {children}
      </div>
    </Tag>
  );
}

// The NIRF 2025 results and the QS band as a wall of glass tiles.
export function RankBoard() {
  return (
    <ul aria-label="NIRF 2025 and QS ranks" className="grid min-h-0 flex-1 grid-cols-3 gap-2 md:auto-rows-fr md:grid-cols-4 md:gap-3">
      {nirf.map(([k, v], i) => (
        <Glass key={k} as="li" i={i} className="min-h-0">
          <p className="glass-num text-[clamp(1.5rem,3.2vw,2.75rem)] font-semibold leading-none tracking-tight"><CountUp value={v} /></p>
          <p className="mt-1.5 text-xs leading-tight text-white/85 md:text-sm">{k}</p>
        </Glass>
      ))}
      <Glass as="li" i={nirf.length} className="col-span-3 min-h-0 md:col-span-2">
        <p className="glass-num text-[clamp(1.5rem,3.2vw,2.75rem)] font-semibold leading-none tracking-tight text-gold">1001-1200</p>
        <p className="mt-1.5 text-xs leading-tight text-white/85 md:text-sm">QS World University Rankings 2027 · <ExtLink className="font-semibold underline" href={`${WWW}/about-us/accreditations-and-rankings/`} showHost={false}>See all years</ExtLink></p>
      </Glass>
    </ul>
  );
}
