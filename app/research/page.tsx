import type { Metadata } from "next";
import { ExtLink } from "@/components/ExtLink";
import { PageHero } from "@/components/PageHero";
import { CHECKED, WWW, centres, researchFacts } from "@/data/site";

export const metadata: Metadata = { title: "Research", description: "Research pathways at SRMIST for doctoral applicants, faculty and industry partners. Redesign concept." };

const pathways = [
  { who: "Doctoral applicants", want: "I want to do a Ph.D.", links: [["Ph.D. admissions", `${WWW}/admission-india/phd/`], ["Medical Research Ph.D.", "https://medicalresearch.srmist.edu.in/phd-admission/"], ["Thrust areas of research (PDF)", "https://webstor.srmist.edu.in/web_assets/downloads/2023/thrust-area-of-research.pdf"]] },
  { who: "Faculty and researchers", want: "I need policies and funding.", links: [["Research policies", `${WWW}/research/#policy`], ["Sponsored projects", `${WWW}/research/sponsored-projects/`], ["Research and Development Cell", `${WWW}/research/research-and-development-cell/`]] },
  { who: "Industry and partners", want: "I want to collaborate.", links: [["Collaborations", `${WWW}/research/collaborations/`], ["Recent projects", `${WWW}/research/projects/`], ["Patents", `${WWW}/research/patents/`]] },
];

export default function Research() {
  return (
    <>
      <PageHero title="Research across disciplines" lede="Focus areas named by SRMIST include nanotechnology, bioengineering, energy, environment, materials and embedded systems." image="/images/lab.jpg" alt="A researcher working with analytical instruments in an SRMIST chemistry laboratory">
        <a href="#pathways" className="btn btn-blue mt-7">Find your pathway</a>
      </PageHero>

      <section id="pathways" aria-labelledby="path-h" className="bg-white">
        <div className="wrap section">
          <h2 id="path-h" className="t-section">Find your pathway</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pathways.map((p) => (
              <div key={p.who} className="rounded-2xl bg-paper p-6">
                <h3 className="font-sans text-base font-semibold tracking-normal text-blue">{p.who}</h3>
                <p className="mt-1 font-display text-2xl font-semibold leading-tight tracking-tight">{p.want}</p>
                <ul className="mt-4">
                  {p.links.map(([l, h]) => (<li key={h}><ExtLink href={h} showHost={false} className="block py-1.5 font-medium hover:text-blue">{l}</ExtLink></li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="record" aria-labelledby="rec-h" className="wrap section">
        <div className="on-dark rounded-3xl bg-ink p-7 text-white md:p-12">
          <h2 id="rec-h" className="t-section">Research record</h2>
          <dl className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {researchFacts.map((f) => (
              <div key={f.label}>
                <dd className="font-display text-4xl font-semibold tracking-tight text-gold md:text-5xl">{f.value}</dd>
                <dt className="mt-1 text-white/85">{f.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-[0.95rem] text-white/85">From the <ExtLink className="underline" href={`${WWW}/research/`} showHost={false}>official Research page</ExtLink> (updated 28 Oct 2026), checked {CHECKED}. The source gives no reference period for these figures.</p>
        </div>
      </section>

      <section id="centres" aria-labelledby="cen-h" className="wrap pb-16 md:pb-24">
        <h2 id="cen-h" className="t-section">Centres and facilities</h2>
        <ul className="mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {centres.map(([a, n, d]) => (
            <li key={a} className="grid grid-cols-[5.5rem_1fr] gap-3">
              <span className="font-display text-lg font-semibold text-blue">{a}</span>
              <span><span className="block font-semibold leading-snug">{n}</span><span className="text-[0.95rem] text-ink-soft">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" aria-labelledby="con-h" className="bg-mist">
        <div className="wrap py-12 md:py-14">
          <h2 id="con-h" className="t-section">Contact the Directorate of Research</h2>
          <address className="mt-4 not-italic">
            <p className="font-semibold">Dr. Bernaurdshaw Neppolian, Dean (Research)</p>
            <p>Room No 910, 9th Floor, Sir C.V. Raman Block, SRMIST, Kattankulathur</p>
            <p className="mt-2"><a className="link" href="mailto:dean.research@srmist.edu.in">dean.research@srmist.edu.in</a>, <a className="link" href="tel:+914427417142">+91-44-2741-7142</a></p>
          </address>
        </div>
      </section>
    </>
  );
}
