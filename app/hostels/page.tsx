import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HOSTELS, HOSTEL_HANDBOOK_URL, HOSTEL_INVENTORY_URL, HOSTEL_PAGE_URL, HOSTEL_VIRTUAL_TOUR_URL, type HostelCategory } from "@/data/hostels";

export const metadata: Metadata = {
  title: "Hostels",
  description: "Explore student residences, hostel facilities and published room inventory at SRMIST Kattankulathur.",
};

const facilities = [
  ["01", "Connected", "Wi-Fi connectivity"],
  ["02", "Hot water", "Solar water heating"],
  ["03", "Everyday", "Purified water and coolers"],
  ["04", "Wellbeing", "Gym, prayer halls and medical care on campus"],
  ["05", "Laundry", "Laundry facilities"],
  ["06", "Community", "Sports, games and cultural activities"],
];

const categories: { name: HostelCategory; id: string; intro: string }[] = [
  { name: "Men’s hostel", id: "mens-hostels", intro: "Residence names listed in the SRMIST handbook." },
  { name: "Ladies’ hostel", id: "ladies-hostels", intro: "Residence names listed in the SRMIST handbook." },
  { name: "NRI hostel", id: "nri-hostels", intro: "International and NRI residence options named in the handbook." },
];

const views = ["18%", "35%", "52%", "69%", "84%", "44%", "27%", "61%"];

