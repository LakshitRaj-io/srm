import type { Metadata } from "next";
import Link from "next/link";
import { TourEmbed } from "@/components/TourEmbed";
import { BUILDINGS, TOUR_URL } from "@/data/campus";

export const metadata: Metadata = { title: "Campus tour", description: "SRMIST's official 360° virtual tour of the Kattankulathur campus, plus the campus landmarks." };

export default function CampusTour() {
  return (
    <>
      <section aria-labelledby="tour-h" className="wrap pb-10 pt-12 md:pt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Campus</p>
        <h1 id="tour-h" className="t-page mt-2">Campus tour</h1>
        <p className="lede mt-5">Step inside SRMIST's Kattankulathur campus with the university's official 360° virtual tour. It opens here when you choose to start it, or in its own tab.</p>
        <div className="mt-8"><TourEmbed /></div>
        <noscript>
          <p className="mt-4"><a className="link" href={TOUR_URL}>Open the official virtual tour on srmist.edu.in</a></p>
        </noscript>
      </section>

      <section aria-labelledby="land-h" className="bg-tint">
        <div className="wrap section">
          <h2 id="land-h" className="t-section">Landmarks to look for</h2>
          <p className="lede mt-4">Seen in the 3D reveal on the home page. Facts come from SRMIST's official building records.</p>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {BUILDINGS.map((b) => (
              <li key={b.id} className="panel flex flex-col p-5">
                <h3 className="t-card font-semibold">{b.name}</h3>
                <p className="mt-2 text-ink-soft">{b.line}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">{b.facts.map((f) => <li key={f} className="rounded-full border border-line px-2.5 py-1 text-sm">{f}</li>)}</ul>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4">
                  {b.links.map(([l, h]) => <Link key={h} href={h} className="link py-1">{l}</Link>)}
                </div>
              </li>
            ))}
          </ul>
          <Link href="/#campus-3d" className="btn btn-blue mt-8">See the landmarks in 3D</Link>
        </div>
      </section>
    </>
  );
}
