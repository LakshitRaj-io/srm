import type { Metadata } from "next";
import { ExtLink } from "@/components/ExtLink";
import { PageHero } from "@/components/PageHero";
import { ProgrammeFinder } from "@/components/ProgrammeFinder";
import { CHECKED, WWW } from "@/data/site";
import data from "@/data/programmes.json";

export const metadata: Metadata = { title: "Academics and programmes", description: "Search SRMIST programmes by name, level and duration. Redesign concept using official catalogue data." };

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
      <PageHero title="Find your programme" lede={`Search ${data.length} programmes from the official catalogue, each linked to its official page.`} image="/images/classroom.jpg" alt="Students at desks in an SRMIST classroom">
        <a href="#finder" className="btn btn-blue mt-7">Start searching</a>
      </PageHero>

      <section id="finder" aria-labelledby="finder-h" className="bg-mist/60">
        <div className="wrap section">
          <h2 id="finder-h" className="t-section mb-8">Programme finder</h2>
          <ProgrammeFinder />
          <p className="measure mt-8 text-[0.95rem] text-ink">Fees, durations and intake as listed in the <ExtLink className="link" href={`${WWW}/program-finder/`} showHost={false}>official Program Finder</ExtLink> on {CHECKED}. Campus is not shown because it was not verified per programme. Check the official page before applying.</p>
        </div>
      </section>

      <section id="areas" aria-labelledby="areas-h" className="wrap section">
        <h2 id="areas-h" className="t-section">Study areas</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map(([l, h]) => (<li key={h}><ExtLink href={h} showHost={false} className="block py-2 text-lg font-medium hover:text-blue">{l}</ExtLink></li>))}
        </ul>
      </section>

      <section id="detail" aria-labelledby="detail-h" className="wrap pb-20">
        <div className="rounded-3xl bg-white p-7 md:p-10">
          <p className="text-ink-soft">How a programme page could look</p>
          <h2 id="detail-h" className="t-section mt-1">B.Arch. Architecture</h2>
          <dl className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[["Campus", "Kattankulathur (KTR)"], ["Sanctioned intake", "80"], ["Annual fees", "INR 2,75,000"], ["Duration", "5 years"]].map(([k, v]) => (
              <div key={k}><dt className="text-[0.95rem] text-ink-soft">{k}</dt><dd className="text-lg font-semibold">{v}</dd></div>
            ))}
          </dl>
          <p className="measure mt-6">A 10-semester programme with a focus on contemporary issues such as sustainability and urban re-development, offered by the School of Architecture and Interior Design.</p>
          <ExtLink className="link mt-4 inline-block" href={`${WWW}/program/b-arch-bachelor-of-architecture/`} showHost={false}>See eligibility and curriculum</ExtLink>
        </div>
      </section>
    </>
  );
}
