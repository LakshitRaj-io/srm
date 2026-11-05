// Buildings in the homepage campus scene. Names only: the models carry the detail.
export const TOUR_URL = "https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm";

export type BuildingId = "ub" | "tp" | "tp2";
export type Building = { id: BuildingId; name: string; still: string };

export const BUILDINGS: Building[] = [
  { id: "ub", name: "University Building", still: "/images/campus/university-building.webp" },
  { id: "tp", name: "Tech Park", still: "/images/campus/tech-park.webp" },
  { id: "tp2", name: "Tech Park 2", still: "/images/campus/tech-park-2.webp" },
];