function HostelCard({ name, category, rooms, index }: { name: string; category: HostelCategory; rooms?: number; index: number }) {
  const nameStyle = { fontSize: name.length > 15 ? "clamp(1.8rem, 3vw, 3.1rem)" : "clamp(2.2rem, 3.8vw, 4rem)", animationDelay: `${Math.min(index, 10) * 55}ms` } satisfies CSSProperties;
  return (
    <article className="hostel-card group overflow-hidden rounded-[1.35rem] border border-line bg-surface shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative isolate aspect-[1.22] overflow-hidden bg-[#7b8e7a] text-white">
        <Image src="/images/hostel.jpg" alt="SRMIST hostel buildings beside the campus lake" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="hostel-photo -z-20 object-cover transition duration-700 group-hover:scale-105" style={{ objectPosition: `${views[index % views.length]} center` }} />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071a36]/95 via-[#071a36]/30 to-[#071a36]/15" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-5">
          <span className="rounded-full border border-white/35 bg-black/20 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">{category}</span>
          <span aria-hidden="true" className="text-sm font-semibold text-white/80">KTR · {String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:px-6 sm:pb-6">
          <p className="hostel-kicker mb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#f5c451]">A place to call yours</p>
          <h3 style={nameStyle} className="hostel-title max-w-full font-bold leading-[0.9] tracking-[-0.055em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,.45)]">{name}</h3>
        </div>
        <div aria-hidden="true" className="hostel-sweep absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex min-h-[5.25rem] items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-accent">Residence</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">Kattankulathur · {category.toLowerCase()}</p>
          </div>
          {rooms ? <div className="shrink-0 text-right"><p className="text-2xl font-bold tracking-tight text-ink">{rooms}</p><p className="text-xs font-medium text-ink-soft">rooms · 2025 inventory</p></div> : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-xs leading-relaxed text-ink-soft">{rooms ? "Room count from SRMIST’s 2025 disclosure." : "See SRMIST for current room and allotment details."}</p>
          <a href={HOSTEL_PAGE_URL} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm font-bold text-accent underline underline-offset-2">Details ↗<span className="sr-only"> on srmist.edu.in (opens in a new tab)</span></a>
        </div>
      </div>
    </article>
  );
}

export default function HostelsPage() {
  return (
    <>
      <section aria-labelledby="hostels-title" className="wrap pt-8 md:pt-12">
        <div className="hostel-hero on-dark relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[#0d1b33] p-6 text-white sm:min-h-[40rem] sm:p-10 lg:min-h-[46rem] lg:p-14">
          <Image src="/images/hostel.jpg" alt="SRMIST hostel buildings beside the campus lake" fill priority sizes="(min-width:1280px) 1200px, 100vw" className="-z-20 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071a36]/95 via-[#071a36]/40 to-[#071a36]/10" />
          <div aria-hidden="true" className="hostel-hero-orbit absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full border border-white/30 sm:right-12 sm:top-12 sm:h-96 sm:w-96" />
          <div className="max-w-4xl">
            <p className="hostel-hero-copy text-sm font-bold uppercase tracking-[0.18em] text-[#f5c451]">Kattankulathur · residential life</p>
            <h1 id="hostels-title" className="hostel-hero-title mt-4 text-[clamp(3.6rem,10vw,8.5rem)] font-bold leading-[0.82] tracking-[-0.075em]">Find your<br /><span className="text-[#f5c451]">place here.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">A closer look at the residences, shared facilities and room inventory published for SRMIST’s Kattankulathur campus.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#residence-list" className="btn btn-gold">Explore the hostels ↓</a>
              <a href={HOSTEL_VIRTUAL_TOUR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-line">View the hostel tour ↗<span className="sr-only"> on the official SRMIST site (opens in a new tab)</span></a>
            </div>
          </div>
          <p className="absolute right-5 top-5 hidden max-w-56 text-right text-xs font-medium text-white/75 sm:block">A student residence is more than a room. It’s where campus begins to feel familiar.</p>
        </div>
      </section>

      <section aria-labelledby="hostel-facilities" className="wrap section pb-12">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">Everyday, made easier</p>
            <h2 id="hostel-facilities" className="t-section mt-3">Room to live.<br />Space to belong.</h2>
            <p className="lede mt-4">SRMIST lists practical support and community spaces across its Kattankulathur hostels.</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
            {facilities.map(([n, title, detail]) => <li key={n} className="bg-surface p-5"><p className="text-xs font-bold tracking-[0.15em] text-accent">{n} / {title}</p><p className="mt-2 font-semibold leading-snug">{detail}</p></li>)}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-tint px-5 py-4 text-sm text-ink-soft">
          <span className="font-bold text-ink">Room options</span>
          <span>AC: 2 or 3 sharing</span><span aria-hidden="true">·</span><span>Non-AC: 2, 3 or 4 sharing</span><span aria-hidden="true">·</span><span>Attached or common washrooms, depending on room</span>
        </div>
      </section>

      <section id="residence-list" aria-labelledby="residence-title" className="bg-tint">
        <div className="wrap section">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">Choose your block</p>
              <h2 id="residence-title" className="t-section mt-3">The residence directory</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink-soft">Published room counts appear where listed in SRMIST’s 2025 inventory. Room types and availability can change by academic year.</p>
          </div>
          <nav aria-label="Hostel categories" className="mt-7 flex flex-wrap gap-2">
            {categories.map((category) => <a key={category.id} href={`#${category.id}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">{category.name}</a>)}
          </nav>

          {categories.map((category) => {
            const entries = HOSTELS.filter((hostel) => hostel.category === category.name);
            return (
              <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="mt-14 scroll-mt-28">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div><h3 id={`${category.id}-title`} className="text-2xl font-bold tracking-tight">{category.name}s</h3><p className="mt-1 text-sm text-ink-soft">{category.intro}</p></div>
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-ink-soft">{String(entries.length).padStart(2, "0")} residences</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {entries.map((hostel, index) => <HostelCard key={hostel.name} {...hostel} index={index + HOSTELS.indexOf(hostel)} />)}
                </div>
              </section>
            );
          })}

          <div className="mt-12 rounded-2xl border border-line bg-surface p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <div><p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">Plan your stay</p><h3 className="mt-2 text-2xl font-bold tracking-tight">Check the latest SRMIST guidance</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">Room allocation, hostel rules and booking windows are updated by the university. Confirm the current details directly with SRMIST.</p></div>
            <div className="mt-5 flex shrink-0 flex-wrap gap-2 md:mt-0">
              <a className="btn btn-blue" href={HOSTEL_PAGE_URL} target="_blank" rel="noopener noreferrer">SRMIST hostel page ↗</a>
              <a className="btn btn-line" href={HOSTEL_HANDBOOK_URL} target="_blank" rel="noopener noreferrer">2025–26 handbook ↗</a>
            </div>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-ink-soft">Photo: SRMIST’s official hostel-and-lake campus image. The same campus photograph is used for residence cards because the referenced handbook and inventory do not provide individual block portraits. Room counts: <a className="underline underline-offset-2" href={HOSTEL_INVENTORY_URL} target="_blank" rel="noopener noreferrer">2025 AICTE mandatory disclosure, page 156</a>.</p>
        </div>
      </section>
    </>
  );
}
