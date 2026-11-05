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
const span = ["md:col-span-6 md:row-span-2 bg-blue text-white", "md:col-span-3 bg-gold", "md:col-span-3 bg-white", "md:col-span-3 bg-black text-white", "md:col-span-3 bg-white", "md:col-span-4 bg-white", "md:col-span-4 bg-black text-white", "md:col-span-4 bg-gold"];

export default function Home() {
  return (
    <>
      <MaskHero />
      <div className="overflow-hidden py-3">
        <Ticker items={["NAAC A++", "NIRF 2025 University 11", "429 programmes", "Founded 1985", "Admissions open 2027"]} tilt={-1.2} />
        <Ticker items={["Learn", "Leap", "Lead"]} tone="blue" reverse tilt={0.8} speed={26} />
      </div>
      <CampaignNotice />

      <section aria-labelledby="facts" className="wrap section">
        <h2 id="facts" className="sr-only">SRMIST at a glance</h2>
        <ScrubText text="Since 1985, SRMIST has grown to more than 50,000 students and 3,200 academicians, on a green campus of over 250 acres." className="font-display text-[clamp(3rem,8.4vw,8.5rem)] font-black uppercase leading-[0.95]" />
      </section>

      <DoorStack />

      <section aria-labelledby="bento" className="relative z-10 border-t-[3px] border-black bg-white">
        <div className="wrap section">
          <h2 id="bento" className="t-section">University in numbers</h2>
          <dl className="mt-8 grid auto-rows-[minmax(10rem,auto)] gap-[3px] border-[3px] border-black bg-black md:grid-cols-12">
            {homeStats.map(([v, l], i) => (
              <div key={l} className={`flex flex-col justify-end p-5 ${span[i]}`}>
                <dd className={`font-display font-black leading-[0.85] ${i === 0 ? "text-[clamp(5rem,14vw,14rem)]" : "text-7xl"}`}><Scramble value={v} /></dd>
                <dt className="mt-2 font-semibold">{l}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="ranks" className="on-dark bg-black text-white">
        <div className="wrap section grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="ranks" className="t-section">Ranked and accredited</h2>
            <p className="mt-6 font-display text-[clamp(7rem,16vw,15rem)] font-black leading-[0.8] text-gold">A++</p>
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
          <ul className="mt-6 font-display text-[clamp(2.25rem,5.4vw,5.5rem)] font-black uppercase leading-[1.02]">
            {areas.map((a, i) => (<li key={a} className="inline">{a}{i < areas.length - 1 ? <span className="px-3 text-blue">/</span> : null} </li>))}
          </ul>
          <Link href="/academics#finder" className="btn btn-line mt-8">Find a programme</Link>
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
