import Image from "next/image";
import Link from "next/link";
import { INTL_PORTAL, PORTAL, WWW } from "@/data/site";
import { ExtLink } from "./ExtLink";

const COLUMNS = [
  { title: "Study", links: [["Programme finder", "/academics#finder"], ["Study areas", "/academics#areas"], ["Programme example", "/academics#detail"]] },
  { title: "Apply", links: [["Find your route", "/admissions#finder"], ["How to apply", "/admissions#steps"], ["Fees and scholarships", "/admissions#funding"], ["Applying from abroad", "/admissions#international"]] },
  { title: "Campus", links: [["Virtual campus tour", "/campus-tour"], ["Campus in 3D", "/#campus-3d"], ["Hostels", "/hostels"]] },
  { title: "Research", links: [["Your pathway", "/research#pathways"], ["Centres", "/research#centres"], ["Research record", "/research#record"], ["Directorate", "/research#contact"]] },
];
const SOCIAL = [
  ["Facebook", "https://www.facebook.com/SRMUniversityOfficial"],
  ["Instagram", "https://www.instagram.com/SRMUniversityOfficial/"],
  ["LinkedIn", "https://www.linkedin.com/company/srm-ist-chennai"],
  ["YouTube", "https://www.youtube.com/user/SRMeducation"],
  ["X", "https://twitter.com/SRM_Univ"],
];
const LEGAL = [
  ["Official website", WWW],
  ["Contact us", `${WWW}/contact-us/`],
  ["Accreditations and rankings", `${WWW}/about-us/accreditations-and-rankings/`],
];

const heading = "text-base font-semibold tracking-normal text-fg";
const link = "inline-block py-1 text-[0.95rem] text-ink-soft transition-colors hover:text-accent";

// Text-only footer: a closing call to apply, the address, five even link columns and a legal line.
export function Footer() {
  return (
    <footer className="site-footer relative z-10 flex flex-col">
      <div className="footer-cta on-dark flex items-center bg-blue text-white">
        <div className="wrap flex w-full flex-wrap items-center justify-between gap-6 py-10 md:py-14">
          <h2 className="t-section">Admissions 2027 are open</h2>
          <div className="flex flex-wrap gap-3">
            <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Apply from India<span className="sr-only"> on applications.srmist.edu.in (opens in a new tab)</span></a>
            <a href={INTL_PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-line">Apply from abroad<span className="sr-only"> on intlapplications.srmist.edu.in (opens in a new tab)</span></a>
          </div>
        </div>
      </div>

      <div className="bg-surface">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-9 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8 lg:py-14 xl:grid-cols-[2.1fr_repeat(5,1fr)]">
          <address className="col-span-2 not-italic sm:col-span-3 lg:col-span-5 xl:col-span-1">
            <div className="flex items-center gap-3">
              <Image src="/images/srm-crest.png" alt="" width={48} height={48} className="h-12 w-12 shrink-0" />
              <p className="font-semibold leading-tight">SRM Institute of<br />Science and Technology</p>
            </div>
            <p className="mt-4 text-[0.95rem] text-ink-soft">SRM Nagar, Kattankulathur 603 203<br />Chengalpattu District, Tamil Nadu</p>
            <p className="mt-1"><a className="inline-block py-1 text-[0.95rem] font-medium transition-colors hover:text-accent" href="tel:+914427417000">+91-44-27417000</a></p>
          </address>
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className={heading}>{c.title}</h2>
              <ul className="mt-3">
                {c.links.map(([l, h]) => (<li key={h}><Link href={h} className={link}>{l}</Link></li>))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Follow" className="col-span-2 sm:col-span-1">
            <h2 className={heading}>Follow</h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 sm:block">
              {SOCIAL.map(([l, h]) => (<li key={h}><ExtLink href={h} showHost={false} arrow={false} className={link}>{l}</ExtLink></li>))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-line">
          <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-1 pb-20 pt-4 text-sm text-ink-soft md:pb-5 md:pr-44">
            <p>© {new Date().getFullYear()} SRM Institute of Science and Technology</p>
            <ul className="flex flex-wrap gap-x-6">
              {LEGAL.map(([l, h]) => (<li key={h}><ExtLink href={h} showHost={false} arrow={false} className="inline-block py-1 transition-colors hover:text-accent">{l}</ExtLink></li>))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
