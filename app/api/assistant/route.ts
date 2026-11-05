// Server-side assistant for the programme finder and the SRM Guide.
//
// - The OpenAI key is read only here, from OPENAI_API_KEY, and never sent to the browser.
// - The model sees only: the visitor's (redacted, length-capped) question, up to four short prior
//   turns, and a small list of candidate programmes/pages picked locally from the catalogue.
// - The model can only pick candidate ids (enforced by the JSON schema and re-checked here);
//   names, links, fees and intake always come from the catalogue, never from the model.
// - With no key, on timeout, provider error or rate limit, it answers with labelled local matches.
import { NextResponse } from "next/server";
import { BY_ID, CATALOGUE, LEVELS, detectInterests, localReason, rankProgrammes, type Scored } from "@/lib/catalogue";
import { PAGE_BY_ID, rankPages, type SitePage } from "@/lib/site-pages";
import { LIMITS, type AssistantMode, type AssistantNotice, type AssistantResponse, type ChatTurn, type PageResult, type ProgrammeResult } from "@/lib/assistant-types";

export const runtime = "nodejs";
export const maxDuration = 20;

const TIMEOUT_MS = 12_000;
const DEFAULT_MODEL = "gpt-4.1-mini";
const DURATIONS = new Set(CATALOGUE.flatMap((p) => (p.years ? [p.years] : [])));
const MAX_PROGRAMMES = { programmes: 5, guide: 3 } as const;
const MAX_PAGES = 4;

// ---------- Best-effort rate limit (per server instance; resets on cold start) ----------
const WINDOW_MS = 10 * 60_000;
const MAX_AI_CALLS = 20;
const hits = new Map<string, { n: number; reset: number }>();
function allowAi(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { n: 1, reset: now + WINDOW_MS }); return true; }
  h.n += 1;
  return h.n <= MAX_AI_CALLS;
}

// ---------- Input handling ----------
// Visitors are asked not to share personal details; anything that looks like one is removed
// before the question goes anywhere.
function redact(s: string) {
  return s
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[removed]")
    .replace(/(?:\+?\d[\s-]?){8,}/g, "[removed]")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim();
}

type Parsed = { mode: AssistantMode; question: string; history: ChatTurn[]; level: string; duration: string };

function parse(raw: unknown): Parsed | string {
  if (!raw || typeof raw !== "object") return "Invalid request.";
  const b = raw as Record<string, unknown>;
  const mode = b.mode === "guide" ? "guide" : b.mode === "programmes" ? "programmes" : null;
  if (!mode) return "Invalid mode.";
  if (typeof b.question !== "string") return "Missing question.";
  const question = redact(b.question.replace(/\s+/g, " "));
  if (question.length < 2) return "Please type a question.";
  if (question.length > LIMITS.question) return `Please keep questions under ${LIMITS.question} characters.`;
  const history: ChatTurn[] = Array.isArray(b.history)
    ? b.history
        .filter((t): t is ChatTurn => !!t && typeof t === "object" && ((t as ChatTurn).role === "user" || (t as ChatTurn).role === "assistant") && typeof (t as ChatTurn).text === "string")
        .slice(-LIMITS.historyTurns)
        .map((t) => ({ role: t.role, text: redact(t.text).slice(0, LIMITS.historyText) }))
    : [];
  const level = typeof b.level === "string" && LEVELS.includes(b.level) ? b.level : "";
  const duration = typeof b.duration === "string" && DURATIONS.has(b.duration) ? b.duration : "";
  return { mode, question, history, level, duration };
}

// ---------- Candidates and local answers ----------
const toProgramme = (s: Scored, reason: string): ProgrammeResult => {
  const { id, name, url, level, duration, fee, intake } = s.p;
  return { id, name, url, level, duration, fee, intake, reason };
};
const toPage = ({ id, title, href, external, summary }: SitePage): PageResult => ({ id, title, href, external, summary });

