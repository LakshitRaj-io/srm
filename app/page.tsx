import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CampaignNotice } from "@/components/CampaignNotice";
import { ProgrammeAtlas } from "@/components/ProgrammeAtlas";
import { BuildingViewer } from "@/components/art/BuildingViewer";
import { ExtLink } from "@/components/ExtLink";
import { CampusFilm } from "@/components/art/CampusFilm";
import { DoorStack } from "@/components/art/DoorStack";
import { NumbersBento } from "@/components/art/NumbersBento";
import { Parallax } from "@/components/art/Parallax";
import { RankBoard } from "@/components/art/RankBoard";
import { WWW, accreditations, news } from "@/data/site";

export const metadata: Metadata = { title: { absolute: "SRMIST redesign concept: Learn. Leap. Lead." }, description: "Start here for SRMIST admissions, programmes and research." };

const areas = ["Engineering & Technology", "Medicine", "Dentistry", "Management", "Law", "Architecture", "Science & Humanities", "Agricultural Sciences", "Pharmacy", "Nursing", "Public Health", "Physiotherapy", "Occupational Therapy"];

export default function Home() {
  return (
    <>
      <section className="on-dark relative isolate flex min-h-[calc(var(--vh)*100-var(--hdr))] items-end overflow-hidden bg-black text-white">
        <Image src="/images/campus.jpg" alt="Aerial view of the SRMIST Kattankulathur campus beside a lake" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 via-45% to-transparent" />
        <div className="wrap w-full pb-14 pt-24 md:pb-20">
          <h1 className="t-hero">Learn. Leap. Lead.</h1>
          <p className="lede mt-4">SRM Institute of Science and Technology is a multidisciplinary university, founded in 1985 and accredited A++ by NAAC.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/academics#finder" className="btn btn-gold">Find a programme</Link>
            <Link href="/admissions" className="btn btn-line">Admissions 2027</Link>
          </div>
        </div>
      </section>
      <CampaignNotice />

      <DoorStack />

      <section aria-labelledby="programmes" className="wrap section pt-0 md:pt-0">
        <h2 id="programmes" className="t-section">429 programmes. Find your direction.</h2>
        <p className="lede mb-8 mt-4">Search the official catalogue, then open any programme for its details.</p>
        <ProgrammeAtlas />
      </section>

      <section id="campus-3d" aria-labelledby="campus-3d-h" className="bg-surface">
        <div className="wrap section pt-0 md:pt-0">
          <h2 id="campus-3d-h" className="t-section">The campus in 3D</h2>
          <p className="lede mb-8 mt-4">Three landmarks, modelled from official images. Drag to turn.</p>
          <BuildingViewer ids={["ub", "tp", "tp2"]} />
        </div>
      </section>

      <CampusFilm />

      <section aria-labelledby="tour-entry" className="wrap pb-16">
        <Link href="/campus-tour" className="group on-dark relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl bg-black p-6 text-white md:min-h-80 md:p-10">
          <Image src="/images/walkway.jpg" alt="" fill sizes="(min-width:1280px) 1200px, 100vw" className="-z-10 object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
          <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/85 via-black/40 to-transparent" />
          <span className="text-sm font-medium text-white/85">Official 360° tour</span>
          <span id="tour-entry" className="t-section mt-2 block max-w-2xl">Walk the campus from anywhere</span>
          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-black">Start the virtual tour</span>
        </Link>
      </section>

      <section aria-labelledby="bento" className="bg-surface">
        <div className="wrap section">
          <h2 id="bento" className="t-section">SRMIST in numbers</h2>
          <p className="lede mt-4">A university of scale, in ten figures from SRMIST's official pages.</p>
          <NumbersBento />
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
