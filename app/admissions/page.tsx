import type { Metadata } from "next";
import Link from "next/link";
import { ExtLink } from "@/components/ExtLink";
import { Mosaic } from "@/components/art/Mosaic";
import { BuildingViewer } from "@/components/art/BuildingViewer";
import { RouteFinder } from "@/components/art/RouteFinder";
import { ScrollSteps } from "@/components/art/ScrollSteps";
import { StageHero, type StageOption } from "@/components/art/StageHero";
import { WWW, applyRoutes, scholarships } from "@/data/site";

export const metadata: Metadata = { title: "Admissions 2027", description: "Find the right official SRMIST application route, with steps, fees and scholarships." };

const steps = [
  ["Choose your route", "Pick your programme group. Each has its own official application page."],
  ["Check the programme", "Confirm campus, duration, annual fee and eligibility on its official page."],
  ["Register on the portal", "Give your name, email, mobile, state, city, faculty, degree and programme."],
  ["Verify and sign in", "The portal offers email verification and a login to continue your application."],
] as const;

const stage: StageOption[] = [
  { label: "From India", line: "Choose your programme group, then apply on SRMIST's official portal.", image: "/images/cohort.jpg", alt: "A group of SRMIST students standing together outside a campus building", cta: "Find your route", href: "#finder" },
  { label: "From abroad", line: "One international portal covers every programme, with fee waivers advertised for many applicants.", image: "/images/techpark2.jpg", alt: "The colourful glass facade of the SRMIST Tech Park", cta: "See international options", href: "#international" },
  { label: "Scholarships", line: "Thirteen scholarship categories are listed for Engineering & Technology.", image: "/images/library.jpg", alt: "Rows of bookshelves in the SRMIST Central Library", cta: "See fees and scholarships", href: "#funding" },
  { label: "How to apply", line: "Four steps take you from choosing a route to signing in.", image: "/images/computers.jpg", alt: "Students working at computers in an SRMIST lab", cta: "See the steps", href: "#steps" },
];

export default function Admissions() {
  return (
    <>
      <StageHero title={["Admissions", "2027"]} options={stage} />

      <section id="finder" aria-labelledby="finder-h" className="wrap section">
        <h2 id="finder-h" className="t-section">Find your route</h2>
        <p className="lede mb-8 mt-4">Answer two questions to reach the right official page.</p>
        <RouteFinder />
      </section>

      <section id="steps" aria-labelledby="steps-h" className="bg-tint">
        <div className="wrap section">
          <h2 id="steps-h" className="t-section mb-6">How to apply</h2>
          <ScrollSteps steps={steps} />
        </div>
      </section>

      <section aria-labelledby="ub-h" className="wrap section pb-0 md:pb-0">
        <h2 id="ub-h" className="t-section mb-8">University Building</h2>
        <BuildingViewer ids={["ub"]} />
      </section>

      <section id="routes" aria-labelledby="routes-h" className="wrap section">
        <h2 id="routes-h" className="t-section">Apply by programme</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {applyRoutes.map((g) => (
            <div key={g.group} className="min-w-0 bg-surface p-6">
              <h3 className="t-card">{g.group}</h3>
              <ul className="mt-3">
                {g.items.map(([l, h]) => (<li key={h}><ExtLink href={h} className="block py-1.5 font-medium hover:text-accent">{l}</ExtLink></li>))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Mosaic shots={[{ src: "/images/hostel.jpg", alt: "SRMIST hostel buildings beside the campus lake" }, { src: "/images/walkway.jpg", alt: "A covered walkway through the SRMIST campus" }, { src: "/images/computers.jpg", alt: "Students working at computers in an SRMIST lab" }]} />

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

      <section id="international" aria-labelledby="intl-h" className="on-dark bg-night text-white">
        <div className="wrap section">
          <h2 id="intl-h" className="t-section">Applying from abroad</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[["40%", "fee waiver for NRI, PIO and OCI applicants with SAT, or 70% and above in HSC grades"], ["65%", "fee waiver for foreign applicants from Africa, Asia and SAARC, Engineering stream"], ["50%", "fee waiver for foreign applicants from Africa, Asia and SAARC, other programmes"]].map(([v, t]) => (
              <div key={v}><p className="text-5xl font-semibold tracking-tight text-gold">{v}</p><p className="mt-2">{t}</p></div>
            ))}
          </div>
          <p className="mt-8"><ExtLink className="inline-block py-0.5 font-bold underline" href={`${WWW}/admission-international/`} showHost={false}>Admission International page</ExtLink></p>
        </div>
      </section>

      <section id="contact" aria-labelledby="help-h" className="wrap section">
        <h2 id="help-h" className="t-section">Talk to Admissions</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          <div><dd className="text-2xl font-semibold tracking-tight"><a className="hover:text-accent" href="tel:+917026452645">+91 70 2645 2645</a></dd><dt className="mt-1">Engineering, Agriculture and Architecture</dt></div>
          <div><dd className="text-2xl font-semibold tracking-tight"><a className="hover:text-accent" href="tel:+917026472647">+91 70 2647 2647</a></dd><dt className="mt-1">Liberal Arts and Business Studies, Law, Management, Medical and Allied Health Sciences, Hotel Management</dt></div>
        </dl>
        <ExtLink className="link mt-6 inline-block" href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-admission-brochure-2026-2027.pdf" showHost={false}>Admission brochure 2026-2027 (PDF)</ExtLink>
      </section>
    </>
  );
}