function candidates(q: Parsed) {
  // Use the latest question plus the previous user turn, so follow-ups like "what about masters?" keep context.
  const prevUser = [...q.history].reverse().find((t) => t.role === "user")?.text ?? "";
  const context = `${q.question} ${prevUser}`;
  let progs = rankProgrammes(q.question, { level: q.level, duration: q.duration, limit: 20 });
  if (progs.length < 5 && prevUser) progs = rankProgrammes(context, { level: q.level, duration: q.duration, limit: 20 });
  let pages: SitePage[] = [];
  if (q.mode === "guide") {
    pages = rankPages(q.question, 6);
    if (detectInterests(q.question).length && !pages.some((p) => p.id === "acad-finder")) pages.push(PAGE_BY_ID.get("acad-finder")!);
    for (const id of ["adm-route", "acad-finder", "res-pathways", "off-contact"]) {
      if (pages.length >= 8) break;
      if (!pages.some((p) => p.id === id)) pages.push(PAGE_BY_ID.get(id)!);
    }
    progs = progs.slice(0, 10);
  }
  return { progs, pages };
}

function localAnswer(q: Parsed, notice: AssistantNotice): AssistantResponse {
  // The Guide lists programmes only when the question names a subject, not for "how do I apply".
  const wantProgs = q.mode === "programmes" || detectInterests(q.question).length > 0;
  const progs = wantProgs ? rankProgrammes(q.question, { level: q.level, duration: q.duration, limit: MAX_PROGRAMMES[q.mode] }) : [];
  const pages = q.mode === "guide" ? rankPages(q.question, MAX_PAGES) : [];
  const programmes = progs.map((s) => toProgramme(s, localReason(s)));
  let answer: string;
  if (q.mode === "programmes") {
    answer = programmes.length
      ? `${programmes.length} catalogue ${programmes.length === 1 ? "programme has" : "programmes have"} names that match your words. Check eligibility, fees and dates on each official page.`
      : "No programme names match those words. Try naming a subject, such as biotechnology, nursing, robotics or commerce, or clear a filter.";
  } else {
    answer = pages.length || programmes.length
      ? "These are the closest matches on this site and SRMIST's official pages."
      : "I couldn't find a close match. Try words like apply, fees, scholarships, Ph.D., research centres, or a subject you enjoy.";
  }
  return { source: "local", notice, answer, programmes, pages: pages.map(toPage) };
}

// ---------- AI call ----------
const SYSTEM = `You are the SRM Guide on an independent redesign concept of the SRM Institute of Science and Technology (SRMIST) website. You help visitors find relevant programmes and pages.

Rules:
- Use only the candidate programmes and pages given in the user message. Pick by id. Never mention a programme or page that is not a candidate.
- Do not state or guess eligibility, fees, deadlines, dates, intake, seats, rankings, placements, salaries, outcomes or admission chances. If the visitor asks about these, say the details are on the official page for each programme and pick the most relevant page.
- Never promise or guarantee anything. Do not give personal, financial, legal or medical advice.
- Do not ask for personal information. If the visitor shares any, do not repeat it.
- "answer": 1 to 3 short sentences in plain English, no markdown, no links, no lists.
- "reason" for a programme: one short sentence on how its name or level relates to the visitor's stated interests. Do not describe course content you were not given.
- Prefer quality over quantity: up to ${MAX_PROGRAMMES.programmes} programmes and ${MAX_PAGES} pages. Return empty lists if nothing fits, and say so.
- If the question is unrelated to SRMIST, studying or this site, say briefly that you can only help with SRMIST programmes and pages.`;

const noLinks = (s: string) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/https?:\/\/\S+|www\.\S+/gi, "").replace(/[*_#`>]/g, "").replace(/\s+/g, " ").trim();

function schema(progIds: string[], pageIds: string[]) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["answer", "programmes", "pages"],
    properties: {
      answer: { type: "string" },
      programmes: { type: "array", items: { type: "object", additionalProperties: false, required: ["id", "reason"], properties: { id: { type: "string", enum: progIds.length ? progIds : ["none"] }, reason: { type: "string" } } } },
      pages: { type: "array", items: { type: "string", enum: pageIds.length ? pageIds : ["none"] } },
    },
  };
}

class ProviderError extends Error {}

