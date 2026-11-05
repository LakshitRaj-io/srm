import type { Metadata } from "next";
import { ExtLink } from "@/components/ExtLink";
import { Mosaic } from "@/components/art/Mosaic";
import { Orbit } from "@/components/art/Orbit";
import { Scramble } from "@/components/art/Scramble";
import { StageHero, type StageOption } from "@/components/art/StageHero";
import { WWW, researchFacts } from "@/data/site";

export const metadata: Metadata = { title: "Research", description: "Research pathways at SRMIST for doctoral applicants, faculty and industry partners." };

const pathways = [
  { who: "Doctoral applicants", want: "I want to do a Ph.D.", bg: "bg-surface text-fg", links: [["Ph.D. admissions", `${WWW}/admission-india/phd/`], ["Medical Research Ph.D.", "https://medicalresearch.srmist.edu.in/phd-admission/"], ["Thrust areas of research (PDF)", "https://webstor.srmist.edu.in/web_assets/downloads/2023/thrust-area-of-research.pdf"]] },
  { who: "Faculty and researchers", want: "I need policies and funding.", bg: "bg-surface text-fg", links: [["Research policies", `${WWW}/research/#policy`], ["Sponsored projects", `${WWW}/research/sponsored-projects/`], ["Research and Development Cell", `${WWW}/research/research-and-development-cell/`]] },
  { who: "Industry and partners", want: "I want to collaborate.", bg: "bg-surface text-fg", links: [["Collaborations", `${WWW}/research/collaborations/`], ["Recent projects", `${WWW}/research/projects/`], ["Patents", `${WWW}/research/patents/`]] },
];

const stage: StageOption[] = [
  { label: "Doctoral applicants", line: "Find Ph.D. admissions and the university's thrust areas of research.", image: "/images/lab.jpg", alt: "A researcher working with analytical instruments in an SRMIST chemistry laboratory", cta: "Start your Ph.D. route", href: "#pathways" },
  { label: "Faculty", line: "Reach research policies, sponsored projects and the Research and Development Cell.", image: "/images/servers.jpg", alt: "Rack-mounted network hardware in an SRMIST computing facility", cta: "See policies and funding", href: "#pathways" },
  { label: "Industry", line: "See collaborations, recent projects and patents.", image: "/images/ideathon.jpg", alt: "Students on stage at the Inspira Ideathon at SRMIST", cta: "Explore collaboration", href: "#pathways" },
  { label: "Centres", line: "Ten research centres and facilities, from nanotechnology to supercomputing.", image: "/images/raman.jpg", alt: "The Sir C.V. Raman Research Park building at SRMIST", cta: "Explore the centres", href: "#centres" },
];

export default function Research() {
  return (
    <>
      <StageHero title={["Research", "at SRMIST"]} options={stage} />

      <section id="pathways" aria-labelledby="path-h" className="wrap section">
        <h2 id="path-h" className="t-section">Find your pathway</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {pathways.map((p) => (
            <div key={p.who} className={`min-w-0 p-5 md:p-6 ${p.bg}`}>
              <h3 className="text-sm font-medium text-ink-soft" style={{ letterSpacing: 0 }}>{p.who}</h3>
              <p className="mt-1 text-2xl font-semibold leading-tight tracking-tight">{p.want}</p>
              <ul className="mt-5">
                {p.links.map(([l, h]) => (<li key={h}><ExtLink href={h} showHost={false} className="block py-1.5 font-medium text-accent hover:underline">{l}</ExtLink></li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Mosaic shots={[{ src: "/images/raman.jpg", alt: "The Sir C.V. Raman Research Park building at SRMIST" }, { src: "/images/lab.jpg", alt: "A researcher working with analytical instruments in an SRMIST laboratory" }, { src: "/images/servers.jpg", alt: "Rack-mounted network hardware in an SRMIST computing facility" }]} />

      <section id="centres" aria-labelledby="cen-h" className="overflow-hidden bg-tint">
        <div className="wrap section">
          <h2 id="cen-h" className="t-section mb-8">Explore the centres</h2>
          <Orbit />
        </div>
      </section>

      <section id="record" aria-labelledby="rec-h" className="on-dark bg-night text-white">
        <div className="wrap section">
          <h2 id="rec-h" className="t-section">Research record</h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {researchFacts.map((f) => (
              <div key={f.label}>
                <dd className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-none tracking-tight text-gold"><Scramble value={f.value} /></dd>
                <dt className="mt-2 text-white/80">{f.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-8"><ExtLink className="inline-block py-0.5 font-bold underline" href={`${WWW}/research/`} showHost={false}>Official Research page</ExtLink></p>
        </div>
      </section>

      <section id="contact" aria-labelledby="con-h" className="bg-tint">
        <div className="wrap section">
          <h2 id="con-h" className="t-section">Contact the Directorate</h2>
          <address className="mt-5 not-italic">
            <p className="text-lg font-semibold">Dr. Bernaurdshaw Neppolian, Dean (Research)</p>
            <p>Room No 910, 9th Floor, Sir C.V. Raman Block, SRMIST, Kattankulathur</p>
            <p className="mt-2"><a className="inline-block py-0.5 text-accent underline" href="mailto:dean.research@srmist.edu.in">dean.research@srmist.edu.in</a>, <a className="inline-block py-0.5 text-accent underline" href="tel:+914427417142">+91-44-2741-7142</a></p>
          </address>
        </div>
      </section>
    </>
  );
}
