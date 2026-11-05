"use client";
import { useDeferredValue, useMemo, useState } from "react";
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

  const results = useMemo(() => {
    const words = dq.toLowerCase().split(/\s+/).filter(Boolean);
    return ALL.filter((p) => (!level || p.level.includes(level)) && (!duration || p.years === duration) && words.every((w) => p.name.toLowerCase().includes(w)));
  }, [dq, level, duration]);

  const counts = useMemo(() => Object.fromEntries(LEVELS.map((l) => [l, ALL.filter((p) => p.level.includes(l)).length])), []);
  const reset = () => { setQ(""); setLevel(""); setDuration(""); setLimit(PAGE); };
  const filtered = q || level || duration;
  const field = "mt-1 w-full border-2 border-ink bg-paper px-3 py-2.5";

  return (
    <div>
      <form role="search" aria-label="Programmes" onSubmit={(e) => e.preventDefault()} className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label htmlFor="pf-q" className="font-semibold">Search by programme name</label>
          <input id="pf-q" type="search" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder="e.g. computer science, MBA, nursing" className={field} />
        </div>
        <div>
          <label htmlFor="pf-level" className="font-semibold">Level of study</label>
          <select id="pf-level" value={level} onChange={(e) => { setLevel(e.target.value); setLimit(PAGE); }} className={field}>
            <option value="">All levels</option>
            {LEVELS.map((l) => (<option key={l} value={l}>{l} ({counts[l]})</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="pf-duration" className="font-semibold">Duration</label>
          <select id="pf-duration" value={duration} onChange={(e) => { setDuration(e.target.value); setLimit(PAGE); }} className={field}>
            <option value="">Any duration</option>
            {DURATIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
        <p role="status" aria-live="polite" className="font-display text-2xl font-bold">
          {results.length} {results.length === 1 ? "programme" : "programmes"}
          {level ? ` · ${level}` : ""}{duration ? ` · ${duration}` : ""}
        </p>
        {filtered ? <button type="button" onClick={reset} className="font-semibold underline">Clear search and filters</button> : null}
      </div>

      {results.length === 0 ? (
        <p className="py-10">No programmes match. Try a shorter search or clear a filter.</p>
      ) : (
        <ul className="divide-y divide-ink/20">
          {results.slice(0, limit).map((p) => (
            <li key={p.url} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
              <div>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-blue hover:decoration-blue">
                  {p.name}<span className="sr-only"> (official page on srmist.edu.in, opens in a new tab)</span> <span aria-hidden="true">↗</span>
                </a>
                <p className="text-sm text-ink-soft">{p.level.join(", ") || "Level not listed"}</p>
              </div>
              <dl className="flex gap-6 text-sm">
                {p.duration ? <div><dt className="text-ink-soft">Duration</dt><dd className="font-semibold">{p.duration}</dd></div> : null}
                {p.fee ? <div><dt className="text-ink-soft">Annual fee</dt><dd className="font-semibold">₹{p.fee}</dd></div> : null}
                {p.intake ? <div><dt className="text-ink-soft">Intake</dt><dd className="font-semibold">{p.intake}</dd></div> : null}
              </dl>
            </li>
          ))}
        </ul>
      )}
      {results.length > limit ? (
        <button type="button" onClick={() => setLimit(limit + PAGE)} className="mt-6 border-2 border-ink px-5 py-3 font-bold hover:bg-ink hover:text-paper">
          Show {Math.min(PAGE, results.length - limit)} more of {results.length - limit} remaining
        </button>
      ) : null}
    </div>
  );
}