async function askAi(q: Parsed, key: string): Promise<AssistantResponse | null> {
  const { progs, pages } = candidates(q);
  if (q.mode === "programmes" && progs.length === 0) return null; // Nothing to choose from: no AI call.
  const progIds = progs.map((s) => s.p.id);
  const pageIds = pages.map((p) => p.id);
  const payload = {
    question: q.question,
    filters: { level: q.level || "any", duration: q.duration || "any" },
    candidate_programmes: progs.map((s) => ({ id: s.p.id, name: s.p.name, level: s.p.level.join(", ") || "not listed", duration: s.p.duration ?? "not listed" })),
    candidate_pages: pages.map((p) => ({ id: p.id, title: p.title, about: p.summary })),
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    const base = (process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/+$/, "");
    res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
        messages: [
          { role: "system", content: SYSTEM },
          ...q.history.map((t) => ({ role: t.role, content: t.text })),
          { role: "user", content: JSON.stringify(payload) },
        ],
        response_format: { type: "json_schema", json_schema: { name: "srm_guide_reply", strict: true, schema: schema(progIds, pageIds) } },
        max_completion_tokens: 1200,
        store: false,
      }),
    });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new ProviderError(`status ${res.status}`);

  const data = (await res.json()) as { choices?: { message?: { content?: string | null; refusal?: string | null } }[] };
  const msg = data.choices?.[0]?.message;
  if (!msg?.content || msg.refusal) throw new ProviderError("empty or refused");
  let out: unknown;
  try { out = JSON.parse(msg.content); } catch { throw new ProviderError("invalid JSON"); }

  // Validate the model's output against the candidates we actually sent.
  const o = out as { answer?: unknown; programmes?: unknown; pages?: unknown };
  if (typeof o.answer !== "string" || !Array.isArray(o.programmes) || !Array.isArray(o.pages)) throw new ProviderError("bad shape");
  const allowedP = new Set(progIds);
  const allowedG = new Set(pageIds);
  const seen = new Set<string>();
  const programmes: ProgrammeResult[] = [];
  for (const item of o.programmes) {
    const id = (item as { id?: unknown })?.id;
    const reason = (item as { reason?: unknown })?.reason;
    if (typeof id !== "string" || !allowedP.has(id) || seen.has(id)) continue;
    seen.add(id);
    const p = BY_ID.get(id)!;
    programmes.push(toProgramme({ p, score: 0, matched: [] }, typeof reason === "string" ? noLinks(reason).slice(0, 220) : ""));
    if (programmes.length >= MAX_PROGRAMMES[q.mode]) break;
  }
  const pageOut = [...new Set(o.pages.filter((id): id is string => typeof id === "string" && allowedG.has(id)))].slice(0, MAX_PAGES).map((id) => toPage(PAGE_BY_ID.get(id)!));
  const answer = noLinks(o.answer).slice(0, 700) || "Here are the closest matches I found.";
  return { source: "ai", answer, programmes, pages: pageOut };
}

// ---------- Handlers ----------
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  // Tells the UI whether AI is available. Never reveals the key or the model.
  return json({ configured: Boolean(process.env.OPENAI_API_KEY?.trim()) });
}

export async function POST(req: Request) {
  // Browsers send Origin on cross-site POSTs; refuse other sites using this endpoint.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host) {
    let same = false;
    try { same = new URL(origin).host === host; } catch {}
    if (!same) return json({ error: "Forbidden." }, 403);
  }

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > LIMITS.body) return json({ error: "Request too large." }, 413);
  const text = await req.text();
  if (text.length > LIMITS.body) return json({ error: "Request too large." }, 413);
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return json({ error: "Invalid JSON." }, 400); }
  const q = parse(raw);
  if (typeof q === "string") return json({ error: q }, 400);

  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return json(localAnswer(q, "not-configured"));

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (!allowAi(ip)) return json(localAnswer(q, "rate-limited"));

  try {
    return json((await askAi(q, key)) ?? { ...localAnswer(q, "not-configured"), notice: undefined });
  } catch (e) {
    const timeout = e instanceof Error && e.name === "AbortError";
    // Log the failure type only, never the question.
    console.error(`[assistant] AI fallback: ${timeout ? "timeout" : e instanceof ProviderError ? e.message : "network error"}`);
    return json(localAnswer(q, timeout ? "timeout" : "provider-error"));
  }
}
