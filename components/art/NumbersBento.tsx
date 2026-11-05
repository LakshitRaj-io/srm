"use client";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { homeStats } from "@/data/site";
import { useTilt } from "@/lib/tilt";
import { CountUp } from "./CountUp";

const stat = (label: string) => homeStats.find(([, l]) => l === label)![0];

// A tile that rises into place and leans toward a mouse pointer. Touch and calm devices get a still tile.
function Tile({ i, span = "", tone = "", bg, children }: { i: number; span?: string; tone?: string; bg: ReactNode; children: ReactNode }) {
  const tilt = useTilt(9);
  return (
    <li data-rise="pop" style={{ "--n": i } as CSSProperties} className={`min-h-0 ${span}`}>
      <div {...tilt} className={`tile group relative h-full ${tone}`}>
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl">{bg}<div className="tile-glare absolute inset-0" /></div>
        <div className="relative flex h-full flex-col justify-end gap-1 p-3.5 md:p-5">{children}</div>
      </div>
    </li>
  );
}

function Photo({ src, shade = "from-black/90 via-black/55 to-black/20" }: { src: string; shade?: string }) {
  return (
    <>
      <Image src={src} alt="" fill sizes="(min-width:1024px) 34vw, 50vw" className="tile-img object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-t ${shade}`} />
    </>
  );
}

const Num = ({ v, className = "text-[clamp(1.6rem,3.1vw,3rem)]" }: { v: string; className?: string }) => <p className={`font-semibold leading-none tracking-tight ${className}`}><CountUp value={v} /></p>;
const Label = ({ children, className = "text-ink-soft" }: { children: ReactNode; className?: string }) => <p className={`text-sm font-medium leading-tight md:text-[0.95rem] ${className}`}>{children}</p>;

// SRMIST in numbers: ten figures from data/site.ts, each with a picture of what it counts.
export function NumbersBento() {
  return (
    <ul className="bento mt-4 grid min-h-0 flex-1 grid-cols-2 gap-2 [grid-auto-rows:minmax(5.75rem,1fr)] md:mt-6 md:gap-3 lg:grid-cols-6 lg:grid-rows-3">
      <Tile i={0} span="lg:col-span-2 lg:row-span-2" tone="on-dark text-white" bg={<Photo src="/images/cohort.jpg" shade="from-black/90 via-black/40 to-transparent" />}>
        <Num v={stat("Students")} className="text-[clamp(2rem,6.6vw,6.25rem)]" />
        <Label className="text-white/90 md:text-lg">Students</Label>
      </Tile>

      <Tile i={1} span="lg:col-span-2" tone="on-dark text-white" bg={<div className="absolute inset-0 bg-[linear-gradient(135deg,#0c4da2,#072c60)]" />}>
        <Image src="/images/srm-crest.png" alt="" width={72} height={72} className="absolute right-3 top-3 h-9 w-9 md:right-5 md:top-5 md:h-14 md:w-14" />
        <Num v={stat("Established")} />
        <Label className="text-white/90">Established, Kattankulathur</Label>
      </Tile>

      <Tile i={2} span="lg:col-span-2" tone="text-[#0b1220]" bg={<div className="absolute inset-0 bg-[linear-gradient(135deg,#f6d36b,#e4b316_55%,#c99a0c)]" />}>
        <Num v={stat("Scholarships every year")} />
        <Label className="text-[#0b1220]/85">In scholarships every year</Label>
      </Tile>

      <Tile i={3} tone="on-dark text-white" bg={<Photo src="/images/campus.jpg" />}>
        <Num v={stat("Acre green campus")} />
        <Label className="text-white/90">Acre green campus</Label>
      </Tile>

      <Tile i={4} tone="on-dark text-white" bg={<Photo src="/images/classroom.jpg" />}>
        <Num v={stat("Academicians")} />
        <Label className="text-white/90">Academicians</Label>
      </Tile>

      <Tile i={5} tone="on-dark text-white" bg={
        <div className="absolute inset-0 bg-night">
          <span className="absolute right-3 top-3 grid grid-cols-3 gap-1 md:right-5 md:top-5 md:gap-1.5">{Array.from({ length: 9 }, (_, k) => <span key={k} className="h-1.5 w-1.5 rounded-full bg-gold md:h-2 md:w-2" />)}</span>
        </div>}>
        <Num v={stat("Colleges")} />
        <Label className="text-white/85">Colleges</Label>
      </Tile>

      <Tile i={6} bg={
        <div className="absolute inset-0 bg-tint">
          <span className="absolute inset-x-3 top-3 flex flex-wrap gap-[3px] md:inset-x-5 md:top-5">{Array.from({ length: 111 }, (_, k) => <span key={k} className="h-[3px] w-[3px] rounded-full bg-accent opacity-60" />)}</span>
        </div>}>
        <Num v={stat("Departments")} />
        <Label>Departments</Label>
      </Tile>

      <Tile i={7} span="lg:col-span-2" bg={
        <div className="absolute inset-0 bg-tint">
          <svg viewBox="0 0 120 120" className="absolute -right-6 -top-6 h-[140%] text-accent opacity-30"><g fill="none" stroke="currentColor" strokeWidth="1"><circle cx="60" cy="60" r="56" /><ellipse cx="60" cy="60" rx="24" ry="56" /><ellipse cx="60" cy="60" rx="44" ry="56" /><path d="M4 60h112M12 32h96M12 88h96" /></g></svg>
        </div>}>
        <Num v={stat("International students")} />
        <Label>International students</Label>
      </Tile>

      <Tile i={8} span="lg:col-span-2" tone="on-dark text-white" bg={<Photo src="/images/computers.jpg" />}>
        <Num v={stat("Placement offers, 2026 batch")} />
        <Label className="text-white/90">Placement offers, 2026 batch, as on 9 Sep 2026</Label>
      </Tile>

      <Tile i={9} span="lg:col-span-2" tone="on-dark text-white" bg={<div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgb(228_179_22/0.35),transparent_60%)] bg-night" />}>
        <Num v={stat("Highest CTC, 2026 batch")} className="text-[clamp(1.6rem,3.1vw,3rem)] text-gold" />
        <Label className="text-white/85">Highest CTC, 2026 batch, as on 9 Sep 2026</Label>
      </Tile>
    </ul>
  );
}
