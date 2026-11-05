import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExtLink } from "@/components/ExtLink";
import { PageHero } from "@/components/PageHero";
import { CHECKED, INTL_PORTAL, PORTAL, WWW, applyRoutes, scholarships } from "@/data/site";

export const metadata: Metadata = { title: "Admissions 2027", description: "Find the right official SRMIST application route, with steps, fees and scholarships. Redesign concept." };

const steps = [
  ["Choose your route", "Pick your programme group. Each has its own official application page."],
  ["Check the programme", "Confirm campus, duration, annual fee and eligibility on its official page."],
  ["Register on the portal", "Give your name, email, mobile, state, city, faculty, degree and programme."],
  ["Verify and sign in", "The portal offers email verification and a login to continue your application."],
];
const rise = ["lg:mt-18", "lg:mt-12", "lg:mt-6", "lg:mt-0"];

export default function Admissions() {
  return (
    <>
      <PageHero title="Admissions 2027" lede="You apply on SRMIST's official portals. This page shows you the right one, and what to check first." image="/images/cohort.jpg" alt="A group of SRMIST students standing together outside a campus building">
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Apply from India ↗<span className="sr-only"> on applications.srmist.edu.in (opens in a new tab)</span></a>
          <a href={INTL_PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-line">Apply from abroad ↗<span className="sr-only"> on intlapplications.srmist.edu.in (opens in a new tab)</span></a>
        </div>
      </PageHero>

      <section id="steps" aria-labelledby="steps-h" className="bg-white">
        <div className="wrap section">
          <h2 id="steps-h" className="t-section">How to apply</h2>
          <ol className="mt-8 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t} className={`rounded-2xl bg-paper p-5 ${rise[i]}`}>
                <span aria-hidden="true" className="font-display text-3xl font-semibold text-blue">{i + 1}</span>
                <h3 className="mt-2 text-xl">{t}</h3>
                <p className="mt-1.5 text-[0.95rem] text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
          <p className="measure mt-8 text-ink-soft"><strong className="font-semibold text-ink">Dates:</strong> deadlines and exam dates are not shown here because they could not be verified on a current official page. Confirm them on the portal before you apply.</p>
        </div>
      </section>

      <section id="routes" aria-labelledby="routes-h" className="wrap section">
        <h2 id="routes-h" className="t-section">Apply by programme</h2>
        <p className="measure mt-3 text-ink-soft">Each link opens an official SRMIST site, as listed on the <ExtLink className="link" href={`${WWW}/admission-india/`} showHost={false}>Admission India page</ExtLink>.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {applyRoutes.map((g) => (
            <div key={g.group} className="panel p-6">
              <h3 className="text-xl">{g.group}</h3>
              <ul className="mt-3">
                {g.items.map(([l, h]) => (<li key={h}><ExtLink href={h} className="block py-1.5 font-medium hover:text-blue">{l}</ExtLink></li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="funding" aria-labelledby="funding-h" className="bg-white">
        <div className="wrap section grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 id="funding-h" className="t-section">Fees and scholarships</h2>
            <p className="measure mt-4">Annual fees differ by programme. <Link href="/academics#finder" className="link">Search the programme finder</Link> to see each one.</p>
            <p className="measure mt-4 text-ink-soft">Scholarship categories listed for the College of Engineering & Technology:</p>
            <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {scholarships.map((s) => (<li key={s}>{s}</li>))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <ExtLink className="link" href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srmist-scholarship-categories.pdf" showHost={false}>Scholarship categories (PDF)</ExtLink>
              <ExtLink className="link" href={`${WWW}/policies/scholarship-policy/`} showHost={false}>Scholarship policy</ExtLink>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-5">
            <Image src="/images/building.jpg" alt="A multi-storey SRMIST campus building against a clear sky" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section id="international" aria-labelledby="intl-h" className="wrap section">
        <div className="on-dark rounded-3xl bg-ink p-7 text-white md:p-12">
          <h2 id="intl-h" className="t-section">International applicants</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[["40%", "fee waiver for NRI, PIO and OCI applicants with SAT, or 70% and above in HSC grades"], ["65%", "fee waiver for foreign applicants from Africa, Asia and SAARC, Engineering stream"], ["50%", "fee waiver for foreign applicants from Africa, Asia and SAARC, other programmes"]].map(([v, t]) => (
              <div key={v}><p className="font-display text-5xl font-semibold tracking-tight text-gold">{v}</p><p className="mt-2 text-white/85">{t}</p></div>
            ))}
          </div>
          <p className="mt-8 text-[0.95rem] text-white/85">As advertised on the <ExtLink className="underline" href={`${WWW}/admission-international/`} showHost={false}>Admission International page</ExtLink>, checked {CHECKED}. Confirm the terms there.</p>
        </div>
      </section>

      <section aria-labelledby="help-h" className="wrap pb-20">
        <h2 id="help-h" className="t-section">Talk to Admissions</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          <div><dd className="font-display text-2xl font-semibold"><a className="hover:text-blue" href="tel:+917026452645">+91 70 2645 2645</a></dd><dt className="mt-1 text-ink-soft">Engineering, Agriculture and Architecture</dt></div>
          <div><dd className="font-display text-2xl font-semibold"><a className="hover:text-blue" href="tel:+917026472647">+91 70 2647 2647</a></dd><dt className="mt-1 text-ink-soft">Liberal Arts and Business Studies, Law, Management, Medical and Allied Health Sciences, Hotel Management</dt></div>
        </dl>
        <ExtLink className="link mt-6 inline-block" href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-admission-brochure-2026-2027.pdf" showHost={false}>Admission brochure 2026-2027 (PDF)</ExtLink>
      </section>
    </>
  );
}
