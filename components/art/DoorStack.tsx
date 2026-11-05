import Link from "next/link";
import { Parallax } from "./Parallax";

const DOORS = [
  { href: "/admissions", title: "Admissions", line: "Find your route for 2027, then apply on the official portal.", bg: "bg-tint text-fg", img: "/images/cohort.jpg", alt: "SRMIST students standing together outside a campus building" },
  { href: "/academics", title: "Academics", line: "Search all 429 programmes in the catalogue by name, level and length.", bg: "bg-tint text-fg", img: "/images/classroom.jpg", alt: "Students at desks in an SRMIST classroom" },
  { href: "/research", title: "Research", line: "Pathways for doctoral applicants, faculty and industry partners.", bg: "bg-tint text-fg", img: "/images/lab.jpg", alt: "A researcher working with instruments in an SRMIST laboratory" },
];

// The three journeys, as equal entry cards.
export function DoorStack() {
  return (
    <nav aria-label="Start here" className="wrap grid gap-4 py-16 md:grid-cols-3 md:py-24">
      {DOORS.map((d) => (
        <Link key={d.href} href={d.href} className={`group flex flex-col overflow-hidden rounded-2xl border border-line transition-colors hover:border-accent ${d.bg}`}>
          <span className="block p-6 pb-4">
            <span className="block text-2xl font-semibold tracking-tight">{d.title}</span>
            <span className="mt-2 block text-ink-soft">{d.line}</span>
          </span>
          <Parallax src={d.img} alt={d.alt} sizes="(min-width:768px) 33vw, 100vw" className="mt-auto aspect-[4/3] rounded-none" />
        </Link>
      ))}
    </nav>
  );
}
