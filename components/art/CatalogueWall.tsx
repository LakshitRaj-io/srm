"use client";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import data from "@/data/programmes.json";

type P = { name: string; url: string; level: string[]; duration: string | null; fee: string | null; intake: string | null };
const GROUPS = [
  { key: "Undergraduate", label: "Undergraduate", color: "#0c4da2" },
  { key: "Post Graduate", label: "Postgraduate", color: "#6f9bd8" },
  { key: "Ph.D", label: "Ph.D.", color: "#e4b316" },
  { key: "other", label: "Other", color: "#b9c4d4" },
];
const groupOf = (p: P) => (GROUPS.find((g) => p.level.includes(g.key)) ?? GROUPS[3]).key;
const rank = (p: P) => GROUPS.findIndex((g) => g.key === groupOf(p));
// Sorted by level so the wall reads as solid bands, largest first.
const ALL = [...(data as P[])].sort((a, b) => rank(a) - rank(b));

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
        <div aria-hidden="true" className={`grid gap-[3px] rounded-2xl border border-line p-3 ${seen ? "wall-in" : ""}`} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(1.1rem, 2.3vw, 1.9rem), 1fr))" }}
          onMouseLeave={() => setHeld(false)}
          onMouseMove={(e) => { const i = (e.target as HTMLElement).dataset.i; if (i) { setHeld(true); setCur(+i); } }}>
          {ALL.map((x, i) => {
            const g = groupOf(x);
            const dim = active && active !== g;
            return <div key={x.url} data-i={i} className="cell" style={{ "--i": i, background: i === cur ? "var(--fg)" : dim ? "var(--line)" : GROUPS.find((y) => y.key === g)!.color } as React.CSSProperties} />;
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Highlight programmes by level">
          {GROUPS.map((g) => (
            <button key={g.key} type="button" aria-pressed={active === g.key} onClick={() => pick(g.key)} className={`btn btn-line min-h-10 text-sm ${active === g.key ? "bg-tint" : ""}`}>
              <span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ background: g.color }} />
              {g.label} {counts[g.key]}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="flex h-full min-h-72 flex-col justify-between bg-tint p-6 line">
          <div>
            <p className="text-sm text-ink-soft">{p.level.join(", ")}</p>
            <p className="mt-2 text-2xl font-semibold leading-tight tracking-tight">{p.name}</p>
          </div>
          <div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-[0.95rem]">
              <div><dt className="text-ink-soft">Length</dt><dd className="font-bold">{p.duration ?? "Not listed"}</dd></div>
              <div><dt className="text-ink-soft">Per year</dt><dd className="font-bold">{p.fee ? `₹${p.fee}` : "Not listed"}</dd></div>
              <div><dt className="text-ink-soft">Intake</dt><dd className="font-bold">{p.intake ?? "Not listed"}</dd></div>
            </dl>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-4 w-full">Open this programme ↗<span className="sr-only"> on srmist.edu.in (opens in a new tab)</span></a>
          </div>
        </div>
      </div>
    </div>
  );
}
