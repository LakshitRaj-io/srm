import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CampaignNotice } from "@/components/CampaignNotice";
import { ExtLink } from "@/components/ExtLink";
import { CHECKED, WWW, accreditations, news, nirf } from "@/data/site";

export const metadata: Metadata = { title: { absolute: "SRMIST redesign concept: Learn. Leap. Lead." }, description: "Start here for SRMIST admissions, programmes and research. Independent redesign concept." };

// Applicant to student to researcher: the steps rise in that order.
const steps = [
  { href: "/admissions", title: "Admissions", line: "Find your route for 2027", tile: "bg-gold text-ink", size: "lg:h-[28%]", width: "ml-auto w-[86%] lg:ml-0 lg:w-auto", delay: "100ms" },
  { href: "/academics", title: "Academics", line: "Search 429 programmes", tile: "bg-white text-ink", size: "lg:h-[42%]", width: "ml-auto w-[93%] lg:ml-0 lg:w-auto", delay: "220ms" },
  { href: "/research", title: "Research", line: "Pathways for doctoral applicants, faculty and industry", tile: "bg-blue text-white", size: "lg:h-[56%]", width: "w-full lg:w-auto", delay: "340ms" },
];
const areas = ["Engineering & Technology", "Medicine", "Dentistry", "Management", "Law", "Architecture", "Science & Humanities", "Agricultural Sciences", "Pharmacy", "Nursing", "Public Health", "Physiotherapy", "Occupational Therapy"];

export default function Home() {
  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-ink text-white">
        <Image src="/images/campus.jpg" alt="Aerial view of the SRMIST Kattankulathur campus beside a lake" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" />
        <div className="wrap grid lg:h-[max(36rem,calc(100svh-7.5rem))] lg:grid-cols-12 lg:gap-8">
          <div className="py-14 lg:col-span-5 lg:self-center lg:py-16">
            <h1 className="t-hero">Learn.<br />Leap.<br />Lead.</h1>
            <p className="lede mt-6">SRM Institute of Science and Technology is a multidisciplinary university, founded in 1985 and accredited A++ by NAAC.</p>
          </div>
          <nav aria-label="Start here" className="flex flex-col lg:col-span-7 lg:h-full lg:flex-row lg:items-end">
            {steps.map((s) => (
              <Link key={s.href} href={s.href} style={{ "--d": s.delay } as CSSProperties} className={`rise group block p-5 lg:flex-1 lg:p-6 ${s.tile} ${s.size} ${s.width}`}>
                <span className="block font-display text-2xl font-semibold tracking-tight underline-offset-4 group-hover:underline lg:text-[1.75rem]">{s.title}</span>
                <span className="mt-1 block text-[0.95rem] leading-snug">{s.line}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <CampaignNotice />

      <section aria-labelledby="facts" className="wrap pb-16 pt-10 md:pb-24">
        <h2 id="facts" className="sr-only">SRMIST at a glance</h2>
        <p className="t-statement max-w-5xl">Since 1985, SRMIST has grown to more than 50,000 students and 3,200 academicians, on a green campus of over 250 acres.</p>
      </section>

      <section aria-labelledby="ranks" className="bg-white">
        <div className="wrap section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="ranks" className="t-section">Rankings and accreditations</h2>
            <p className="mt-6 font-display text-7xl font-semibold tracking-tight text-blue">A++</p>
            <p className="mt-1 text-ink-soft">NAAC grade, 4th cycle, valid 16.06.2024 to 15.06.2031</p>
            <h3 className="mt-8 text-lg">Also accredited or recognised by</h3>
            <ul className="mt-2 text-[0.95rem] text-ink-soft">
              {accreditations.map((a) => (<li key={a}>{a}</li>))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <h3 className="text-xl">NIRF 2025 rank</h3>
            <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {nirf.map(([k, v], i) => (
                <div key={k} className={`rounded-2xl p-4 ${i < 2 ? "bg-blue text-white" : "bg-paper"}`}>
                  <dd className="font-display text-4xl font-semibold tracking-tight">{v}</dd>
                  <dt className={`mt-0.5 text-[0.9rem] leading-snug ${i < 2 ? "" : "text-ink-soft"}`}>{k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[0.95rem] text-ink-soft">QS World University Rankings 2027: 1001-1200. Figures from the official page, checked {CHECKED}. <ExtLink className="link" href={`${WWW}/about-us/accreditations-and-rankings/`} showHost={false}>See all years</ExtLink></p>
          </div>
        </div>
      </section>

      <section aria-labelledby="areas" className="wrap section grid items-center gap-10 md:grid-cols-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl md:col-span-6">
          <Image src="/images/techpark.jpg" alt="Students walking past the colourful Tech Park building on the SRMIST campus" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="md:col-span-6 md:pl-6">
          <h2 id="areas" className="t-section">Thirteen ways into one university</h2>
          <ul className="mt-6 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {areas.map((a) => (<li key={a}>{a}</li>))}
          </ul>
          <Link href="/academics#finder" className="btn btn-blue mt-7">Find a programme</Link>
        </div>
      </section>

      <section aria-labelledby="news" className="bg-white">
        <div className="wrap section">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="news" className="t-section">From the campus</h2>
            <ExtLink className="link" href={`${WWW}/news`} showHost={false}>All news</ExtLink>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-12">
            {news.filter((n) => n.image).map((n) => (
              <article key={n.title} className="md:col-span-4">
                <div className="relative aspect-[3/2] overflow-hidden rounded-3xl">
                  <Image src={n.image!} alt={n.alt!} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                </div>
                <h3 className="mt-4 text-xl leading-snug">{n.title}</h3>
              </article>
            ))}
            <ul className="space-y-6 md:col-span-4">
              {news.filter((n) => !n.image).map((n) => (<li key={n.title}><h3 className="text-xl leading-snug">{n.title}</h3></li>))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
