import type { Metadata } from "next";
import { ExtLink } from "@/components/ExtLink";
import { ProgrammeFinder } from "@/components/ProgrammeFinder";
import { BuildingViewer } from "@/components/art/BuildingViewer";
import { Mosaic } from "@/components/art/Mosaic";
import { StageHero, type StageOption } from "@/components/art/StageHero";
import { WWW } from "@/data/site";
import data from "@/data/programmes.json";

export const metadata: Metadata = { title: "Academics and programmes", description: "Search SRMIST programmes by name, level and duration, or describe what you enjoy for suggestions." };

const areas = [
  ["Engineering & Technology", `${WWW}/college/college-of-engineering-technology/`],
  ["Medicine & Health Sciences", `${WWW}/college/medicine-and-health-sciences/`],
  ["Management", `${WWW}/faculty-of-management/`],
  ["Science & Humanities", `${WWW}/college/college-of-science-and-humanities/`],
  ["Law", "https://law.srmist.edu.in/"],
  ["Agricultural Sciences", `${WWW}/department/college-of-agriculture-sciences/`],
  ["Distance Education", "https://srmistdistanceeducation.in/"],
  ["Online Education", "https://www.srmonline.in/"],
];

const count = (l: string) => data.filter((p) => p.level.includes(l)).length;
const stage: StageOption[] = [
  { label: "All programmes", stat: String(data.length), line: "Every programme in the official catalogue, each linked to its official page.", image: "/images/classroom.jpg", alt: "Students at desks in an SRMIST classroom", cta: "Search everything", href: "#finder", level: "" },
  { label: "Undergraduate", stat: String(count("Undergraduate")), line: "Bachelor's programmes, from engineering to law and health sciences.", image: "/images/techpark2.jpg", alt: "The colourful glass facade of the SRMIST Tech Park", cta: "Show undergraduate", href: "#finder", level: "Undergraduate" },
  { label: "Postgraduate", stat: String(count("Post Graduate")), line: "Master's and other postgraduate programmes.", image: "/images/library.jpg", alt: "Rows of bookshelves in the SRMIST Central Library", cta: "Show postgraduate", href: "#finder", level: "Post Graduate" },
  { label: "Ph.D.", stat: String(count("Ph.D")), line: "Doctoral programmes across the university.", image: "/images/lab.jpg", alt: "A researcher working with analytical instruments in an SRMIST laboratory", cta: "Show Ph.D.", href: "#finder", level: "Ph.D" },
];

export default function Academics() {
  return (
    <>
      <StageHero title={["Find your programme"]} options={stage} />



      <section id="finder" aria-labelledby="finder-h" className="bg-mist">
        <div className="wrap section">
          <h2 id="finder-h" className="t-section mb-8">Programme finder</h2>
          <ProgrammeFinder />
        </div>
      </section>

      <Mosaic shots={[{ src: "/images/library.jpg", alt: "Rows of bookshelves in the SRMIST Central Library" }, { src: "/images/ideathon.jpg", alt: "Students on stage at the Inspira Ideathon at SRMIST" }, { src: "/images/computers.jpg", alt: "Students working at computers in an SRMIST lab" }]} />

      <section aria-labelledby="tp-h" className="wrap section pb-0 md:pb-0">
        <h2 id="tp-h" className="t-section mb-8">Tech Park</h2>
        <BuildingViewer ids={["tp"]} />
      </section>

      <section id="areas" aria-labelledby="areas-h" className="wrap section">
        <h2 id="areas-h" className="t-section">Study areas</h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(([l, h]) => (<li key={h} className="bg-surface"><ExtLink href={h} showHost={false} className="block h-full p-5 font-medium hover:bg-tint">{l}</ExtLink></li>))}
        </ul>
      </section>

      <section id="detail" aria-labelledby="detail-h" className="wrap pb-20">
        <div className="bg-tint p-7 line md:p-10">
          <h2 id="detail-h" className="t-section">B.Arch. Architecture</h2>
          <dl className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[["Campus", "Kattankulathur (KTR)"], ["Sanctioned intake", "80"], ["Annual fees", "INR 2,75,000"], ["Duration", "5 years"]].map(([k, v]) => (
              <div key={k} className="min-w-0"><dt className="text-ink-soft">{k}</dt><dd className="text-lg font-semibold [overflow-wrap:anywhere]">{v}</dd></div>
            ))}
          </dl>
          <p className="measure mt-6">A 10-semester programme with a focus on contemporary issues such as sustainability and urban re-development, offered by the School of Architecture and Interior Design.</p>
          <ExtLink className="btn btn-line mt-5" href={`${WWW}/program/b-arch-bachelor-of-architecture/`} showHost={false}>See eligibility and curriculum</ExtLink>
        </div>
      </section>
    </>
  );
}
