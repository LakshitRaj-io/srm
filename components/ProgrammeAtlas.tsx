"use client";
import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { CATALOGUE, LEVELS, type CatalogueEntry } from "@/lib/catalogue";

// Catalogue levels, in plain words. The repo has no verified faculty mapping, so level is the only grouping.
const NAMES: Record<string, string> = {
  Undergraduate: "Undergraduate", "Post Graduate": "Postgraduate", "Ph.D": "Ph.D.", "Integrated Course": "Integrated", "Super Specialty Program": "Super specialty",
  Diploma: "Diploma", "PG Diploma": "PG diploma", "Fellowship Program": "Fellowship",
};
const ORDER = [...LEVELS].sort((a, b) => count(b) - count(a));
const DURATIONS = [...new Set(CATALOGUE.flatMap((p) => (p.years ? [p.years] : [])))].sort((a, b) => parseFloat(a) - parseFloat(b));
const STEP = 6;

function count(level: string) {
  return CATALOGUE.filter((p) => p.level.includes(level)).length;
}

function Details({ p }: { p: CatalogueEntry }) {
  return (
    <>
      <dl className="grid grid-cols-3 gap-3">
        <div><dt className="text-sm text-ink-soft">Length</dt><dd className="font-medium">{p.duration ?? "Not listed"}</dd></div>
        <div><dt className="text-sm text-ink-soft">Per year</dt><dd className="font-medium">{p.fee ? `₹${p.fee}` : "Not listed"}</dd></div>
        <div><dt className="text-sm text-ink-soft">Intake</dt><dd className="font-medium">{p.intake ?? "Not listed"}</dd></div>
      </dl>
      <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-blue mt-5 w-full">Open official page ↗<span className="sr-only"> for {p.name} on srmist.edu.in (opens in a new tab)</span></a>
    </>
  );
}

