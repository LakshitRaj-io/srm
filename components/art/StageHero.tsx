"use client";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

export type StageOption = { label: string; stat?: string; line: string; image: string; alt: string; cta: string; href: string; level?: string };

// Full-screen landing stage. Each option repaints the background, the message and the action.
export function StageHero({ title, options }: { title: string[]; options: StageOption[] }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [cur, setCur] = useState(0);
  const [touched, setTouched] = useState(false);
  const o = options[cur];

  useEffect(() => {
    if (touched || reduced) return;
    const id = setInterval(() => setCur((c) => (c + 1) % options.length), 4500);
    return () => clearInterval(id);
  }, [touched, reduced, options.length]);

  const move = (e: PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = root.current!.getBoundingClientRect();
    root.current!.style.setProperty("--mx", String((e.clientX - r.left) / r.width - 0.5));
    root.current!.style.setProperty("--my", String((e.clientY - r.top) / r.height - 0.5));
  };
  const pick = (i: number) => { setTouched(true); setCur(i); };

  return (
    <section ref={root} onPointerMove={move} className="stage on-dark relative isolate flex min-h-[calc(100svh-4.7rem)] flex-col justify-between overflow-hidden bg-black text-white">
      <div className="stage-bg absolute -inset-8 -z-20">
        {options.map((x, i) => (
          <Image key={x.image} src={x.image} alt={i === cur ? x.alt : ""} fill priority={i === 0} sizes="100vw" className={`stage-img object-cover ${i === cur ? "is-on" : ""}`} />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/85 to-transparent" />

      <div className="wrap w-full pt-16 md:pt-24">
        <h1 className="t-page" aria-label={title.join(" ")}>
          {title.map((l, i) => (
            <span key={l} aria-hidden="true" className="block overflow-hidden"><span className="slam block" style={{ "--d": `${i * 120}ms` } as CSSProperties}>{l}</span></span>
          ))}
        </h1>
      </div>

      <div className="wrap w-full pb-5 pt-10">
        <div aria-live="polite" className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <p key={cur} className="stage-line lede">{o.line}</p>
          <a href={o.href} onClick={() => { if (o.level !== undefined) window.dispatchEvent(new CustomEvent("srm-level", { detail: o.level })); }} className="btn btn-gold">{o.cta}</a>
        </div>
        <div role="group" aria-label="Choose a view" className="grid grid-cols-2 gap-[3px] border border-white bg-white lg:grid-cols-4">
          {options.map((x, i) => (
            <button key={x.label} type="button" aria-pressed={i === cur} onPointerEnter={(e) => { if (e.pointerType === "mouse") pick(i); }} onFocus={() => pick(i)} onClick={() => pick(i)}
              className={`min-h-14 rounded-xl px-4 py-2.5 text-left transition-colors ${i === cur ? "bg-white text-black" : "text-white hover:bg-white/15"}`}>
              {x.stat ? <span className="block text-2xl font-semibold leading-tight tracking-tight">{x.stat}</span> : null}
              <span className="block text-[0.95rem] font-medium leading-snug">{x.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
