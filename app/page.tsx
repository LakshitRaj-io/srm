import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ProgrammeAtlas } from "@/components/ProgrammeAtlas";
import { SectionPager } from "@/components/SectionPager";
import { BuildingViewer } from "@/components/art/BuildingViewer";
import { ExtLink } from "@/components/ExtLink";
import { CampusFilm } from "@/components/art/CampusFilm";
import { DoorStack } from "@/components/art/DoorStack";
import { MaskHero } from "@/components/art/MaskHero";
import { NumbersBento } from "@/components/art/NumbersBento";
import { Parallax } from "@/components/art/Parallax";
import { Glass, RankBoard } from "@/components/art/RankBoard";
import { WWW, accreditations, news } from "@/data/site";

export const metadata: Metadata = { title: { absolute: "SRMIST redesign concept: Learn. Leap. Lead." }, description: "Start here for SRMIST admissions, programmes and research." };

const areas = ["Engineering & Technology", "Medicine", "Dentistry", "Management", "Law", "Architecture", "Science & Humanities", "Agricultural Sciences", "Pharmacy", "Nursing", "Public Health", "Physiotherapy", "Occupational Therapy"];
const n = (i: number) => ({ "--n": i }) as CSSProperties;

export default function Home() {
  return (
    <>
      <MaskHero />
      <SectionPager />

      <DoorStack />

      <section id="programmes" aria-labelledby="programmes-h" className="page page-fit">
        <div className="wrap flex min-h-0 w-full flex-1 flex-col">
          <div data-rise className="flex flex-wrap items-end justify-between gap-x-8 gap-y-1">
            <h2 id="programmes-h" className="t-section">429 programmes. Find your direction.</h2>
            <p className="short-hide text-ink-soft">Search the official catalogue, then open any programme for its details.</p>
          </div>
          <div data-rise style={n(1)} className="mt-4 flex min-h-0 flex-1 flex-col md:mt-5"><ProgrammeAtlas /></div>
        </div>
      </section>

      <section id="campus-3d" aria-labelledby="campus-3d-h" className="page page-fit bg-surface">
        <div className="wrap flex min-h-0 w-full flex-1 flex-col">
          <div data-rise>
            <h2 id="campus-3d-h" className="t-section">The campus in 3D</h2>
            <p className="mt-1 max-w-3xl text-ink-soft">Explore UB, Tech Park I and Tech Park II together in one 3D campus map. Select a building to see what is inside.</p>
          </div>
          <div data-rise style={n(1)} className="flex min-h-0 flex-1 flex-col"><BuildingViewer ids={["ub", "tp", "tp2"]} className="min-h-0 flex-1" /></div>
        </div>
      </section>

      <CampusFilm />

      <section aria-labelledby="tour-entry" className="page page-fit relative isolate overflow-hidden p-0">
        <Link href="/campus-tour" className="group on-dark relative isolate flex flex-1 flex-col justify-end overflow-hidden bg-black text-white">
          <span data-rise="zoom" className="absolute inset-0 -z-20 block">
            <Image src="/images/walkway.jpg" alt="" fill sizes="100vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          </span>
          <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/85 via-black/45 to-black/10" />
          <span className="wrap block w-full pb-20 md:pb-24">
            <span data-rise className="block text-sm font-medium text-white/90">Official 360° tour</span>
            <span id="tour-entry" data-rise style={n(1)} className="t-page mt-2 block max-w-3xl">Walk the campus from anywhere</span>
            <span data-rise style={n(2)} className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition-transform group-hover:translate-x-1">Start the virtual tour <span aria-hidden="true">→</span></span>
          </span>
        </Link>
      </section>

      <section aria-labelledby="bento" className="numbers-bg page page-fit">
        <div className="wrap flex min-h-0 w-full flex-1 flex-col">
          <div data-rise className="flex flex-wrap items-end justify-between gap-x-8 gap-y-1">
            <h2 id="bento" className="t-section">SRMIST in numbers</h2>
            <p className="text-ink-soft">A university of scale, in ten figures from SRMIST's official pages.</p>
          </div>
          <NumbersBento />
        </div>
      </section>

      <section aria-labelledby="ranks" className="on-dark page page-fit relative isolate overflow-hidden bg-black text-white">
        <Image src="/images/stadium.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="rank-veil absolute inset-0 -z-10" />
        <div className="wrap grid min-h-0 w-full flex-1 gap-4 lg:grid-cols-12 lg:gap-8">
          <div className="flex min-h-0 flex-col gap-3 lg:col-span-4 lg:gap-4">
            <h2 id="ranks" data-rise="left" className="t-section">Ranked and accredited</h2>
            <Glass i={1} className="min-h-0 lg:flex-1">
              <p className="glass-num text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-gold">A++</p>
              <p className="mt-2 text-sm font-medium leading-snug md:text-base">NAAC grade, 4th cycle, valid 16.06.2024 to 15.06.2031</p>
            </Glass>
            <div data-rise="left" style={n(2)}>
              <h3 className="text-sm font-semibold tracking-normal text-white/90">Also accredited or recognised by</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {accreditations.map((a) => <li key={a} className="glass-chip rounded-full px-3 py-1 text-xs font-medium md:text-sm">{a}</li>)}
              </ul>
            </div>
          </div>
          <div className="flex min-h-0 flex-col lg:col-span-8">
            <h3 data-rise className="t-card mb-2 lg:mb-3">NIRF 2025 ranks</h3>
            <RankBoard />
          </div>
        </div>
      </section>

      <section aria-labelledby="areas" className="page page-fit bg-tint">
        <div className="wrap grid w-full flex-1 content-center items-center gap-8 lg:grid-cols-12">
          <div data-rise="left" className="lg:col-span-4">
            <h2 id="areas" className="t-section">Thirteen ways in</h2>
            <p className="lede mt-3">Pick a field, then search its programmes.</p>
            <Link href="/academics#finder" className="btn btn-blue mt-6">Find a programme</Link>
          </div>
          <ul className="flex flex-wrap gap-2 md:gap-3 lg:col-span-8">
            {areas.map((a, i) => (
              <li key={a} data-rise="pop" style={n(i * 0.6)}><Link href="/academics#finder" className="area-chip block rounded-2xl border border-line bg-surface px-4 py-2.5 font-medium md:px-6 md:py-4 md:text-xl">{a}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="news" className="page page-fit">
        <div className="wrap flex min-h-0 w-full flex-1 flex-col">
          <div data-rise className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="news" className="t-section">From the campus</h2>
            <ExtLink className="link" href={`${WWW}/news`} showHost={false}>All news</ExtLink>
          </div>
          <div className="mt-4 grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-3 md:mt-6 lg:grid-cols-4 lg:gap-4">
            {news.map((item, i) => (
              <article key={item.title} data-rise="pop" style={n(i + 1)} className={`news-card flex min-h-0 flex-col overflow-hidden rounded-2xl border border-line ${item.image ? "bg-surface" : "justify-end bg-tint"}`}>
                {item.image ? <Parallax src={item.image} alt={item.alt!} sizes="(min-width:1024px) 25vw, 50vw" className="min-h-24 flex-1 rounded-none" /> : null}
                <h3 className="p-3.5 text-base leading-snug md:p-5 md:text-xl">{item.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
