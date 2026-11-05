"use client";
import { useDeferredValue, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CATALOGUE, LEVELS, localReason, rankProgrammes, type Programme } from "@/lib/catalogue";
import { AssistantUnavailable, askAssistant } from "@/lib/assistant-client";
import { NOTICE_TEXT, type AssistantResponse, type ProgrammeResult } from "@/lib/assistant-types";

export type { Programme };
const ALL = CATALOGUE;
const DURATIONS = [...new Set(ALL.flatMap((p) => (p.years ? [p.years] : [])))].sort((a, b) => parseFloat(a) - parseFloat(b));
const PAGE = 24;
const EXAMPLES = ["I enjoy biology and want to work in healthcare.", "I like AI and robotics.", "I want to study business after school."];

function ProgrammeRow({ p, reason }: { p: Omit<Programme, "years">; reason?: string }) {
  return (
    <li className="panel grid gap-2 px-4 py-4 sm:px-5 md:grid-cols-[1fr_16rem] md:items-center md:gap-6">
      <div className="min-w-0">
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-block py-1 font-semibold leading-snug [overflow-wrap:anywhere] hover:text-accent hover:underline">
          {p.name}<span className="sr-only"> (official page on srmist.edu.in, opens in a new tab)</span> <span aria-hidden="true" className="text-accent">↗</span>
        </a>
        <p className="text-[0.9rem] text-ink-soft">{p.level.join(", ") || "Level not listed"}</p>
        {reason ? <p className="mt-1.5 text-[0.95rem]">{reason}</p> : null}
      </div>
      <dl className="grid grid-cols-3 gap-3 text-[0.9rem]">
        <div><dt className="text-ink-soft">Length</dt><dd className="font-medium">{p.duration ?? "Not listed"}</dd></div>
        <div><dt className="text-ink-soft">Per year</dt><dd className="font-medium">{p.fee ? `₹${p.fee}` : "Not listed"}</dd></div>
        <div><dt className="text-ink-soft">Intake</dt><dd className="font-medium">{p.intake ?? "Not listed"}</dd></div>
      </dl>
    </li>
  );
}

type Ask = { status: "idle" } | { status: "loading"; asked: string } | { status: "done"; asked: string; res: AssistantResponse; offline?: boolean; filters: string } | { status: "error"; asked: string; message: string };

