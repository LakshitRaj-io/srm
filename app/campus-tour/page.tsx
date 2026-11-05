import type { Metadata } from "next";
import Image from "next/image";
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
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {BUILDINGS.map((b) => (
              <li key={b.id}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface"><Image src={b.still} alt={`3D model of ${b.name}`} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" /></div>
                <h3 className="t-card mt-3 font-semibold">{b.name}</h3>
              </li>
            ))}
          </ul>
          <Link href="/#campus-3d" className="btn btn-blue mt-8">See the campus in 3D</Link>
        </div>
      </section>
    </>
  );
}
