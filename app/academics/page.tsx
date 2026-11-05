import type { Metadata } from "next";
import { ExtLink } from "@/components/ExtLink";
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
      <section className="bg-blue text-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
          <p className="font-semibold text-gold">Academics</p>
          <h1 className="mt-2 max-w-5xl font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.92] tracking-tighter">{data.length} programmes. One search.</h1>
          <p className="mt-6 max-w-2xl font-serif text-xl">Every entry comes from the official Program Finder and links to its official page.</p>
        </div>
      </section>

      <section id="finder" aria-labelledby="finder-h" className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
        <h2 id="finder-h" className="mb-6 font-display text-3xl font-extrabold tracking-tight md:text-5xl">Programme finder</h2>
        <ProgrammeFinder />
        <p className="mt-8 text-sm text-ink-soft">Fees, durations and intake as listed in the <ExtLink className="underline" href={`${WWW}/program-finder/`} showHost={false}>official Program Finder</ExtLink> on {CHECKED}. Campus is not shown in this concept because it was not verified per programme; check the official programme page before applying.</p>
      </section>

      <section id="areas" aria-labelledby="areas-h" className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
          <h2 id="areas-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Study areas</h2>
          <ul className="mt-8 grid gap-x-10 md:grid-cols-2">
            {areas.map(([l, h]) => (<li key={h} className="border-b border-paper/25"><ExtLink href={h} className="block py-4 text-xl font-semibold hover:text-gold">{l}</ExtLink></li>))}
          </ul>
        </div>
      </section>

      <section id="detail" aria-labelledby="detail-h" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <p className="font-semibold text-blue">Programme page pattern</p>
        <h2 id="detail-h" className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-5xl">B.Arch. Architecture</h2>
        <dl className="mt-6 grid grid-cols-2 gap-6 border-y-2 border-ink py-5 md:grid-cols-4">
          {[["Campus", "Kattankulathur (KTR)"], ["Sanctioned intake", "80"], ["Annual fees", "INR 2,75,000"], ["Duration", "5 years"]].map(([k, v]) => (
            <div key={k}><dt className="text-ink-soft">{k}</dt><dd className="text-xl font-bold">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-5 max-w-3xl font-serif text-xl">A 10-semester programme with a focus on contemporary issues such as sustainability and urban re-development, offered by the School of Architecture and Interior Design.</p>
        <ExtLink className="mt-4 inline-block font-semibold underline" href={`${WWW}/program/b-arch-bachelor-of-architecture/`}>Eligibility and curriculum</ExtLink>
      </section>
    </>
  );
}
