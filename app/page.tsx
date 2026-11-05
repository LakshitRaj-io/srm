import type { Metadata } from "next";
import Link from "next/link";
import { CampaignNotice } from "@/components/CampaignNotice";
import { ExtLink } from "@/components/ExtLink";
import { CatalogueWall } from "@/components/art/CatalogueWall";
import { CampusFilm } from "@/components/art/CampusFilm";
import { DoorStack } from "@/components/art/DoorStack";
import { ExpandImage } from "@/components/art/ExpandImage";
import { MaskHero } from "@/components/art/MaskHero";
import { Parallax } from "@/components/art/Parallax";
import { RankBoard } from "@/components/art/RankBoard";
import { Scramble } from "@/components/art/Scramble";
import { WWW, accreditations, homeStats, news } from "@/data/site";

export const metadata: Metadata = { title: { absolute: "SRMIST redesign concept: Learn. Leap. Lead." }, description: "Start here for SRMIST admissions, programmes and research." };

const areas = ["Engineering & Technology", "Medicine", "Dentistry", "Management", "Law", "Architecture", "Science & Humanities", "Agricultural Sciences", "Pharmacy", "Nursing", "Public Health", "Physiotherapy", "Occupational Therapy"];

export default function Home() {
  return (
    <>
      <MaskHero />
      <CampaignNotice />

      <DoorStack />
      <CampusFilm />

      <section aria-labelledby="bento" className="bg-surface">
        <div className="wrap section">
          <h2 id="bento" className="t-section">SRMIST in numbers</h2>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-5">
            {homeStats.map(([v, l]) => (
              <div key={l} className="bg-surface p-5 md:p-6">
                <dd className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-none tracking-tight"><Scramble value={v} /></dd>
                <dt className="mt-2 text-[0.95rem] text-ink-soft">{l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="ranks" className="on-dark bg-night text-white">
        <div className="wrap section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="ranks" className="t-section">Ranked and accredited</h2>
            <p className="mt-6 text-6xl font-semibold tracking-tight text-gold">A++</p>
            <p className="mt-3 font-semibold">NAAC grade, 4th cycle, valid 16.06.2024 to 15.06.2031</p>
            <p className="mt-6 text-[0.95rem] text-white/85">Also accredited or recognised by: {accreditations.join(", ")}.</p>
          </div>
          <div className="lg:col-span-7">
            <h3 className="t-card mb-3">NIRF 2025 ranks</h3>
            <RankBoard />
            <p className="mt-4 text-[0.95rem] text-white/85">QS World University Rankings 2027: 1001-1200. <ExtLink className="font-bold underline" href={`${WWW}/about-us/accreditations-and-rankings/`} showHost={false}>See all years</ExtLink></p>
          </div>
        </div>
      </section>

      <section aria-labelledby="wall" className="wrap section">
        <h2 id="wall" className="t-section">429 programmes, one wall</h2>
        <p className="lede mb-8 mt-4">Each cell is a real programme. Move across the wall to read them, or pick a level.</p>
        <CatalogueWall />
      </section>

      <section aria-labelledby="areas" className="bg-tint">
        <div className="wrap section pb-10">
          <h2 id="areas" className="t-section">Thirteen ways in</h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {areas.map((a) => (
              <li key={a}><Link href="/academics#finder" className="block rounded-full border border-line bg-surface px-4 py-2 font-medium hover:border-accent hover:text-accent">{a}</Link></li>
            ))}
          </ul>
          <Link href="/academics#finder" className="btn btn-blue mt-8">Find a programme</Link>
        </div>
      </section>
      <ExpandImage src="/images/hostel.jpg" alt="SRMIST hostel buildings beside the campus lake" caption="Hostels by the lake" />

      <section aria-labelledby="news" className="wrap section">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="news" className="t-section">From the campus</h2>
          <ExtLink className="link" href={`${WWW}/news`} showHost={false}>All news</ExtLink>
        </div>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {news.map((n) => (
            <article key={n.title} className="flex min-h-56 flex-col bg-surface">
              {n.image ? <Parallax src={n.image} alt={n.alt!} className="h-56 rounded-none" /> : null}
              <h3 className="p-5 text-xl leading-snug">{n.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
