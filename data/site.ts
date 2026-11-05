// Every fact here was read from an official SRMIST page on 5 November 2026.
// Update the value and CHECKED date together; never add a figure without a source.
export const CHECKED = "5 Nov 2026";
export const WWW = "https://www.srmist.edu.in";
export const PORTAL = "https://applications.srmist.edu.in/";
export const INTL_PORTAL = "https://intlapplications.srmist.edu.in/";

export type Fact = { value: string; label: string; source: string };

// NIRF 2025 tab on the rankings page, read after the counters finished animating.
export const nirf = [
  ["University", "11"], ["Overall", "22"], ["Engineering", "14"], ["Medical", "18"], ["Pharmacy", "10"], ["Architecture", "18"], ["Management", "56"], ["Law", "25"],
  ["Agriculture and Allied Sectors", "33"], ["Dental, Ramapuram", "8"], ["Dental, Kattankulathur", "39"], ["Research", "25"], ["Sustainability", "4"], ["Innovation band", "11-50"],
] as const;

export const accreditations = ["University Grants Commission", "Ministry of Education", "The Institution of Engineering and Technology", "Engineering Accreditation Commission of ABET", "National Board of Accreditation", "Indian Council of Agricultural Research"];

export const researchFacts: Fact[] = [
  { value: "₹294+ Cr", label: "External funded projects", source: `${WWW}/research/` },
  { value: "660+", label: "External funded projects, count", source: `${WWW}/research/` },
  { value: "44,500+", label: "Publications by Scopus faculty members", source: `${WWW}/research/` },
  { value: "1,100+", label: "Patents", source: `${WWW}/research/` },
];

export const news: { title: string; image?: string; alt?: string }[] = [
  { title: "SRMIST and Volvo Group partner on a university-based vehicle technology centre", image: "/images/volvo.jpg", alt: "SRMIST and Volvo Group representatives at a ribbon-cutting ceremony" },
  { title: "Semiconductor Summit 2026: ideas for India's semiconductor future", image: "/images/semiconductor.jpg", alt: "Speakers on stage at the SRM Semiconductor Summit 2026" },
  { title: "SRMIST's Team Camber Racing claims national title at Formula Bharat 2026" },
  { title: "SRMIST student named Distinguished Winner at Apple's Swift Student Challenge 2026" },
];

export const applyRoutes = [
  {
    group: "Engineering & architecture",
    items: [
      ["B.Tech / M.Tech (Integrated)", `${PORTAL}btech`],
      ["M.Tech", `${PORTAL}m-tech`],
      ["B.Arch / B.Design", `${PORTAL}architecture-and-design`],
      ["M.Arch / M.Des", `${PORTAL}m-arch-m-des`],
    ],
  },
  {
    group: "Medicine & health sciences",
    items: [
      ["MBBS, MD / MS (2026-27 page)", "https://medical.srmist.edu.in/campaign/mbbs-md-ms-2026-27/"],
      ["Health Science UG", `${PORTAL}srmhs`],
      ["Health Science PG", `${PORTAL}hspg`],
      ["Health Science Post PG", `${PORTAL}post-pg`],
    ],
  },
  {
    group: "Management & liberal arts",
    items: [
      ["BBA", `${PORTAL}bba`],
      ["MBA", `${PORTAL}mba`],
      ["UG: B.A., B.Sc., B.Com, BCA and more", `${PORTAL}science-and-humanities`],
      ["PG: M.A., M.Com, M.Sc., M.C.A., M.S.W.", `${PORTAL}science-and-humanities-pg`],
    ],
  },
  {
    group: "Other faculties and doctoral",
    items: [
      ["Hotel & Catering Management UG", `${PORTAL}hcma`],
      ["Agricultural Sciences UG", `${PORTAL}agricultural-sciences-form`],
      ["Ph.D. application", "https://admissions.srmist.edu.in/srmistonline/phdapplication"],
      ["Medical Research Ph.D.", "https://medicalresearch.srmist.edu.in/phd-admission/"],
    ],
  },
] as const;

export const scholarships = [
  "Founder's Scholarship", "SRM Merit Scholarship", "Chancellor Constituency Scholarship", "Socio-Economic Scholarship",
  "Unnat Bharat Abhiyan Scholarship", "Differently Abled Scholarship", "SRM Arts and Culture Scholarship", "Employee Ward Scholarship",
  "Alumni Scholarship", "Performance Based Scholarship", "Concessions", "Defence Scholarship", "Sponsored Scholarship",
];

export const centres = [
  ["NRC", "Nanotechnology Research Center", "Nanotechnology development with an environmental, health and safety research strategy."],
  ["REACH", "Research in Environment, Sustainability Advocacy and Climate Change", "University-wide research on environment and climate."],
  ["HPCC", "High performance computing", "Supercomputer facility for computation-heavy research."],
  ["SCIF", "Central instrumentation", "Portal to request and reserve time on research facilities."],
  ["SRM-DBT", "SRM-DBT Partnership Platform", "Advanced life science facility, in collaboration with the Department of Biotechnology, Govt. of India."],
  ["MRC", "Medical Research Centre", "Established 2008. Medical and allied sciences research and mentoring."],
  ["CACR", "Center for Advanced Concrete Research", "Started 2010. Interdisciplinary research on concrete."],
  ["ERC", "Earthquake Research Cell", "Established 2012. Studies the causes and prediction of earthquakes."],
  ["IIISM", "Interdisciplinary Institute of Indian System of Medicine", "Established 2008. Siddha, Ayurveda and Unani research."],
  ["CFS", "Centre for Statistics", "Statistical training, research and consultancy."],
] as const;
