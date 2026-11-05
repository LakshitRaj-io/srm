// Buildings shown in the 3D campus reveal. Every fact has an official SRMIST source.
// Checked 5 Nov 2026. The 3D models are illustrative (see `fidelity`), not survey-accurate.
import { WWW } from "./site";

export const AREA_PDF = "https://webstor.srmist.edu.in/web_assets/downloads/2021/ktr-campus-building-area-details.pdf";
export const INFRA_PDF = "https://webstor.srmist.edu.in/web_assets/srm_mainsite/files/2019/structure-and-infrastructure.pdf";
export const TOUR_URL = "https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm";

export type BuildingId = "ub" | "tp" | "tp2";
export type Building = {
  id: BuildingId;
  name: string;
  line: string;
  facts: string[];
  sources: [string, string][];
  links: [string, string][];
  fidelity: string;
};

export const BUILDINGS: Building[] = [
  {
    id: "ub",
    name: "University Building",
    line: "The administrative block: a pale rose tower with tall arched blue windows.",
    facts: ["G+15 floors", "4,66,418 sq ft built-up area"],
    sources: [["Building area details, 2021 (PDF)", AREA_PDF], ["Structure and infrastructure (PDF)", INFRA_PDF]],
    links: [["Admissions", "/admissions"], ["Talk to Admissions", "/admissions#contact"]],
    fidelity: "Stylised from SRMIST's official photograph and floor count. Proportions are approximate.",
  },
  {
    id: "tp",
    name: "Tech Park",
    line: "Colour-blocked facade: blue glass wings, a yellow-framed glass centre and red vertical strips.",
    facts: ["G+15 floors", "2,71,076 sq ft built-up area"],
    sources: [["Building area details, 2021 (PDF)", AREA_PDF], ["Structure and infrastructure (PDF)", INFRA_PDF]],
    links: [["Find a programme", "/academics#finder"], ["Research centres", "/research#centres"]],
    fidelity: "Stylised from SRMIST's official photographs and floor count. Proportions are approximate.",
  },
  {
    id: "tp2",
    name: "Tech Park 2",
    line: "Home to the School of Computing's Department of Data Science and Business Systems, and venue for events such as the XR Hackathon (15 October 2025).",
    facts: ["DSBS department: 8th floor", "At least 9 storeys (rooms on the 8th floor)"],
    sources: [["DSBS newsletter, Oct 2025 (PDF)", "https://webstor.srmist.edu.in/web_assets/downloads/2026/dsbs-data-chronicle-oct-2025.pdf"]],
    links: [["Data science programmes", "/academics#finder"], ["Virtual campus tour", "/campus-tour"]],
    fidelity: "Placeholder volume only. No verified exterior reference was available, so its shape, height and facade are not modelled.",
  },
];

export const CAMPUS_NOTE = "Illustrative reconstruction, not to scale. Building positions are schematic.";
export const OFFICIAL_CAMPUS = `${WWW}/`;
