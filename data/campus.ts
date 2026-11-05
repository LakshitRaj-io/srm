// Campus landmarks and the spaces to show when a map marker is selected.
export const TOUR_URL = "https://webstor.srmist.edu.in/web_assets/srmist-virtual-tour-vo/index.htm";

export type BuildingId = "ub" | "tp" | "tp2";
export type Building = {
  id: BuildingId;
  shortName: string;
  name: string;
  file: string;
  still: string;
  mapPosition: { x: number; z: number };
  location: { latitude: number; longitude: number; approximate?: boolean };
  highlights: string[];
};

// One zoom-16 OpenStreetMap tile is the ground plane of the shared 3D scene. These projected
// positions keep the three models attached to their real places on that tile.
export const CAMPUS_MAP_TILE = { zoom: 16, x: 47339, y: 30413, size: 320 };
function projectToMap(latitude: number, longitude: number) {
  const worldTiles = 2 ** CAMPUS_MAP_TILE.zoom;
  const px = ((longitude + 180) / 360) * worldTiles * 256;
  const latRad = (latitude * Math.PI) / 180;
  const py = ((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * worldTiles * 256;
  return {
    x: ((px - (CAMPUS_MAP_TILE.x + 0.5) * 256) / 256) * CAMPUS_MAP_TILE.size,
    z: -((py - (CAMPUS_MAP_TILE.y + 0.5) * 256) / 256) * CAMPUS_MAP_TILE.size,
  };
}

function makeBuilding(id: BuildingId, shortName: string, name: string, file: string, still: string, location: Building["location"], highlights: string[]): Building {
  return { id, shortName, name, file, still, location, mapPosition: projectToMap(location.latitude, location.longitude), highlights };
}

export const BUILDINGS: Building[] = [
  makeBuilding("ub", "UB", "University Building", "university-building", "/images/campus/university-building.webp", { latitude: 12.82331, longitude: 80.04245 }, ["First-year classes and teaching spaces", "Chairperson, HoD and university offices", "Central Library and student-facing services"]),
  makeBuilding("tp", "TP–1", "Tech Park I", "tech-park", "/images/campus/tech-park.webp", { latitude: 12.82318, longitude: 80.04362 }, ["iMac Labs A–D · 14th floor", "Quantum and Photonic Quantum Computing labs", "Wireless, RF and visual-computing labs"]),
  makeBuilding("tp2", "TP–2", "Tech Park II", "tech-park-2", "/images/campus/tech-park-2.webp", { latitude: 12.8246, longitude: 80.0453, approximate: true }, ["Data Science & Business Systems · HoD office, room 806 (8th floor)", "AI/ML, Big Data, Cloud, VLSI and Cyber-Physical Systems cohorts", "XR events, seminars and student project work"]),
];
