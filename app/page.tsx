import type { Metadata } from "next";
import Link from "next/link";
import { CampaignNotice } from "@/components/CampaignNotice";
import { ExtLink } from "@/components/ExtLink";
import { CatalogueWall } from "@/components/art/CatalogueWall";
import { DoorStack } from "@/components/art/DoorStack";
import { MaskHero } from "@/components/art/MaskHero";
import { Parallax } from "@/components/art/Parallax";
import { RankBoard } from "@/components/art/RankBoard";
import { Scramble } from "@/components/art/Scramble";
import { ScrubText } from "@/components/art/ScrubText";
import { Ticker } from "@/components/art/Ticker";
import { WWW, accreditations, homeStats, news } from "@/data/site";

export const metadata: Metadata = { title: { absolute: "SRMIST redesign concept: Learn. Leap. Lead." }, description: "Start here for SRMIST admissions, programmes and research." };

const areas = ["Engineering & Technology", "Medicine", "Dentistry", "Management", "Law", "Architecture", "Science & Humanities", "Agricultural Sciences", "Pharmacy", "Nursing", "Public Health", "Physiotherapy", "Occupational Therapy"];

export default function Home() {
  return (
    <>
      <MaskHero />
      <Ticker items={["NAAC A++", "NIRF 2025 University 11", "429 programmes", "Founded 1985", "Admissions open 2027"]} />
      <CampaignNotice />

      <section aria-labelledby="facts" className="wrap section">
        <h2 id="facts" className="sr-only">SRMIST at a glance</h2>
        <ScrubText text="Since 1985, SRMIST has grown to more than 50,000 students and 3,200 academicians, on a green campus of over 250 acres." marks={["1985,", "50,000", "3,200", "250"]} className="font-display text-[clamp(3rem,8.4vw,8.5rem)] font-extrabold uppercase leading-[1.08]" />
      </section>

      <DoorStack />

      <section aria-labelledby="bento" className="relative z-10 border-t-[3px] border-black bg-white">
        <div className="wrap section">
          <h2 id="bento" className="t-section">University in numbers</h2>
          <dl className="mt-8 border-b-[3px] border-black">
            {homeStats.map(([v, l]) => (
              <div key={l} className="grid items-baseline gap-x-6 border-t-[3px] border-black py-2 transition-colors hover:bg-gold md:grid-cols-12">
                <dd className="font-display text-[clamp(3.75rem,9vw,9rem)] font-extrabold leading-[1] text-blue md:col-span-5"><Scramble value={v} /></dd>
                <dt className="font-display text-[clamp(1.75rem,4vw,4rem)] font-extrabold uppercase leading-[1] md:col-span-7">{l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="ranks" className="on-dark bg-black text-white">
        <div className="wrap section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="ranks" className="t-section">Ranked and accredited</h2>
            <p className="mt-6 font-display text-[clamp(7rem,16vw,15rem)] font-extrabold leading-[0.8] text-gold">A++</p>
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

      <section aria-labelledby="areas" className="border-t-[3px] border-black bg-gold">
        <div className="wrap section pb-10">
          <h2 id="areas" className="t-section">Thirteen ways in</h2>
          <ul className="mt-6 flex flex-wrap gap-[3px] border-[3px] border-black bg-black">
            {areas.map((a) => (
              <li key={a} className="grow bg-white"><Link href="/academics#finder" className="block p-3 font-display text-[clamp(1.75rem,3.7vw,3.75rem)] font-extrabold uppercase leading-[1] hover:bg-black hover:text-gold">{a}</Link></li>
            ))}
            <li className="grow bg-blue text-white"><Link href="/academics#finder" className="block p-3 font-display text-[clamp(1.75rem,3.7vw,3.75rem)] font-extrabold uppercase leading-[1] hover:bg-black hover:text-gold">Find a programme</Link></li>
          </ul>
        </div>
      </section>
      <Parallax src="/images/techpark.jpg" alt="Students walking past the colourful Tech Park building on the SRMIST campus" className="h-[60svh] border-y-[3px] border-black" />

      <section aria-labelledby="news" className="wrap section">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="news" className="t-section">From the campus</h2>
          <ExtLink className="link" href={`${WWW}/news`} showHost={false}>All news</ExtLink>
        </div>
        <div className="mt-8 grid gap-[3px] border-[3px] border-black bg-black md:grid-cols-2">
          {news.map((n) => (
            <article key={n.title} className="flex min-h-56 flex-col bg-white">
              {n.image ? <Parallax src={n.image} alt={n.alt!} className="h-56" /> : null}
              <h3 className="p-5 text-3xl leading-none md:text-4xl">{n.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
