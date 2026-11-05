"use client";
import { useCalm } from "@/lib/calm";
import { useInView } from "motion/react";
import Image from "next/image";
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { homeStats } from "@/data/site";
import { Scramble } from "./Scramble";

const stat = (label: string) => homeStats.find(([, l]) => l === label)![0];

// A tile that flips up into place and leans toward a mouse pointer. Its number sits on a raised
// layer (translateZ), so the tilt shows real depth. Touch and reduced motion get a still tile.
function Tile({ i, className = "", bg, children }: { i: number; className?: string; bg?: ReactNode; children: ReactNode }) {
  const reduced = useCalm();
  const move = (e: PointerEvent<HTMLLIElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.classList.add("is-tilting");
    el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 12}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const leave = (e: PointerEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    el.classList.remove("is-tilting");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return (
    <li onPointerMove={move} onPointerLeave={leave} style={{ "--i": i } as CSSProperties} className={`tile relative min-h-44 ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl border border-line">{bg}<div className="tile-glare absolute inset-0" /></div>
      <div className="tile-pop relative flex h-full flex-col justify-between gap-6 p-5 md:p-6">{children}</div>
    </li>
  );
}

function Num({ v, className = "" }: { v: string; className?: string }) {
  return <p className={`font-semibold leading-none tracking-tight ${className}`}><Scramble value={v} /></p>;
}
const Label = ({ children, className = "text-ink-soft" }: { children: ReactNode; className?: string }) => <p className={`text-[0.95rem] font-medium ${className}`}>{children}</p>;

// SRMIST in numbers as a bento of 3D tiles. Every figure comes from data/site.ts.
export function NumbersBento() {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  return (
    <ul ref={ref} className={`bento mt-10 grid auto-rows-[minmax(11rem,auto)] grid-cols-2 gap-3 lg:grid-cols-4 ${seen ? "bento-in" : ""}`}>
      <Tile i={0} className="col-span-2 min-h-72 text-white lg:row-span-2"
        bg={<><Image src="/images/cohort.jpg" alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" /></>}>
        <p aria-hidden="true" className="w-fit rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur-md">Learn. Leap. Lead.</p>
        <div><Num v={stat("Students")} className="text-[clamp(3.5rem,8vw,7rem)]" /><Label className="mt-2 text-lg text-white/90">Students</Label></div>
      </Tile>

      <Tile i={1} className="col-span-2" bg={<div className="absolute inset-0 bg-tint" />}>
        <div className="flex h-full items-center justify-between gap-4">
          <div><Num v={stat("Established")} className="text-[clamp(3rem,6vw,5rem)]" /><Label className="mt-2">Established, Kattankulathur</Label></div>
          <Image src="/images/srm-crest.png" alt="" width={72} height={72} className="h-16 w-16 shrink-0" />
        </div>
      </Tile>

      <Tile i={2} bg={<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgb(34_160_90/0.35),transparent_60%)] bg-tint" />}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 text-[#22a05a]"><path fill="currentColor" d="M20 3C9 3 4 9 4 16c0 1.7.4 3.3 1 4.6l1.4-1.1C8 15 11 12 16 10c-4 2.6-6.8 5.8-8.4 10C17 20.5 21 13 20 3z" /></svg>
        <div><Num v={stat("Acre green campus")} className="text-[clamp(1.9rem,4vw,3.25rem)]" /><Label className="mt-2">Acre green campus</Label></div>
      </Tile>

      <Tile i={3} bg={<div className="absolute inset-0 bg-tint" />}>
        <span aria-hidden="true" className="h-1.5 w-10 rounded-full bg-accent" />
        <div><Num v={stat("Academicians")} className="text-[clamp(1.9rem,4vw,3.25rem)]" /><Label className="mt-2">Academicians</Label></div>
      </Tile>

      <Tile i={4} className="text-white" bg={<div className="absolute inset-0 bg-blue" />}>
        <span aria-hidden="true" className="grid w-fit grid-cols-3 gap-1">{Array.from({ length: 9 }, (_, k) => <span key={k} className="h-2 w-2 rounded-sm bg-white/80" />)}</span>
        <div><Num v={stat("Colleges")} className="text-[clamp(2.75rem,5vw,4rem)]" /><Label className="mt-2 text-white/85">Colleges</Label></div>
      </Tile>

      <Tile i={5} bg={<div className="absolute inset-0 bg-tint" />}>
        <span aria-hidden="true" className="flex gap-1">{Array.from({ length: 12 }, (_, k) => <span key={k} className="h-5 w-1 rounded-full bg-accent" style={{ opacity: 0.25 + (k % 4) * 0.25 }} />)}</span>
        <div><Num v={stat("Departments")} className="text-[clamp(1.9rem,4vw,3.25rem)]" /><Label className="mt-2">Departments</Label></div>
      </Tile>

      <Tile i={6} className="col-span-2" bg={<div className="absolute inset-0 bg-tint" />}>
        <p className="max-w-[60%] text-ink-soft">Students from abroad, on one campus.</p>
        <div><Num v={stat("International students")} className="text-[clamp(2.75rem,5vw,4rem)]" /><Label className="mt-2">International students</Label></div>
      </Tile>

      <Tile i={7} className="col-span-2 text-[#0b1220]" bg={<div className="absolute inset-0 bg-[linear-gradient(135deg,#f6d36b,#e4b316_55%,#c99a0c)]" />}>
        <p className="w-fit rounded-full bg-black/10 px-3 py-1 text-sm font-semibold">Every year</p>
        <div><Num v={stat("Scholarships every year")} className="text-[clamp(2.75rem,5vw,4rem)]" /><Label className="mt-2 text-[#0b1220]/80">In scholarships</Label></div>
      </Tile>

      <Tile i={8} bg={<div className="absolute inset-0 bg-tint" />}>
        <span className="text-sm font-semibold text-accent">2026 batch, as on 9 Sep 2026</span>
        <div><Num v={stat("Placement offers, 2026 batch")} className="text-[clamp(1.7rem,3.4vw,2.75rem)]" /><Label className="mt-2">Placement offers</Label></div>
      </Tile>

      <Tile i={9} className="on-dark text-white" bg={<div className="absolute inset-0 bg-night" />}>
        <span className="text-sm font-semibold text-gold">2026 batch, as on 9 Sep 2026</span>
        <div><Num v={stat("Highest CTC, 2026 batch")} className="text-[clamp(1.7rem,3.4vw,2.75rem)] text-gold" /><Label className="mt-2 text-white/80">Highest CTC</Label></div>
      </Tile>
    </ul>
  );
}
