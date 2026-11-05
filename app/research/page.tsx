import type { Metadata } from "next";
import Image from "next/image";
import { ExtLink } from "@/components/ExtLink";
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
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <Image src="/images/servers.jpg" alt="Rack-mounted network hardware in an SRMIST computing facility" fill priority sizes="100vw" className="-z-10 object-cover opacity-35" />
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
          <p className="font-semibold text-gold">Directorate of Research</p>
          <h1 className="mt-2 max-w-5xl font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.92] tracking-tighter">Research that crosses disciplines</h1>
          <p className="mt-6 max-w-2xl font-serif text-xl">Focus areas named by SRMIST include nanotechnology, bioengineering, energy, environment, materials and embedded systems.</p>
        </div>
      </section>

      <section id="pathways" aria-labelledby="path-h" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <h2 id="path-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Find your pathway</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pathways.map((p) => (
            <div key={p.who} className="border-2 border-ink p-5 shadow-[6px_6px_0_var(--color-gold)]">
              <h3 className="text-sm font-bold text-blue">{p.who}</h3>
              <p className="mt-1 font-serif text-3xl">{p.want}</p>
              <ul className="mt-4">
                {p.links.map(([l, h]) => (<li key={h} className="border-t border-ink/20"><ExtLink href={h} showHost={false} className="block py-3 font-semibold hover:text-blue">{l}</ExtLink></li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="record" aria-labelledby="rec-h" className="bg-gold">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
          <h2 id="rec-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Research record</h2>
          <dl className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {researchFacts.map((f) => (
              <div key={f.label} className="border-t-2 border-ink pt-3">
                <dd className="font-display text-4xl font-extrabold tracking-tighter md:text-6xl">{f.value}</dd>
                <dt className="mt-1">{f.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm">Figures as shown on the <ExtLink className="underline" href={`${WWW}/research/`} showHost={false}>official Research page</ExtLink> (page updated 28 Oct 2026), checked {CHECKED}. The source does not state a reference period for these figures.</p>
        </div>
      </section>

      <section id="centres" aria-labelledby="cen-h" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <h2 id="cen-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Centres and facilities</h2>
        <ul className="mt-8 grid border-t-2 border-ink md:grid-cols-2 md:gap-x-10">
          {centres.map(([a, n, d]) => (
            <li key={a} className="grid grid-cols-[6rem_1fr] gap-3 border-b border-ink/25 py-4">
              <span className="font-display text-xl font-extrabold text-blue">{a}</span>
              <span><span className="block font-semibold">{n}</span><span className="text-ink-soft">{d}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" aria-labelledby="con-h" className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
          <h2 id="con-h" className="font-display text-3xl font-extrabold tracking-tight">Contact the Directorate of Research</h2>
          <address className="mt-4 not-italic">
            <p className="font-semibold">Dr. Bernaurdshaw Neppolian, Dean (Research)</p>
            <p>Room No 910, 9th Floor, Sir C.V. Raman Block, SRMIST, Kattankulathur</p>
            <p className="mt-2"><a className="underline" href="mailto:dean.research@srmist.edu.in">dean.research@srmist.edu.in</a> · <a className="underline" href="tel:+914427417142">+91-44-2741-7142</a></p>
          </address>
        </div>
      </section>
    </>
  );
}
