import type { Metadata } from "next";
import { ExtLink } from "@/components/ExtLink";
import { PageHero } from "@/components/PageHero";
import { ProgrammeFinder } from "@/components/ProgrammeFinder";
import { CatalogueWall } from "@/components/art/CatalogueWall";
import { Ticker } from "@/components/art/Ticker";
import { WWW } from "@/data/site";
import data from "@/data/programmes.json";

export const metadata: Metadata = { title: "Academics and programmes", description: "Search SRMIST programmes by name, level and duration." };

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

export default function Academics() {
  return (
    <>
      <PageHero title={[String(data.length), "programmes", "One search"]} tone="bg-blue text-white" lede="Every programme in the official catalogue, each linked to its official page." image="/images/classroom.jpg" alt="Students at desks in an SRMIST classroom">
        <a href="#finder" className="btn btn-gold">Start searching</a>
      </PageHero>

      <section aria-labelledby="wall-h" className="wrap section">
        <h2 id="wall-h" className="t-section mb-8">The whole catalogue</h2>
        <CatalogueWall />
      </section>

      <Ticker items={areas.map(([l]) => l)} tone="gold" />

      <section id="finder" aria-labelledby="finder-h" className="bg-mist">
        <div className="wrap section">
          <h2 id="finder-h" className="t-section mb-8">Programme finder</h2>
          <ProgrammeFinder />
        </div>
      </section>

      <section id="areas" aria-labelledby="areas-h" className="wrap section">
        <h2 id="areas-h" className="t-section">Study areas</h2>
        <ul className="mt-8 grid gap-[3px] border-[3px] border-black bg-black sm:grid-cols-2 lg:grid-cols-4">
          {areas.map(([l, h]) => (<li key={h} className="bg-white"><ExtLink href={h} showHost={false} className="block h-full p-5 font-display text-3xl font-extrabold uppercase leading-none hover:bg-gold">{l}</ExtLink></li>))}
        </ul>
      </section>

      <section id="detail" aria-labelledby="detail-h" className="wrap pb-20">
        <div className="bg-gold p-7 line md:p-10">
          <h2 id="detail-h" className="t-section">B.Arch. Architecture</h2>
          <dl className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[["Campus", "Kattankulathur (KTR)"], ["Sanctioned intake", "80"], ["Annual fees", "INR 2,75,000"], ["Duration", "5 years"]].map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd className="text-xl font-bold">{v}</dd></div>
            ))}
          </dl>
          <p className="measure mt-6">A 10-semester programme with a focus on contemporary issues such as sustainability and urban re-development, offered by the School of Architecture and Interior Design.</p>
          <ExtLink className="btn btn-line mt-5" href={`${WWW}/program/b-arch-bachelor-of-architecture/`} showHost={false}>See eligibility and curriculum</ExtLink>
        </div>
      </section>
    </>
  );
}
