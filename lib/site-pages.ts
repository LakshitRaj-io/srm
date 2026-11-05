// Every destination the SRM Guide may suggest: pages and sections of this redesign, plus official
// SRMIST pages already linked from it. The Guide (AI or local) can only return ids from this list.
import { INTL_PORTAL, PORTAL, WWW } from "@/data/site";
import { normalise } from "./catalogue";

export type SitePage = { id: string; title: string; href: string; external: boolean; summary: string; keywords: string[] };

export const SITE_PAGES: SitePage[] = [
  { id: "home", title: "Home", href: "/", external: false, summary: "Overview of SRMIST: numbers, rankings, campus life and the programme wall.", keywords: ["home", "overview", "about", "campus", "life", "ranking", "rankings", "nirf", "naac", "qs", "accreditation", "numbers", "hostel", "news"] },
  { id: "adm-route", title: "Admissions: find your route", href: "/admissions#finder", external: false, summary: "Two questions lead to the right official application page.", keywords: ["apply", "application", "admission", "admissions", "route", "how", "where", "form", "start", "2027"] },
  { id: "adm-steps", title: "Admissions: how to apply", href: "/admissions#steps", external: false, summary: "Four steps from choosing a route to signing in on the official portal.", keywords: ["steps", "process", "how", "apply", "register", "registration", "portal", "sign", "login"] },
  { id: "adm-by-programme", title: "Admissions: apply by programme", href: "/admissions#routes", external: false, summary: "Official application links grouped by programme area: engineering, medicine and health, management, arts and science, Ph.D.", keywords: ["btech", "b.tech", "mtech", "mba", "bba", "mbbs", "medical", "engineering", "architecture", "design", "law", "agriculture", "hotel", "application", "link"] },
  { id: "adm-fees", title: "Admissions: fees and scholarships", href: "/admissions#funding", external: false, summary: "Where annual fees are shown, and the scholarship categories listed for Engineering & Technology.", keywords: ["fee", "fees", "cost", "money", "scholarship", "scholarships", "financial", "aid", "concession", "waiver", "afford"] },
  { id: "adm-intl", title: "Admissions: applying from abroad", href: "/admissions#international", external: false, summary: "International admissions, the international portal and advertised fee waivers.", keywords: ["international", "abroad", "foreign", "nri", "pio", "oci", "overseas", "visa", "saarc", "africa", "outside"] },
  { id: "adm-contact", title: "Admissions: talk to Admissions", href: "/admissions#contact", external: false, summary: "Admissions phone numbers and the admission brochure.", keywords: ["contact", "phone", "call", "talk", "help", "brochure", "number", "enquiry", "query"] },
  { id: "acad-finder", title: "Academics: programme finder", href: "/academics#finder", external: false, summary: "Search all catalogue programmes by name, level and duration, or describe your interests.", keywords: ["programme", "program", "course", "courses", "degree", "study", "search", "finder", "subject", "major", "duration", "level", "undergraduate", "postgraduate"] },
  { id: "acad-areas", title: "Academics: study areas", href: "/academics#areas", external: false, summary: "Colleges and faculties: engineering, medicine and health sciences, management, science and humanities, law, agriculture, distance and online education.", keywords: ["college", "colleges", "faculty", "faculties", "school", "department", "area", "areas", "online", "distance"] },
  { id: "acad-wall", title: "Academics: the whole catalogue", href: "/academics#wall-h", external: false, summary: "A visual wall of every programme, grouped by level.", keywords: ["catalogue", "all", "list", "wall", "every"] },
  { id: "campus-tour", title: "Campus tour (official 360° virtual tour)", href: "/campus-tour", external: false, summary: "SRMIST's official 360° virtual tour of the Kattankulathur campus, and its landmarks.", keywords: ["tour", "virtual", "360", "visit", "campus", "see", "walk", "panorama", "facilities", "hostel", "building", "buildings"] },
  { id: "campus-3d", title: "Home: campus landmarks in 3D", href: "/#campus-3d", external: false, summary: "University Building, Tech Park and Tech Park 2, with links onward.", keywords: ["tech park", "techpark", "tp", "tp2", "university building", "ub", "landmark", "landmarks", "3d", "map", "buildings"] },
  { id: "res-pathways", title: "Research: find your pathway", href: "/research#pathways", external: false, summary: "Routes for doctoral applicants, faculty and researchers, and industry partners.", keywords: ["research", "phd", "ph.d", "doctoral", "doctorate", "faculty", "industry", "partner", "collaborate", "collaboration", "policy", "funding", "patent", "patents"] },
  { id: "res-centres", title: "Research: explore the centres", href: "/research#centres", external: false, summary: "Ten research centres and facilities, from nanotechnology to supercomputing.", keywords: ["centre", "centres", "center", "centers", "lab", "labs", "facility", "facilities", "nanotechnology", "supercomputer", "hpc", "climate", "medical research", "instrumentation"] },
  { id: "res-record", title: "Research: research record", href: "/research#record", external: false, summary: "Funded projects, publications and patents reported on the official research page.", keywords: ["record", "publications", "papers", "projects", "patents", "funded", "output", "scopus"] },
  { id: "res-contact", title: "Research: contact the Directorate", href: "/research#contact", external: false, summary: "Contact details for the Dean (Research).", keywords: ["contact", "dean", "directorate", "email", "research office"] },
  { id: "off-portal", title: "Official application portal (India)", href: PORTAL, external: true, summary: "SRMIST's official portal for applicants from India.", keywords: ["apply", "portal", "application", "online", "india", "register"] },
  { id: "off-intl", title: "Official international application portal", href: INTL_PORTAL, external: true, summary: "SRMIST's official portal for international applicants.", keywords: ["international", "abroad", "foreign", "portal", "apply", "nri"] },
  { id: "off-phd", title: "Official Ph.D. admissions page", href: `${WWW}/admission-india/phd/`, external: true, summary: "Official page for Ph.D. admissions.", keywords: ["phd", "ph.d", "doctoral", "doctorate", "research", "admission"] },
  { id: "off-scholarship", title: "Official scholarship policy", href: `${WWW}/policies/scholarship-policy/`, external: true, summary: "SRMIST's official scholarship policy.", keywords: ["scholarship", "scholarships", "policy", "merit", "aid"] },
  { id: "off-brochure", title: "Admission brochure 2026-2027 (PDF)", href: "https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-admission-brochure-2026-2027.pdf", external: true, summary: "Official admission brochure.", keywords: ["brochure", "pdf", "download", "prospectus", "eligibility", "dates", "deadline", "deadlines"] },
  { id: "off-research", title: "Official research page", href: `${WWW}/research/`, external: true, summary: "SRMIST's official research page.", keywords: ["research", "official"] },
  { id: "off-rankings", title: "Official accreditations and rankings", href: `${WWW}/about-us/accreditations-and-rankings/`, external: true, summary: "Official accreditations and rankings page.", keywords: ["ranking", "rankings", "nirf", "qs", "naac", "accreditation", "accredited", "rank"] },
  { id: "off-contact", title: "Official contact page", href: `${WWW}/contact-us/`, external: true, summary: "SRMIST's official contact page.", keywords: ["contact", "address", "phone", "email", "location", "reach"] },
];

// Words that hint at intent but say little about the topic count for less.
const GENERIC = new Set(["how", "where", "start", "all", "list", "every", "help", "link", "official", "form", "online", "number"]);

export const PAGE_BY_ID = new Map(SITE_PAGES.map((p) => [p.id, p]));

export function rankPages(question: string, limit = 6) {
  const toks = normalise(question).split(/[^a-z0-9.]+/).map((t) => t.replace(/^\.+|\.+$/g, "")).filter((t) => t.length >= 2);
  const text = normalise(question);
  return SITE_PAGES.map((p) => {
    let score = 0;
    for (const k of p.keywords) {
      if (k.includes(" ") ? text.includes(k) : toks.some((t) => t === k || (k.length >= 4 && t.startsWith(k)) || (t.length >= 5 && k.startsWith(t)))) score += GENERIC.has(k) ? 1 : 3;
    }
    if (score && !p.external) score += 1; // Prefer the redesign's own page, which links onward.
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
