import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExtLink } from "@/components/ExtLink";
import { CHECKED, WWW, homeFacts, news, recognition } from "@/data/site";

export const metadata: Metadata = { title: { absolute: "SRMIST redesign concept: Learn. Leap. Lead." }, description: "Start here for SRMIST admissions, programmes and research. Independent redesign concept." };

const paths = [
  { n: "01", href: "/admissions", title: "Admissions", line: "Find the right application route for 2027, with fees, scholarships and the official portal.", cls: "bg-gold text-ink" },
  { n: "02", href: "/academics", title: "Academics", line: "Search the programme catalogue by name, level and duration.", cls: "bg-blue text-paper" },
  { n: "03", href: "/research", title: "Research", line: "Pathways for doctoral applicants, faculty and industry partners.", cls: "bg-ink text-paper" },
];
const areas = ["Engineering & Technology", "Medicine", "Dentistry", "Management", "Law", "Architecture", "Science & Humanities", "Agricultural Sciences", "Pharmacy", "Nursing", "Public Health", "Physiotherapy", "Occupational Therapy"];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <Image src="/images/campus.jpg" alt="Aerial view of the SRMIST Kattankulathur campus beside a lake" fill priority sizes="100vw" className="-z-10 object-cover opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-20 md:px-8 md:pt-32">
          <p className="font-semibold text-gold">SRM Institute of Science and Technology</p>
          <h1 className="mt-3 font-display text-[clamp(3.6rem,13vw,11.5rem)] font-extrabold leading-[0.88] tracking-tighter">Learn.<br />Leap.<br /><span className="text-gold">Lead.</span></h1>
          <p className="mt-8 max-w-xl font-serif text-xl md:text-2xl">A multidisciplinary university established in 1985, with NAAC A++ accreditation and more than 50,000 students.</p>
        </div>
      </section>

      <nav aria-label="Start here" className="grid md:grid-cols-3">
        {paths.map((p) => (
          <Link key={p.href} href={p.href} className={`group flex min-h-64 flex-col justify-between p-6 md:min-h-80 md:p-8 ${p.cls}`}>
            <span className="font-semibold">{p.n}</span>
            <span>
              <span className="block font-display text-4xl font-extrabold tracking-tight md:text-5xl">{p.title} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-2">→</span></span>
              <span className="mt-3 block max-w-sm">{p.line}</span>
            </span>
          </Link>
        ))}
      </nav>

      <section aria-labelledby="facts" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <h2 id="facts" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">SRMIST at a glance</h2>
        <dl className="mt-10 grid grid-cols-2 border-t-2 border-ink lg:grid-cols-4">
          {homeFacts.map((f) => (
            <div key={f.label} className="border-b-2 border-ink py-6 pr-4">
              <dd className="font-display text-5xl font-extrabold tracking-tighter text-blue md:text-7xl">{f.value}</dd>
              <dt className="mt-1">{f.label}</dt>
            </div>
          ))}
        </dl>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recognition.map((f) => (
            <div key={f.label}>
              <dd className="font-display text-3xl font-extrabold">{f.value}</dd>
              <dt className="text-sm text-ink-soft">{f.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-ink-soft">
          As listed on official pages, checked {CHECKED}.{" "}
          <ExtLink className="underline" href={`${WWW}/about-us/accreditations-and-rankings/`}>Accreditations and rankings</ExtLink>
        </p>
      </section>

      <section aria-labelledby="areas" className="bg-mist">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:grid-cols-[1fr_1fr] md:px-8 md:py-24">
          <div className="relative min-h-80">
            <Image src="/images/lab.jpg" alt="A researcher working with analytical instruments in an SRMIST chemistry laboratory" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <h2 id="areas" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">One campus of many disciplines</h2>
            <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-1 font-serif text-2xl md:text-3xl">
              {areas.map((a, i) => (<li key={a}>{a}{i < areas.length - 1 ? <span aria-hidden="true" className="ml-3 text-blue">/</span> : null}</li>))}
            </ul>
            <Link href="/academics#finder" className="mt-8 inline-block border-2 border-ink bg-paper px-5 py-3 font-bold hover:bg-ink hover:text-paper">Find a programme →</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="news" className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="news" className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">From the campus</h2>
          <ExtLink className="font-semibold underline" href={`${WWW}/news`}>All news</ExtLink>
        </div>
        <ul className="mt-8 border-t-2 border-ink">
          {news.map((n) => (
            <li key={n.title} className="grid gap-1 border-b border-ink/25 py-5 md:grid-cols-[10rem_1fr]">
              <span className="text-sm font-bold text-blue">{n.tag}</span>
              <span className="font-serif text-xl md:text-2xl">{n.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
