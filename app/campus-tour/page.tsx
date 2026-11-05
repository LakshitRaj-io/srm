import type { Metadata } from "next";
import Link from "next/link";
import { BuildingViewer } from "@/components/art/BuildingViewer";
import { TourEmbed } from "@/components/TourEmbed";
import { TOUR_URL } from "@/data/campus";

export const metadata: Metadata = { title: "Campus tour", description: "SRMIST's official 360° virtual tour of the Kattankulathur campus, plus the campus landmarks." };

export default function CampusTour() {
  return (
    <>
      <section aria-labelledby="tour-h" className="wrap pb-10 pt-12 md:pt-16">
                <h1 id="tour-h" className="t-page">Campus tour</h1>
        <p className="lede mt-5">Step inside SRMIST's Kattankulathur campus with the university's official 360° virtual tour. It opens here when you choose to start it, or in its own tab.</p>
        <div className="mt-8"><TourEmbed /></div>
        <noscript>
          <p className="mt-4"><a className="link" href={TOUR_URL}>Open the official virtual tour on srmist.edu.in</a></p>
        </noscript>
      </section>

      <section aria-labelledby="land-h" className="bg-tint">
        <div className="wrap section">
          <h2 id="land-h" className="t-section">Landmarks to look for</h2>
          <BuildingViewer ids={["ub", "tp", "tp2"]} className="mt-8" />
        </div>
      </section>
    </>
  );
}
