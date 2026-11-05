export type HostelCategory = "Men’s hostel" | "Ladies’ hostel" | "NRI hostel";
export type Hostel = { name: string; category: HostelCategory; rooms?: number };

// Names follow the 2025–26 SRMIST handbook. Room counts are shown only for entries
// included in SRMIST's 2025 AICTE mandatory disclosure.
export const HOSTELS: Hostel[] = [
  { name: "Sannasi A", category: "Men’s hostel", rooms: 190 },
  { name: "Sannasi C", category: "Men’s hostel", rooms: 100 },
  { name: "Began", category: "Men’s hostel", rooms: 115 },
  { name: "Paari G", category: "Men’s hostel", rooms: 308 },
  { name: "Kaari H", category: "Men’s hostel", rooms: 307 },
  { name: "Oori I", category: "Men’s hostel", rooms: 307 },
  { name: "Adhiyaman J", category: "Men’s hostel", rooms: 348 },
  { name: "Nelson Mandela", category: "Men’s hostel", rooms: 174 },
  { name: "Agasthiyar Dorm", category: "Men’s hostel", rooms: 18 },
  { name: "Mullai D", category: "Men’s hostel", rooms: 186 },
  { name: "Thamarai E", category: "Men’s hostel", rooms: 186 },
  { name: "Malligai F", category: "Men’s hostel", rooms: 186 },
  { name: "Manoranjitham K", category: "Men’s hostel", rooms: 238 },
  { name: "Green Pearl B", category: "NRI hostel", rooms: 80 },
  { name: "Pierre Fauchard", category: "Men’s hostel" },
  { name: "ESQ A", category: "Ladies’ hostel" },
  { name: "ESQ B", category: "Ladies’ hostel" },
  { name: "Meenakshi", category: "Ladies’ hostel" },
  { name: "Kalpana Chawla", category: "Ladies’ hostel" },
  { name: "Kopperundevi", category: "Ladies’ hostel" },
  { name: "Senbagam", category: "Ladies’ hostel" },
  { name: "NRI Premium", category: "NRI hostel" },
];

export const HOSTEL_HANDBOOK_URL = "https://webstor.srmist.edu.in/web_assets/downloads/2025/hand-book-2025-26.pdf";
export const HOSTEL_INVENTORY_URL = "https://webstor.srmist.edu.in/web_assets/downloads/2025/flipbook/aicte-mandate-disclosure/files/basic-html/page156.html";
export const HOSTEL_VIRTUAL_TOUR_URL = "https://www.srmist.edu.in/virtual/tour/Hostels/Index.html";
export const HOSTEL_PAGE_URL = "https://www.srmist.edu.in/srm-hostels/";
