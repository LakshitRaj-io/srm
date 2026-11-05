"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AssistantUnavailable, aiConfigured, askAssistant } from "@/lib/assistant-client";
import { LIMITS, NOTICE_TEXT, type AssistantResponse, type ChatTurn } from "@/lib/assistant-types";

type Msg = { id: number; role: "user"; text: string } | { id: number; role: "assistant"; res: AssistantResponse } | { id: number; role: "error"; text: string };

const STARTERS = ["How do I apply from India?", "Which programmes suit someone who likes AI?", "Where are fees and scholarships?", "How do I start a Ph.D.?"];

function Answer({ res, onNavigate }: { res: AssistantResponse; onNavigate: () => void }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-soft">{res.source === "ai" ? "AI answer, from site and catalogue data" : "Keyword matches, not AI"}</p>
      {res.notice ? <p className="mt-1 text-sm text-ink-soft">{NOTICE_TEXT[res.notice]}</p> : null}
      <p className="mt-1.5">{res.answer}</p>
      {res.pages.length ? (
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {res.pages.map((p) => (
            <li key={p.id}>
              {p.external ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="block px-3 py-2.5 hover:bg-tint">
                  <span className="block font-medium leading-snug text-accent">{p.title} <span aria-hidden="true">↗</span><span className="sr-only"> (official SRMIST site, opens in a new tab)</span></span>
                  <span className="block text-sm text-ink-soft">{p.summary}</span>
                </a>
              ) : (
                <Link href={p.href} onClick={onNavigate} className="block px-3 py-2.5 hover:bg-tint">
                  <span className="block font-medium leading-snug text-accent">{p.title}</span>
                  <span className="block text-sm text-ink-soft">{p.summary}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : null}
      {res.programmes.length ? (
        <>
          <p className="mt-3 text-sm font-semibold">Programmes</p>
          <ul className="mt-1 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {res.programmes.map((p) => (
              <li key={p.id}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="block px-3 py-2.5 hover:bg-tint">
                  <span className="block font-medium leading-snug text-accent [overflow-wrap:anywhere]">{p.name} <span aria-hidden="true">↗</span><span className="sr-only"> (official page on srmist.edu.in, opens in a new tab)</span></span>
                  <span className="block text-sm text-ink-soft">{[p.level.join(", "), p.duration].filter(Boolean).join(" · ") || "Details on the official page"}</span>
                  {p.reason ? <span className="mt-0.5 block text-sm">{p.reason}</span> : null}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-xs text-ink-soft">Check eligibility, fees and dates on each official page.</p>
        </>
      ) : null}
    </div>
  );
}

// Compact, site-wide guide to this redesign's pages and the official SRMIST pages it links to.
// Not modal: the page stays usable behind it. Escape or the close button dismiss it.
export function SrmGuide() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null | undefined>(undefined);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const ctrl = useRef<AbortController | null>(null);
  const nextId = useRef(1);
  const wasOpen = useRef(false);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  // Focus moves into the panel on open and back to the launcher on close.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const fine = matchMedia("(pointer: fine)").matches;
      (fine ? input.current : panel.current)?.focus();
      if (configured === undefined) aiConfigured().then(setConfigured);
    } else if (wasOpen.current) {
      wasOpen.current = false;
      launcher.current?.focus();
    }
  }, [open, configured]);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { e.preventDefault(); close(); } };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open, close]);

  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    end.current?.scrollIntoView({ block: "end", behavior: still ? "auto" : "smooth" });
  }, [msgs, busy]);

  const send = async (question: string) => {
    const q = question.trim();
    if (q.length < 2 || busy) return;
    const history: ChatTurn[] = msgs
      .flatMap((m): ChatTurn[] => (m.role === "user" ? [{ role: "user", text: m.text }] : m.role === "assistant" ? [{ role: "assistant", text: m.res.answer }] : []))
      .slice(-LIMITS.historyTurns);
    setMsgs((m) => [...m, { id: nextId.current++, role: "user", text: q }]);
    setText("");
    setBusy(true);
    ctrl.current?.abort();
    const c = (ctrl.current = new AbortController());
    try {
      const res = await askAssistant({ mode: "guide", question: q, history }, c.signal);
      setMsgs((m) => [...m, { id: nextId.current++, role: "assistant", res }]);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      const text = e instanceof AssistantUnavailable
        ? "The Guide couldn't be reached. Check your connection and try again, or use the menu to browse Admissions, Academics and Research."
        : e instanceof Error ? e.message : "Something went wrong.";
      setMsgs((m) => [...m, { id: nextId.current++, role: "error", text }]);
    } finally {
      if (ctrl.current === c) setBusy(false);
    }
  };

  const submit = (e: FormEvent) => { e.preventDefault(); send(text); };

  if (!mounted) return null; // The Guide needs JavaScript; without it, nothing dead is shown.

  if (!open) {
    return (
      <button ref={launcher} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={false}
        className="btn btn-gold fixed bottom-4 right-4 z-50 min-h-12 gap-2 rounded-full pl-2 pr-4 shadow-[0_10px_30px_rgb(0_0_0/0.28)] md:bottom-6 md:right-6">
        <Image src="/images/srm-crest.png" alt="" width={32} height={32} className="h-8 w-8 rounded-full bg-white" />
        SRM Guide
      </button>
    );
  }

  return (
    <div ref={panel} role="dialog" aria-modal="false" aria-labelledby="guide-title" tabIndex={-1}
      className="guide-panel fixed inset-x-2 bottom-2 z-50 flex max-h-[calc(var(--vh)*85)] flex-col overflow-hidden rounded-2xl border border-line bg-surface text-fg shadow-[0_24px_60px_rgb(0_0_0/0.35)] outline-none sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[25rem] sm:max-h-[min(42rem,calc(var(--vh)*100-6rem))] md:bottom-6 md:right-6">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Image src="/images/srm-crest.png" alt="" width={32} height={32} className="h-8 w-8 shrink-0" />
          <div className="min-w-0">
            <h2 id="guide-title" className="text-lg leading-tight">SRM Guide</h2>
            <p className="text-xs text-ink-soft">{configured === true ? "AI answers from site and catalogue data" : configured === false ? "Keyword search of this site and catalogue" : "Finds pages and programmes"}</p>
          </div>
        </div>
        <button type="button" onClick={close} aria-label="Close SRM Guide" title="Close (Esc)" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-2xl leading-none hover:bg-tint">×</button>
      </div>

      <div role="log" aria-live="polite" aria-busy={busy} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4">
        {msgs.length === 0 ? (
          <div>
            <p>Ask where to find admissions, programmes or research on this site. I'll point you to the right page here or on the official SRMIST site.</p>
            {configured === false ? <p className="mt-2 text-sm text-ink-soft">AI isn't switched on for this site, so answers are keyword matches, not AI.</p> : null}
            <p className="mt-4 text-sm font-semibold">Try asking</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {STARTERS.map((s) => (<li key={s}><button type="button" onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-sm hover:border-accent hover:text-accent">{s}</button></li>))}
            </ul>
          </div>
        ) : null}
        {msgs.map((m) =>
          m.role === "user" ? (
            <p key={m.id} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-tint px-3.5 py-2 [overflow-wrap:anywhere]"><span className="sr-only">You asked: </span>{m.text}</p>
          ) : m.role === "assistant" ? (
            <Answer key={m.id} res={m.res} onNavigate={close} />
          ) : (
            <p key={m.id} role="alert" className="rounded-xl border border-line px-3.5 py-2 text-sm">{m.text}</p>
          ),
        )}
        {busy ? <p className="guide-wait text-sm font-medium text-ink-soft">Searching the site…</p> : null}
        <div ref={end} />
      </div>

      <form onSubmit={submit} className="border-t border-line px-4 pb-3 pt-3">
        <div className="flex gap-2">
          <label htmlFor="guide-q" className="sr-only">Ask the SRM Guide</label>
          <input ref={input} id="guide-q" type="text" autoComplete="off" maxLength={LIMITS.question} value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Ask about admissions, programmes, research" aria-describedby="guide-privacy" className="field mt-0 min-w-0 flex-1" />
          <button type="submit" disabled={busy || text.trim().length < 2} className="btn btn-blue shrink-0 disabled:opacity-50">Ask</button>
        </div>
        <p id="guide-privacy" className="mt-2 text-xs text-ink-soft">Don't share personal details. With AI on, questions go to OpenAI to find pages; this site stores nothing. Answers can be wrong; check official pages.</p>
      </form>
    </div>
  );
}
