"use client";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import data from "@/data/programmes.json";

type P = { name: string; url: string; level: string[]; duration: string | null; fee: string | null; intake: string | null };
const ALL = data as P[];
const GROUPS = [
  { key: "Undergraduate", label: "Undergraduate", color: "#0b4ea2" },
  { key: "Post Graduate", label: "Postgraduate", color: "#000000" },
  { key: "Ph.D", label: "Ph.D.", color: "#f5b82e" },
  { key: "other", label: "Other", color: "#9aa7bd" },
];
const groupOf = (p: P) => (GROUPS.find((g) => p.level.includes(g.key)) ?? GROUPS[3]).key;

// One cell for every programme in the catalogue. Move across it to read each one.
export function CatalogueWall() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [cur, setCur] = useState(0);
  const [held, setHeld] = useState(false);
  const counts = useMemo(() => Object.fromEntries(GROUPS.map((g) => [g.key, ALL.filter((p) => groupOf(p) === g.key).length])), []);

  useEffect(() => {
    if (held || reduced || !seen) return;
    const id = setInterval(() => {
      const pool = ALL.map((p, i) => ({ p, i })).filter((x) => !active || groupOf(x.p) === active);
      setCur(pool[Math.floor(Math.random() * pool.length)].i);
    }, 1300);
    return () => clearInterval(id);
  }, [held, reduced, seen, active]);

  const pick = (key: string) => {
    const next = active === key ? null : key;
    setActive(next);
    if (next) setCur(ALL.findIndex((p) => groupOf(p) === next));
  };
  const p = ALL[cur];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div ref={ref} className="lg:col-span-8">
        <div aria-hidden="true" className={`grid gap-[3px] border-[3px] border-black bg-black p-[3px] ${seen ? "wall-in" : ""}`} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(1.1rem, 2.3vw, 1.9rem), 1fr))" }}
          onMouseLeave={() => setHeld(false)}
          onMouseMove={(e) => { const i = (e.target as HTMLElement).dataset.i; if (i) { setHeld(true); setCur(+i); } }}>
          {ALL.map((x, i) => {
            const g = groupOf(x);
            const dim = active && active !== g;
            return <div key={x.url} data-i={i} className="cell" style={{ "--i": i, background: i === cur ? "#fff" : dim ? "#2a2a2a" : GROUPS.find((y) => y.key === g)!.color } as React.CSSProperties} />;
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Highlight programmes by level">
          {GROUPS.map((g) => (
            <button key={g.key} type="button" aria-pressed={active === g.key} onClick={() => pick(g.key)} className={`btn min-h-11 ${active === g.key ? "bg-black text-white" : "bg-white text-black"}`}>
              <span aria-hidden="true" className="h-4 w-4 border-2 border-black" style={{ background: g.color }} />
              {g.label} {counts[g.key]}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="flex h-full min-h-72 flex-col justify-between bg-gold p-5 line">
          <div>
            <p className="font-semibold">{p.level.join(", ")}</p>
            <p className="mt-2 font-display text-4xl font-black uppercase leading-[0.95] md:text-5xl">{p.name}</p>
          </div>
          <div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-[0.95rem]">
              <div><dt>Length</dt><dd className="font-bold">{p.duration ?? "Not listed"}</dd></div>
              <div><dt>Per year</dt><dd className="font-bold">{p.fee ? `₹${p.fee}` : "Not listed"}</dd></div>
              <div><dt>Intake</dt><dd className="font-bold">{p.intake ?? "Not listed"}</dd></div>
            </dl>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-4 w-full">Open this programme ↗<span className="sr-only"> on srmist.edu.in (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
    </div>
  );
}