export function ProgrammeAtlas() {
  const id = useId();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [open, setOpen] = useState<string[]>([ORDER[0]]);
  const [shown, setShown] = useState<Record<string, number>>({});
  const [sel, setSel] = useState<CatalogueEntry | null>(null);
  const dq = useDeferredValue(q);

  const results = useMemo(() => {
    const words = dq.toLowerCase().split(/\s+/).filter(Boolean);
    return CATALOGUE.filter((p) => (!level || p.level.includes(level)) && (!duration || p.years === duration) && words.every((w) => p.name.toLowerCase().includes(w)));
  }, [dq, level, duration]);

  const groups = useMemo(() => ORDER.map((l) => ({ level: l, items: results.filter((p) => p.level.includes(l)) })).filter((g) => g.items.length), [results]);
  const filtered = Boolean(dq.trim() || level || duration);
  const isOpen = (l: string) => filtered || open.includes(l);
  const toggle = (l: string) => setOpen((o) => (o.includes(l) ? o.filter((x) => x !== l) : [...o, l]));
  const reset = () => { setQ(""); setLevel(""); setDuration(""); };
  const chips: [string, () => void][] = [
    ...(q.trim() ? [[`“${q.trim()}”`, () => setQ("")] as [string, () => void]] : []),
    ...(level ? [[NAMES[level], () => setLevel("")] as [string, () => void]] : []),
    ...(duration ? [[duration, () => setDuration("")] as [string, () => void]] : []),
  ];

  return (
    <div>
      <form role="search" aria-label="Programmes" onSubmit={(e) => e.preventDefault()} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-6">
          <label htmlFor={`${id}q`} className="text-sm font-medium">Programme name</label>
          <input id={`${id}q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try nursing or data science" className="field" />
        </div>
        <div className="lg:col-span-3">
          <label htmlFor={`${id}l`} className="text-sm font-medium">Level</label>
          <select id={`${id}l`} value={level} onChange={(e) => setLevel(e.target.value)} className="field">
            <option value="">All levels</option>
            {ORDER.map((l) => <option key={l} value={l}>{NAMES[l]} ({count(l)})</option>)}
          </select>
        </div>
        <div className="lg:col-span-3">
          <label htmlFor={`${id}d`} className="text-sm font-medium">Duration</label>
          <select id={`${id}d`} value={duration} onChange={(e) => setDuration(e.target.value)} className="field">
            <option value="">Any duration</option>
            {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </form>

      <div className="mt-6 flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2">
        <p role="status" aria-live="polite" className="text-lg font-semibold tracking-tight">{results.length} of {CATALOGUE.length} programmes</p>
        {chips.length ? (
          <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
            {chips.map(([l, clear]) => (
              <li key={l}><button type="button" onClick={clear} className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-tint px-3 text-sm font-medium hover:bg-mist">{l} <span aria-hidden="true">×</span><span className="sr-only"> (remove filter)</span></button></li>
            ))}
            <li><button type="button" onClick={reset} className="link min-h-9 px-1 text-sm">Clear all</button></li>
          </ul>
        ) : null}
      </div>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          {groups.length === 0 ? (
            <div className="rounded-2xl bg-tint p-6">
              <p className="font-medium">No programmes match.</p>
              <p className="mt-1 text-ink-soft">Try a shorter name or remove a filter.</p>
              <button type="button" onClick={reset} className="btn btn-line mt-4">Clear all</button>
            </div>
          ) : (
            <ul className="border-t border-line">
              {groups.map((g) => {
                const on = isOpen(g.level);
                const limit = shown[g.level] ?? STEP;
                const panel = `${id}${g.level.replace(/\W/g, "")}`;
                return (
                  <li key={g.level} className="border-b border-line">
                    <h3 className="text-base tracking-normal">
                      <button type="button" aria-expanded={on} aria-controls={panel} onClick={() => toggle(g.level)} disabled={filtered} className="grid min-h-14 w-full grid-cols-[1fr_auto_1.25rem] items-center gap-3 py-3 text-left font-semibold enabled:hover:text-accent">
                        <span>{NAMES[g.level]}</span>
                        <span className="font-normal tabular-nums text-ink-soft">{g.items.length}</span>
                        <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 justify-self-end transition-transform ${on ? "rotate-180" : ""} ${filtered ? "opacity-0" : ""}`}><path d="M2 4.5 6 8.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                      </button>
                    </h3>
                    <div aria-hidden="true" className="-mt-1 mb-2 h-1 overflow-hidden rounded-full bg-tint"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(1.5, (g.items.length / CATALOGUE.length) * 100)}%` }} /></div>
                    {on ? (
                      <div id={panel} className="pb-3">
                        <ul>
                          {g.items.slice(0, limit).map((p) => {
                            const picked = sel?.id === p.id;
                            return (
                              <li key={p.id}>
                                <button type="button" aria-expanded={picked} onClick={() => setSel(picked ? null : p)} className={`block min-h-11 w-full rounded-lg px-3 py-2.5 text-left leading-snug [overflow-wrap:anywhere] ${picked ? "bg-tint font-medium text-accent" : "hover:bg-tint"}`}>{p.name}</button>
                                {picked ? <div className="mx-3 mb-3 mt-2 lg:hidden"><Details p={p} /></div> : null}
                              </li>
                            );
                          })}
                        </ul>
                        {g.items.length > limit ? (
                          <button type="button" onClick={() => setShown((s) => ({ ...s, [g.level]: limit + 20 }))} className="link mt-1 min-h-11 px-3">Show {Math.min(20, g.items.length - limit)} more of {g.items.length - limit}</button>
                        ) : null}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside aria-label="Selected programme" className="hidden rounded-3xl bg-tint p-7 lg:sticky lg:top-24 lg:col-span-5 lg:block">
          <div aria-live="polite">
            {sel ? (
              <>
                <p className="text-sm text-ink-soft">{sel.level.map((l) => NAMES[l] ?? l).join(", ")}</p>
                <p className="mb-6 mt-1 text-2xl font-semibold leading-tight tracking-tight">{sel.name}</p>
                <Details p={sel} />
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold leading-tight tracking-tight">Select a programme</p>
                <p className="mt-2 text-ink-soft">Its length, annual fee, intake and official page appear here.</p>
              </>
            )}
          </div>
        </aside>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/academics#finder" className="btn btn-blue">Open the full programme finder</Link>
        <Link href="/academics#pf-ask" className="btn btn-line">Not sure? Describe what you enjoy</Link>
      </div>
      <p className="mt-4 text-sm text-ink-soft">Details as listed in the official Program Finder. Confirm eligibility and fees on each official page.</p>
    </div>
  );
}
