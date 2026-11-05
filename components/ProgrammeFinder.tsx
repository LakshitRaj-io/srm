"use client";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import data from "@/data/programmes.json";

export type Programme = { name: string; url: string; level: string[]; duration: string | null; years: string | null; fee: string | null; intake: string | null };
const ALL = data as Programme[];
const LEVELS = ["Undergraduate", "Post Graduate", "Integrated Course", "Ph.D", "Diploma", "PG Diploma", "Fellowship Program", "Super Specialty Program"];
const DURATIONS = [...new Set(ALL.flatMap((p) => (p.years ? [p.years] : [])))].sort((a, b) => parseFloat(a) - parseFloat(b));
const PAGE = 24;

export function ProgrammeFinder() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const dq = useDeferredValue(q);

  useEffect(() => {
    const pick = (e: Event) => { setQ(""); setDuration(""); setLevel((e as CustomEvent<string>).detail); setLimit(PAGE); };
    window.addEventListener("srm-level", pick);
    return () => window.removeEventListener("srm-level", pick);
  }, []);

  const results = useMemo(() => {
    const words = dq.toLowerCase().split(/\s+/).filter(Boolean);
    return ALL.filter((p) => (!level || p.level.includes(level)) && (!duration || p.years === duration) && words.every((w) => p.name.toLowerCase().includes(w)));
  }, [dq, level, duration]);

  const counts = useMemo(() => Object.fromEntries(LEVELS.map((l) => [l, ALL.filter((p) => p.level.includes(l)).length])), []);
  const reset = () => { setQ(""); setLevel(""); setDuration(""); setLimit(PAGE); };
  const filtered = q || level || duration;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
      <form role="search" aria-label="Programmes" onSubmit={(e) => e.preventDefault()} className="panel space-y-4 p-5 lg:sticky lg:top-24 lg:col-span-4">
        <div>
          <label htmlFor="pf-q" className="font-semibold">Programme name</label>
          <input id="pf-q" type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder="Try computer science or nursing" className="field" />
        </div>
        <div>
          <label htmlFor="pf-level" className="font-semibold">Level of study</label>
          <select id="pf-level" value={level} onChange={(e) => { setLevel(e.target.value); setLimit(PAGE); }} className="field">
            <option value="">All levels</option>
            {LEVELS.map((l) => (<option key={l} value={l}>{l} ({counts[l]})</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="pf-duration" className="font-semibold">Duration</label>
          <select id="pf-duration" value={duration} onChange={(e) => { setDuration(e.target.value); setLimit(PAGE); }} className="field">
            <option value="">Any duration</option>
            {DURATIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        {filtered ? <button type="button" onClick={reset} className="link">Clear search and filters</button> : null}
      </form>

      <div className="lg:col-span-8">
        <p role="status" aria-live="polite" className="text-xl font-semibold tracking-tight">
          {results.length} {results.length === 1 ? "programme" : "programmes"}{level ? `, ${level}` : ""}{duration ? `, ${duration}` : ""}
        </p>

        {results.length === 0 ? (
          <p className="mt-4">No programmes match. Try a shorter search or clear a filter.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {results.slice(0, limit).map((p) => (
              <li key={p.url} className="panel grid gap-2 px-5 py-4 md:grid-cols-[1fr_16rem] md:items-center md:gap-6">
                <div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-block py-0.5 font-semibold leading-snug hover:text-accent hover:underline">
                    {p.name}<span className="sr-only"> (official page on srmist.edu.in, opens in a new tab)</span> <span aria-hidden="true" className="text-accent">↗</span>
                  </a>
                  <p className="text-[0.9rem] text-ink-soft">{p.level.join(", ") || "Level not listed"}</p>
                </div>
                <dl className="grid grid-cols-3 gap-3 text-[0.9rem]">
                  <div><dt className="text-ink-soft">Length</dt><dd className="font-medium">{p.duration ?? "Not listed"}</dd></div>
                  <div><dt className="text-ink-soft">Per year</dt><dd className="font-medium">{p.fee ? `₹${p.fee}` : "Not listed"}</dd></div>
                  <div><dt className="text-ink-soft">Intake</dt><dd className="font-medium">{p.intake ?? "Not listed"}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        )}
        {results.length > limit ? (
          <button type="button" onClick={() => setLimit(limit + PAGE)} className="btn btn-line mt-5">
            Show {Math.min(PAGE, results.length - limit)} more of {results.length - limit}
          </button>
        ) : null}
      </div>
    </div>
  );
}
