// Local, deterministic matching over the official programme catalogue and this site's pages.
// Used on its own when no AI key is configured, and to pick the small candidate set the AI may
// choose from when one is. Nothing here invents data: every result is a catalogue entry or a
// page listed in lib/site-pages.ts.
import data from "@/data/programmes.json";

export type Programme = { name: string; url: string; level: string[]; duration: string | null; years: string | null; fee: string | null; intake: string | null };
export type CatalogueEntry = Programme & { id: string };

export const CATALOGUE: CatalogueEntry[] = (data as Programme[]).map((p, i) => ({ ...p, id: `p${i}` }));
export const BY_ID = new Map(CATALOGUE.map((p) => [p.id, p]));

export const LEVELS = ["Undergraduate", "Post Graduate", "Integrated Course", "Ph.D", "Diploma", "PG Diploma", "Fellowship Program", "Super Specialty Program"];

// An interest is recognised by any of its triggers in the question, then looks for its terms in
// programme names. Stems match the start of a word ("robot" matches "robotics"); terms of three
// letters or fewer must match a whole word.
type Interest = { label: string; triggers: string[]; terms: string[] };
const INTERESTS: Interest[] = [
  { label: "biology", triggers: ["biolog", "bio", "life science", "genetic", "dna", "cells", "microb", "zoolog", "botan"], terms: ["bio", "genetic", "microbio", "physiolog", "anatomy", "life science", "regenerative", "embryolog", "immuno", "neuroscience"] },
  { label: "healthcare", triggers: ["health", "medical", "medicine", "doctor", "hospital", "patient", "clinic", "nurs", "care for", "caring", "heal"], terms: ["nursing", "nurse", "pharm", "physiotherapy", "occupational", "medical", "medicine", "health", "clinical", "dental", "mbbs", "optometry", "radiology", "paramedic", "dialysis", "respiratory", "cardiac", "anaesthesia", "nutrition", "laboratory", "hospital", "audiology", "physician", "emergency"] },
  { label: "artificial intelligence", triggers: ["ai", "a.i", "artificial", "machine learning", "ml", "intelligen", "deep learning", "genai", "generative", "llm", "neural"], terms: ["artificial intelligence", "machine learning", "ai", "generative", "agentic", "machine intelligence", "machine vision"] },
  { label: "robotics", triggers: ["robot", "automation", "mechatron", "drone", "autonomous"], terms: ["robot", "automation", "mechatronics", "drone", "cyber physical", "industrial automation"] },
  { label: "computing", triggers: ["computer", "coding", "code", "programming", "software", "developer", "app", "apps", "web", "website"], terms: ["computer", "software", "information technology", "full stack", "cloud", "computing", "devsecops", "internet of things"] },
  { label: "data", triggers: ["data", "analytic", "statistic", "big data"], terms: ["data", "analytics", "statistic"] },
  { label: "cyber security", triggers: ["cyber", "security", "hacking", "hacker", "forensic"], terms: ["cyber", "security", "forensic", "blockchain"] },
  { label: "business", triggers: ["business", "management", "manage", "entrepreneur", "startup", "manager", "marketing", "mba", "bba", "company", "commerce"], terms: ["business", "management", "bba", "mba", "commerce", "b.com", "marketing", "fintech", "administration", "supply chain", "logistics"] },
  { label: "finance", triggers: ["financ", "accounting", "accountant", "account", "bank", "money", "invest", "stock", "ca", "tax", "economics"], terms: ["financ", "accounting", "banking", "capital markets", "taxation", "fintech", "insurance", "economics"] },
  { label: "law", triggers: ["law", "legal", "lawyer", "justice", "court", "crimin", "advocate"], terms: ["law", "ll.b", "ll.m", "legum", "criminology", "justice"] },
  { label: "design", triggers: ["design", "art", "arts", "creative", "fashion", "interior", "architect", "drawing", "visual"], terms: ["design", "architecture", "architectural", "fashion", "interior", "visual communication"] },
  { label: "media", triggers: ["media", "journalis", "film", "writing", "writer", "news", "communication", "english", "literature"], terms: ["journalism", "mass communication", "visual communication", "english", "digital marketing"] },
  { label: "psychology", triggers: ["psycholog", "mind", "mental", "counsel", "behaviour", "behavior", "therapy", "therapist"], terms: ["psycholog", "counselling", "psychiatr", "neuroscience"] },
  { label: "agriculture", triggers: ["agri", "farm", "crop", "plant", "food", "horticult", "soil", "garden"], terms: ["agricultur", "horticulture", "agronomy", "plant", "soil", "food", "entomology", "floriculture"] },
  { label: "electronics", triggers: ["electronic", "electrical", "circuit", "chip", "semiconductor", "vlsi", "hardware", "embedded"], terms: ["electronic", "electrical", "vlsi", "semiconductor", "embedded", "ic design", "instrumentation", "power"] },
  { label: "mechanical and aerospace", triggers: ["mechanic", "car", "cars", "automobile", "vehicle", "aero", "aircraft", "plane", "space", "rocket", "engine"], terms: ["mechanical", "automobile", "automotive", "aerospace", "aeronautical", "vehicle", "space", "thermal"] },
  { label: "civil and environment", triggers: ["civil", "building", "construction", "infrastructure", "environment", "climate", "sustainab", "energy", "solar"], terms: ["civil", "construction", "structural", "environmental", "geotechnical", "green energy", "solar", "disaster", "remote sensing", "biosustainability"] },
  { label: "physical sciences", triggers: ["physics", "chemistry", "math", "maths", "quantum", "nano"], terms: ["physics", "chemistry", "mathematics", "quantum", "nanotechnology", "statistics"] },
  { label: "teaching", triggers: ["teach", "teacher", "teaching", "educator"], terms: ["b.ed", "education"] },
  { label: "sport", triggers: ["sport", "fitness", "yoga", "athlet", "exercise"], terms: ["sport", "physical education", "yoga"] },
  { label: "dentistry", triggers: ["dent", "teeth", "tooth"], terms: ["dental", "dentistry", "endodontics"] },
  { label: "pharmacy", triggers: ["pharma", "drug", "drugs"], terms: ["pharm"] },
  { label: "hospitality", triggers: ["hotel", "cook", "cooking", "culinary", "chef", "hospitality"], terms: ["culinary", "hotel", "catering"] },
  { label: "social impact", triggers: ["social", "policy", "society", "ngo", "public", "community", "helping", "volunteer"], terms: ["social work", "public policy", "public health", "community"] },
];

