import Image from "next/image";
import Link from "next/link";
import { INTL_PORTAL, PORTAL, WWW } from "@/data/site";
import { ExtLink } from "./ExtLink";

const COLUMNS = [
  { title: "Study", links: [["Programme finder", "/academics#finder"], ["Study areas", "/academics#areas"], ["Programme example", "/academics#detail"]] },
  { title: "Apply", links: [["Find your route", "/admissions#finder"], ["How to apply", "/admissions#steps"], ["Fees and scholarships", "/admissions#funding"], ["Applying from abroad", "/admissions#international"]] },
  { title: "Research", links: [["Your pathway", "/research#pathways"], ["Centres", "/research#centres"], ["Research record", "/research#record"], ["Directorate", "/research#contact"]] },
];
const SOCIAL = [
  ["Facebook", "https://www.facebook.com/SRMUniversityOfficial"],
  ["Instagram", "https://www.instagram.com/SRMUniversityOfficial/"],
  ["LinkedIn", "https://www.linkedin.com/company/srm-ist-chennai"],
  ["YouTube", "https://www.youtube.com/user/SRMeducation"],
  ["X", "https://twitter.com/SRM_Univ"],
];

export function Footer() {
  return (
    <footer className="relative z-10">
      <div className="on-dark bg-blue text-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-6 py-10 md:py-14">
          <h2 className="t-section">Admissions 2027 are open</h2>
          <div className="flex flex-wrap gap-3">
            <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Apply from India ↗<span className="sr-only"> on applications.srmist.edu.in (opens in a new tab)</span></a>
            <a href={INTL_PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-line">Apply from abroad ↗<span className="sr-only"> on intlapplications.srmist.edu.in (opens in a new tab)</span></a>
          </div>
        </div>
      </div>

      <div className="bg-surface">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-12">
          <address className="col-span-2 not-italic lg:col-span-4">
            <div className="flex items-center gap-4">
              <Image src="/images/srm-crest.png" alt="" width={48} height={48} className="h-12 w-12" />
              <p className="font-semibold leading-tight">SRM Institute of<br />Science and Technology</p>
            </div>
            <p className="mt-5">SRM Nagar, Kattankulathur 603 203<br />Chengalpattu District, Tamil Nadu</p>
            <p className="mt-1 font-semibold"><a className="inline-block py-1.5 hover:text-accent" href="tel:+914427417000">+91-44-27417000</a></p>
          </address>
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title} className="lg:col-span-2">
              <h2 className="text-sm font-semibold text-ink-soft" style={{ letterSpacing: 0 }}>{c.title}</h2>
              <ul className="mt-2">
                {c.links.map(([l, h]) => (<li key={h}><Link href={h} className="block py-1 text-[0.95rem] text-ink-soft hover:text-accent">{l}</Link></li>))}
              </ul>
            </nav>
          ))}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-ink-soft" style={{ letterSpacing: 0 }}>Follow</h2>
            <ul className="mt-2">
              {SOCIAL.map(([l, h]) => (<li key={h}><ExtLink href={h} showHost={false} className="block py-1 text-[0.95rem] text-ink-soft hover:text-accent">{l}</ExtLink></li>))}
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="wrap flex flex-wrap justify-between gap-x-8 gap-y-2 py-4 text-sm text-ink-soft">
            <ExtLink href={WWW} showHost={false} className="hover:text-accent">Official website</ExtLink>
            <ExtLink href={`${WWW}/contact-us/`} showHost={false} className="hover:text-accent">Contact us</ExtLink>
            <ExtLink href={`${WWW}/about-us/accreditations-and-rankings/`} showHost={false} className="hover:text-accent">Accreditations and rankings</ExtLink>
          </div>
        </div>
      </div>

    </footer>
  );
}
