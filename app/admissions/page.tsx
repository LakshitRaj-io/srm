import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExtLink } from "@/components/ExtLink";
import { CHECKED, INTL_PORTAL, PORTAL, WWW, applyRoutes, scholarships } from "@/data/site";

export const metadata: Metadata = { title: "Admissions 2027", description: "Find the right official SRMIST application route, with steps, fees and scholarships. Redesign concept." };

const steps = [
  ["Choose your route", "Pick your programme group below. Each one has its own official application page."],
  ["Check the programme", "Confirm campus, duration, annual fee and eligibility on the official programme page."],
  ["Register on the portal", "The official form asks for your name, email, mobile, state, city, faculty, degree and programme."],
  ["Verify and sign in", "The portal offers email verification and an existing-user login to continue your application."],
];

export default function Admissions() {
  return (
    <>
      <section className="bg-gold">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-14 md:grid-cols-[3fr_2fr] md:items-end md:px-8 md:py-20">
          <div>
            <p className="font-semibold">Admissions open: 2027</p>
            <h1 className="mt-2 font-display text-[clamp(3rem,9vw,7.5rem)] font-extrabold leading-[0.92] tracking-tighter">Start your application here</h1>
          </div>
          <div>
            <p className="font-serif text-xl">Applications are made on SRMIST&apos;s official portals. This concept only shows you the way there.</p>
            <div className="mt-5 flex flex-col gap-3">
              <ExtLink href={PORTAL} className="bg-ink px-5 py-3 font-bold text-paper">Apply from India</ExtLink>
              <ExtLink href={INTL_PORTAL} className="border-2 border-ink px-5 py-3 font-bold">Apply as an international student</ExtLink>
            </div>
          </div>
        </div>
      </section>

      <section id="steps" aria-labelledby="steps-h" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <h2 id="steps-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">How to apply</h2>
        <ol className="mt-8 grid gap-0 border-t-2 border-ink md:grid-cols-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="border-b-2 border-ink py-6 md:border-r-2 md:px-5 md:first:pl-0 md:last:border-r-0">
              <span aria-hidden="true" className="font-display text-6xl font-extrabold text-blue">{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{t}</h3>
              <p className="mt-1 text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 border-2 border-ink bg-mist p-5">
          <h3 className="font-bold">Important dates</h3>
          <p className="mt-1">Deadlines and exam dates are not shown here because we could not verify them from a current official page. Confirm them on the official portal before you apply.</p>
        </div>
      </section>

      <section id="routes" aria-labelledby="routes-h" className="bg-ink text-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h2 id="routes-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Apply by programme</h2>
          <p className="mt-3 max-w-2xl text-paper/80">Links taken from the official <ExtLink className="underline" href={`${WWW}/admission-india/`} showHost={false}>Admission India page</ExtLink>. Each opens an official SRMIST site.</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {applyRoutes.map((g) => (
              <div key={g.group}>
                <h3 className="border-b-2 border-gold pb-2 text-xl font-bold text-gold">{g.group}</h3>
                <ul>
                  {g.items.map(([l, h]) => (<li key={h} className="border-b border-paper/20"><ExtLink href={h} className="block py-3 hover:text-gold">{l}</ExtLink></li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="funding" aria-labelledby="funding-h" className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-20">
        <div>
          <h2 id="funding-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">Fees and scholarships</h2>
          <p className="mt-4">Annual fees differ by programme. <Link href="/academics#finder" className="font-semibold underline">Search the programme finder</Link> to see the fee listed for each one.</p>
          <p className="mt-4">Scholarship categories listed for the College of Engineering & Technology:</p>
          <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
            {scholarships.map((s) => (<li key={s} className="border-b border-ink/20 py-2">{s}</li>))}
          </ul>
          <div className="mt-5 flex flex-col gap-2">
            <ExtLink className="font-semibold underline" href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srmist-scholarship-categories.pdf">Scholarship categories (PDF)</ExtLink>
            <ExtLink className="font-semibold underline" href={`${WWW}/policies/scholarship-policy/`}>Scholarship policy</ExtLink>
          </div>
        </div>
        <div className="relative min-h-96">
          <Image src="/images/cohort.jpg" alt="A group of SRMIST students standing together outside a campus building" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section id="international" aria-labelledby="intl-h" className="bg-blue text-paper">
        <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
          <h2 id="intl-h" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">International applicants</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="border-t-2 border-paper pt-3"><p className="font-display text-5xl font-extrabold">40%</p><p>fee waiver for NRI / PIO / OCI applicants with SAT, or a score of 70% and above in HSC grades</p></div>
            <div className="border-t-2 border-paper pt-3"><p className="font-display text-5xl font-extrabold">65%</p><p>fee waiver for foreign applicants from Africa, Asia and SAARC, Engineering stream</p></div>
            <div className="border-t-2 border-paper pt-3"><p className="font-display text-5xl font-extrabold">50%</p><p>fee waiver for foreign applicants from Africa, Asia and SAARC, other programmes</p></div>
          </div>
          <p className="mt-6">Waivers as advertised on the <ExtLink className="underline" href={`${WWW}/admission-international/`} showHost={false}>Admission International page</ExtLink>, checked {CHECKED}. Confirm terms there.</p>
        </div>
      </section>

      <section aria-labelledby="help-h" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <h2 id="help-h" className="font-display text-3xl font-extrabold tracking-tight">Talk to Admissions</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          <div><dt className="text-ink-soft">Engineering, Agriculture and Architecture</dt><dd className="text-2xl font-bold"><a href="tel:+917026452645">+91 70 2645 2645</a></dd></div>
          <div><dt className="text-ink-soft">Liberal Arts and Business Studies, Law, Management, Medical and Allied Health Sciences, Hotel Management</dt><dd className="text-2xl font-bold"><a href="tel:+917026472647">+91 70 2647 2647</a></dd></div>
        </dl>
        <ExtLink className="mt-6 inline-block font-semibold underline" href="https://webstor.srmist.edu.in/web_assets/downloads/2026/srm-admission-brochure-2026-2027.pdf">Admission brochure 2026-2027 (PDF)</ExtLink>
      </section>
    </>
  );
}
