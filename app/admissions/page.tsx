import type { Metadata } from "next";
import Link from "next/link";
import { ExtLink } from "@/components/ExtLink";
import { PageHero } from "@/components/PageHero";
import { RouteFinder } from "@/components/art/RouteFinder";
import { ScrollSteps } from "@/components/art/ScrollSteps";
import { Ticker } from "@/components/art/Ticker";
import { INTL_PORTAL, PORTAL, WWW, applyRoutes, scholarships } from "@/data/site";

export const metadata: Metadata = { title: "Admissions 2027", description: "Find the right official SRMIST application route, with steps, fees and scholarships." };

const steps = [
  ["Choose your route", "Pick your programme group. Each has its own official application page."],
  ["Check the programme", "Confirm campus, duration, annual fee and eligibility on its official page."],
  ["Register on the portal", "Give your name, email, mobile, state, city, faculty, degree and programme."],
  ["Verify and sign in", "The portal offers email verification and a login to continue your application."],
] as const;

export default function Admissions() {
  return (
    <>
      <PageHero title={["Admissions", "2027"]} lede="You apply on SRMIST's official portals. This page shows you the right one, and what to check first." image="/images/cohort.jpg" alt="A group of SRMIST students standing together outside a campus building">
        <div className="flex flex-wrap gap-3">
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-line">Apply from India ↗<span className="sr-only"> on applications.srmist.edu.in (opens in a new tab)</span></a>
          <a href={INTL_PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-blue">Apply from abroad ↗<span className="sr-only"> on intlapplications.srmist.edu.in (opens in a new tab)</span></a>
        </div>
      </PageHero>

      <section id="finder" aria-labelledby="finder-h" className="wrap section">
        <h2 id="finder-h" className="t-section">Find your route</h2>
        <p className="lede mb-8 mt-4">Answer two questions to reach the right official page.</p>
        <RouteFinder />
      </section>

      <section id="steps" aria-labelledby="steps-h" className="border-y-[3px] border-black bg-mist">
        <div className="wrap section">
          <h2 id="steps-h" className="t-section mb-6">How to apply</h2>
          <ScrollSteps steps={steps} />
        </div>
      </section>

      <section id="routes" aria-labelledby="routes-h" className="wrap section">
        <h2 id="routes-h" className="t-section">Apply by programme</h2>
        <div className="mt-8 grid gap-[3px] border-[3px] border-black bg-black md:grid-cols-2">
          {applyRoutes.map((g) => (
            <div key={g.group} className="bg-white p-6">
              <h3 className="t-card">{g.group}</h3>
              <ul className="mt-3">
                {g.items.map(([l, h]) => (<li key={h}><ExtLink href={h} className="block py-1.5 font-semibold hover:bg-gold">{l}</ExtLink></li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Ticker items={scholarships} tone="black" speed={60} />

      <section id="funding" aria-labelledby="funding-h" className="wrap section">
        <h2 id="funding-h" className="t-section">Fees and scholarships</h2>
        <p className="measure mt-4">Annual fees differ by programme. <Link href="/academics#finder" className="link">Search the programme finder</Link> to see each one.</p>
        <p className="measure mt-4">Scholarship categories for the College of Engineering & Technology:</p>
        <ul className="mt-3 grid gap-x-6 gap-y-1 font-medium sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((s) => (<li key={s}>{s}</li>))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <ExtLink className="link" href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srmist-scholarship-categories.pdf" showHost={false}>Scholarship categories (PDF)</ExtLink>
          <ExtLink className="link" href={`${WWW}/policies/scholarship-policy/`} showHost={false}>Scholarship policy</ExtLink>
        </div>
      </section>

      <section id="international" aria-labelledby="intl-h" className="on-dark bg-blue text-white">
        <div className="wrap section">
          <h2 id="intl-h" className="t-section">Applying from abroad</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[["40%", "fee waiver for NRI, PIO and OCI applicants with SAT, or 70% and above in HSC grades"], ["65%", "fee waiver for foreign applicants from Africa, Asia and SAARC, Engineering stream"], ["50%", "fee waiver for foreign applicants from Africa, Asia and SAARC, other programmes"]].map(([v, t]) => (
              <div key={v}><p className="font-display text-[clamp(5rem,11vw,10rem)] font-extrabold leading-[0.85] text-gold">{v}</p><p className="mt-2">{t}</p></div>
            ))}
          </div>
          <p className="mt-8"><ExtLink className="font-bold underline" href={`${WWW}/admission-international/`} showHost={false}>Admission International page</ExtLink></p>
        </div>
      </section>

      <section aria-labelledby="help-h" className="wrap section">
        <h2 id="help-h" className="t-section">Talk to Admissions</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          <div><dd className="font-display text-5xl font-extrabold md:text-6xl"><a className="hover:bg-gold" href="tel:+917026452645">+91 70 2645 2645</a></dd><dt className="mt-1">Engineering, Agriculture and Architecture</dt></div>
          <div><dd className="font-display text-5xl font-extrabold md:text-6xl"><a className="hover:bg-gold" href="tel:+917026472647">+91 70 2647 2647</a></dd><dt className="mt-1">Liberal Arts and Business Studies, Law, Management, Medical and Allied Health Sciences, Hotel Management</dt></div>
        </dl>
        <ExtLink className="link mt-6 inline-block" href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-admission-brochure-2026-2027.pdf" showHost={false}>Admission brochure 2026-2027 (PDF)</ExtLink>
      </section>
    </>
  );
}