const LEVEL_HINTS: [RegExp, string][] = [
  [/\b(after (school|12th|class 12|plus two|\+2|higher secondary|hsc)|school|12th|undergrad\w*|bachelor\w*|ug)\b/, "Undergraduate"],
  [/\b(master\w*|postgrad\w*|post graduate|pg|after (my )?(degree|graduation|bachelor\w*|b\.?tech))\b/, "Post Graduate"],
  [/\b(ph\.?\s?d|doctora\w*|research degree)\b/, "Ph.D"],
  [/\bdiploma\b/, "Diploma"],
];

const STOP = new Set("i im i'm me my we a an the and or but to of in on at for with from by about into like love enjoy enjoyed want wanted would wish hope plan planning interested interest interests passionate good great really very much also some something things thing field fields area areas course courses programme programmes program programs degree degrees study studying studies learn learning career careers job jobs work working future become be get do make find help me please which what where how can could should is are am was it its that this these those after before school college university srm srmist am have has had any best top".split(" "));

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const termRe = (t: string) => new RegExp(t.length <= 3 ? `\\b${esc(t)}\\b` : `\\b${esc(t)}`, "i");
const TERM_RES = new Map(INTERESTS.flatMap((x) => x.terms).map((t) => [t, termRe(t)]));

export function normalise(q: string) {
  return q.toLowerCase().replace(/[“”"']/g, " ").replace(/\s+/g, " ").trim();
}

function tokens(q: string) {
  return normalise(q).split(/[^a-z0-9.+]+/).map((t) => t.replace(/^\.+|\.+$/g, "")).filter(Boolean);
}

export function detectInterests(q: string) {
  const text = normalise(q);
  const toks = tokens(q);
  return INTERESTS.filter((x) => x.triggers.some((tr) => (tr.includes(" ") ? text.includes(tr) : tr.length <= 3 ? toks.includes(tr) : toks.some((t) => t.startsWith(tr)))));
}

export function detectLevel(q: string): string | null {
  const text = normalise(q);
  for (const [re, level] of LEVEL_HINTS) if (re.test(text)) return level;
  return null;
}

export type Scored = { p: CatalogueEntry; score: number; matched: string[] };

// Ranks the catalogue for a free-text question. Hard filters (from the finder's selects) are
// applied first; a level mentioned in the question only boosts.
export function rankProgrammes(question: string, opts: { level?: string; duration?: string; limit?: number } = {}): Scored[] {
  const interests = detectInterests(question);
  const hint = detectLevel(question);
  const words = tokens(question).filter((w) => w.length >= 3 && !STOP.has(w));
  const out: Scored[] = [];

  for (const p of CATALOGUE) {
    if (opts.level && !p.level.includes(opts.level)) continue;
    if (opts.duration && p.years !== opts.duration) continue;
    const name = p.name.toLowerCase();
    let score = 0;
    const matched: string[] = [];
    for (const it of interests) {
      const hits = it.terms.filter((t) => TERM_RES.get(t)!.test(name)).length;
      if (hits) { score += 4 + Math.min(hits, 3); matched.push(it.label); }
    }
    for (const w of words) if (new RegExp(`\\b${esc(w)}`).test(name)) score += 3;
    if (score === 0) continue;
    if (matched.length > 1) score += 4 * (matched.length - 1);
    if (hint && p.level.includes(hint)) score += 3;
    if (/^minor degree/i.test(p.name)) score -= 2;
    out.push({ p, score, matched });
  }
  out.sort((a, b) => b.score - a.score || a.p.name.length - b.p.name.length);

  // Diversify: each further pick from the same interest mix costs a little, so a question about
  // "AI and robotics" surfaces both rather than five near-identical robotics programmes.
  const limit = opts.limit ?? 24;
  const used = new Map<string, number>();
  const picked: Scored[] = [];
  const pool = out.slice(0, Math.max(limit * 4, 40));
  while (picked.length < limit && pool.length) {
    let best = 0;
    let bestEff = -Infinity;
    pool.forEach((s, i) => {
      const eff = s.score - 4 * (used.get(s.matched.join("+")) ?? 0);
      if (eff > bestEff) { bestEff = eff; best = i; }
    });
    const [s] = pool.splice(best, 1);
    const k = s.matched.join("+");
    used.set(k, (used.get(k) ?? 0) + 1);
    picked.push(s);
  }
  return picked;
}

// Why a local match was chosen, in plain words, without claiming anything about the programme.
export function localReason(s: Scored) {
  return s.matched.length ? `Name matches your interest in ${s.matched.join(" and ")}.` : "Name matches words in your question.";
}
