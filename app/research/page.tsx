import type { Metadata } from "next";
import { ExtLink } from "@/components/ExtLink";
import { PageHero } from "@/components/PageHero";
import { Orbit } from "@/components/art/Orbit";
import { Scramble } from "@/components/art/Scramble";
import { Ticker } from "@/components/art/Ticker";
import { WWW, researchFacts } from "@/data/site";

export const metadata: Metadata = { title: "Research", description: "Research pathways at SRMIST for doctoral applicants, faculty and industry partners." };

const pathways = [
  { who: "Doctoral applicants", want: "I want to do a Ph.D.", bg: "bg-gold text-black", links: [["Ph.D. admissions", `${WWW}/admission-india/phd/`], ["Medical Research Ph.D.", "https://medicalresearch.srmist.edu.in/phd-admission/"], ["Thrust areas of research (PDF)", "https://webstor.srmist.edu.in/web_assets/downloads/2023/thrust-area-of-research.pdf"]] },
  { who: "Faculty and researchers", want: "I need policies and funding.", bg: "bg-white text-black", links: [["Research policies", `${WWW}/research/#policy`], ["Sponsored projects", `${WWW}/research/sponsored-projects/`], ["Research and Development Cell", `${WWW}/research/research-and-development-cell/`]] },
  { who: "Industry and partners", want: "I want to collaborate.", bg: "bg-blue text-white", links: [["Collaborations", `${WWW}/research/collaborations/`], ["Recent projects", `${WWW}/research/projects/`], ["Patents", `${WWW}/research/patents/`]] },
];

export default function Research() {
  return (
    <>
      <PageHero title={["Research", "Without", "Borders"]} tone="bg-black text-white" lede="Focus areas include nanotechnology, bioengineering, energy, environment, materials and embedded systems." image="/images/lab.jpg" alt="A researcher working with analytical instruments in an SRMIST chemistry laboratory">
        <a href="#pathways" className="btn btn-gold">Find your pathway</a>
      </PageHero>

      <Ticker items={["Nanotechnology", "Bioengineering", "Energy", "Environment", "Materials", "Embedded systems"]} />

      <section id="pathways" aria-labelledby="path-h" className="wrap section">
        <h2 id="path-h" className="t-section">Find your pathway</h2>
        <div className="mt-8 grid gap-[3px] border-[3px] border-black bg-black md:grid-cols-3">
          {pathways.map((p) => (
            <div key={p.who} className={`p-6 ${p.bg}`}>
              <h3 className="font-sans text-base font-bold normal-case">{p.who}</h3>
              <p className="mt-1 font-display text-5xl font-extrabold uppercase leading-[0.95]">{p.want}</p>
              <ul className="mt-5">
                {p.links.map(([l, h]) => (<li key={h}><ExtLink href={h} showHost={false} className="block py-1.5 font-semibold underline">{l}</ExtLink></li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="centres" aria-labelledby="cen-h" className="overflow-hidden border-y-[3px] border-black bg-mist">
        <div className="wrap section">
          <h2 id="cen-h" className="t-section mb-8">Explore the centres</h2>
          <Orbit />
        </div>
      </section>

      <section id="record" aria-labelledby="rec-h" className="on-dark bg-black text-white">
        <div className="wrap section">
          <h2 id="rec-h" className="t-section">Research record</h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2">
            {researchFacts.map((f) => (
              <div key={f.label}>
                <dd className="font-display text-[clamp(4.5rem,10vw,9rem)] font-extrabold leading-[0.85] text-gold"><Scramble value={f.value} /></dd>
                <dt className="mt-2 text-lg font-semibold">{f.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-8"><ExtLink className="font-bold underline" href={`${WWW}/research/`} showHost={false}>Official Research page</ExtLink></p>
        </div>
      </section>

      <section id="contact" aria-labelledby="con-h" className="bg-gold">
        <div className="wrap section">
          <h2 id="con-h" className="t-section">Contact the Directorate</h2>
          <address className="mt-5 not-italic">
            <p className="text-xl font-bold">Dr. Bernaurdshaw Neppolian, Dean (Research)</p>
            <p>Room No 910, 9th Floor, Sir C.V. Raman Block, SRMIST, Kattankulathur</p>
            <p className="mt-2 font-bold"><a className="underline" href="mailto:dean.research@srmist.edu.in">dean.research@srmist.edu.in</a>, <a className="underline" href="tel:+914427417142">+91-44-2741-7142</a></p>
          </address>
        </div>
      </section>
    </>
  );
}