// "Describe what you enjoy": natural-language suggestions from the catalogue. The server route
// uses AI when it is configured and labelled keyword matches when it isn't.
function Recommender({ level, duration }: { level: string; duration: string }) {
  const [text, setText] = useState("");
  const [ask, setAsk] = useState<Ask>({ status: "idle" });
  const ctrl = useRef<AbortController | null>(null);
  const out = useRef<HTMLDivElement>(null);
  const filters = `${level}|${duration}`;

  const run = async (question: string) => {
    const q = question.trim();
    if (q.length < 2) return;
    ctrl.current?.abort();
    const c = (ctrl.current = new AbortController());
    setAsk({ status: "loading", asked: q });
    try {
      const res = await askAssistant({ mode: "programmes", question: q, level: level || undefined, duration: duration || undefined }, c.signal);
      setAsk({ status: "done", asked: q, res, filters });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      if (e instanceof AssistantUnavailable) {
        // The route itself is unreachable: fall back to the same keyword matching, in the browser.
        const programmes: ProgrammeResult[] = rankProgrammes(q, { level, duration, limit: 5 }).map((s) => ({ ...s.p, reason: localReason(s) }));
        setAsk({ status: "done", asked: q, offline: true, filters, res: { source: "local", answer: programmes.length ? "These catalogue programmes have names that match your words." : "No programme names match those words. Try naming a subject.", programmes, pages: [] } });
      } else {
        setAsk({ status: "error", asked: q, message: e instanceof Error ? e.message : "Something went wrong." });
      }
    }
  };

  const submit = (e: FormEvent) => { e.preventDefault(); run(text); };
  const clear = () => { ctrl.current?.abort(); setAsk({ status: "idle" }); setText(""); };

  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-line bg-surface">
      <form onSubmit={submit} className="grid gap-5 p-5 md:p-7 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <label htmlFor="pf-ask" className="block text-2xl font-semibold leading-tight tracking-tight md:text-3xl">Describe what you enjoy</label>
          <p className="mt-2 text-ink-soft">Say what you like or where you want to work. You'll get a short list of catalogue programmes, each linked to its official page.</p>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea id="pf-ask" rows={2} maxLength={400} value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); run(text); } }}
              placeholder="I like building things and want to work on electric vehicles" aria-describedby="pf-ask-note"
              className="field mt-0 min-h-[3.25rem] flex-1 resize-y" />
            <button type="submit" disabled={ask.status === "loading" || text.trim().length < 2} className="btn btn-blue shrink-0 disabled:opacity-50 sm:self-stretch">
              {ask.status === "loading" ? "Searching…" : "Suggest programmes"}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example questions">
            {EXAMPLES.map((x) => (
              <button key={x} type="button" onClick={() => { setText(x); run(x); }} className="rounded-full border border-line px-3 py-1.5 text-left text-sm hover:border-accent hover:text-accent">{x}</button>
            ))}
          </div>
          <p id="pf-ask-note" className="mt-3 text-sm text-ink-soft">Please don't include personal details. When AI is on, your question is sent to OpenAI to rank catalogue programmes; nothing is saved by this site.</p>
        </div>
      </form>

      <div ref={out} tabIndex={-1} aria-live="polite" className="border-t border-line bg-tint p-5 empty:hidden md:p-7">
        {ask.status === "loading" ? <p className="guide-wait font-medium">Looking through {ALL.length} programmes…</p> : null}
        {ask.status === "error" ? <p role="alert">{ask.message}</p> : null}
        {ask.status === "done" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="t-card">Suggestions for “{ask.asked}”</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ask.res.source === "ai" ? "bg-accent text-surface" : "border border-line"}`}>
                {ask.res.source === "ai" ? "AI suggestion, from the catalogue" : "Keyword matches, not AI"}
              </span>
            </div>
            {ask.offline ? <p className="mt-2 text-sm text-ink-soft">The suggestion service couldn't be reached, so these are keyword matches from the catalogue.</p> : ask.res.notice ? <p className="mt-2 text-sm text-ink-soft">{NOTICE_TEXT[ask.res.notice]}</p> : null}
            {ask.filters !== filters ? <p className="mt-2 text-sm font-medium">Your filters have changed. Ask again to update these suggestions.</p> : level || duration ? <p className="mt-2 text-sm text-ink-soft">Limited by your filters: {[level, duration].filter(Boolean).join(", ")}.</p> : null}
            <p className="mt-3 measure">{ask.res.answer}</p>
            {ask.res.programmes.length ? (
              <ul className="mt-4 space-y-2">{ask.res.programmes.map((p) => <ProgrammeRow key={p.id} p={p} reason={p.reason} />)}</ul>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-soft">Suggestions can be wrong. Eligibility, fees, dates and intake are confirmed only on each programme's official page.</p>
              <button type="button" onClick={clear} className="link text-sm">Clear suggestions</button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

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
    <>
      <Recommender level={level} duration={duration} />
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
        <form role="search" aria-label="Programmes" onSubmit={(e) => e.preventDefault()} className="panel grid gap-4 p-5 sm:grid-cols-2 lg:sticky lg:top-24 lg:col-span-4 lg:grid-cols-1">
          <div className="sm:col-span-2 lg:col-span-1">
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
          {filtered ? <button type="button" onClick={reset} className="link justify-self-start py-1">Clear search and filters</button> : null}
        </form>

        <div className="min-w-0 lg:col-span-8">
          <p role="status" aria-live="polite" className="text-xl font-semibold tracking-tight">
            {results.length} {results.length === 1 ? "programme" : "programmes"}{level ? `, ${level}` : ""}{duration ? `, ${duration}` : ""}
          </p>

          {results.length === 0 ? (
            <p className="mt-4">No programmes match. Try a shorter search, clear a filter, or describe what you enjoy above.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {results.slice(0, limit).map((p) => <ProgrammeRow key={p.url} p={p} />)}
            </ul>
          )}
          {results.length > limit ? (
            <button type="button" onClick={() => setLimit(limit + PAGE)} className="btn btn-line mt-5">
              Show {Math.min(PAGE, results.length - limit)} more of {results.length - limit}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
