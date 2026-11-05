import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { CampaignNotice } from "@/components/CampaignNotice";

const DOORS = [
  { href: "/admissions", title: "Admissions", tag: "2027 routes", line: "Find your route for 2027, then apply on the official portal.", img: "/images/cohort.jpg" },
  { href: "/academics", title: "Academics", tag: "429 programmes", line: "Search all 429 programmes by name, level and length, or describe what you enjoy.", img: "/images/classroom.jpg" },
  { href: "/research", title: "Research", tag: "1,100+ patents", line: "Pathways for doctoral applicants, faculty and industry partners.", img: "/images/lab.jpg" },
];

// The three journeys as full-height photo panels. The one under the pointer widens.
export function DoorStack() {
  return (
    <section id="start" aria-labelledby="start-h" className="page page-fit">
      <div className="wrap flex min-h-0 w-full flex-1 flex-col">
        <CampaignNotice />
        <h2 id="start-h" data-rise className="t-section">Start here</h2>
        <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-3 md:mt-6 md:flex-row md:gap-4">
          {DOORS.map((d, i) => (
            <li key={d.href} data-rise="pop" style={{ "--n": i + 1 } as CSSProperties} className="door-slot flex min-h-36 flex-1 md:min-h-0">
              <Link href={d.href} className="door group on-dark relative isolate flex w-full flex-col justify-between gap-3 overflow-hidden rounded-3xl bg-black p-5 text-white md:p-7">
                <Image src={d.img} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="door-img -z-20 object-cover" />
                <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/35 to-black/50" />
                <span className="flex items-center justify-between gap-3">
                  <span className="door-chip rounded-full px-3 py-1 text-sm font-medium">{d.tag}</span>
                  <span aria-hidden="true" className="door-arrow grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg">→</span>
                </span>
                <span className="block">
                  <span className="block text-[clamp(1.75rem,3.4vw,3.25rem)] font-semibold leading-none tracking-tight">{d.title}</span>
                  <span className="door-line mt-2 block max-w-md text-[0.95rem] leading-snug text-white/90 md:mt-3 md:text-base">{d.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
