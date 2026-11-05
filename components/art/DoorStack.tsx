import Image from "next/image";
import Link from "next/link";

const DOORS = [
  { href: "/admissions", title: "Admissions", line: "Find your route for 2027, then apply on the official portal.", bg: "bg-gold text-black", img: "/images/cohort.jpg", alt: "SRMIST students standing together outside a campus building" },
  { href: "/academics", title: "Academics", line: "Search all 429 programmes in the catalogue by name, level and length.", bg: "bg-white text-black", img: "/images/classroom.jpg", alt: "Students at desks in an SRMIST classroom" },
  { href: "/research", title: "Research", line: "Pathways for doctoral applicants, faculty and industry partners.", bg: "bg-blue text-white", img: "/images/lab.jpg", alt: "A researcher working with instruments in an SRMIST laboratory" },
];

// Three folders that stack as you scroll, each leaving its tab showing.
export function DoorStack() {
  return (
    <nav aria-label="Start here" className="relative">
      {DOORS.map((d, i) => (
        <Link key={d.href} href={d.href} style={{ top: `calc(4.7rem + ${i * 4.75}rem)` }} className={`group sticky block border-t-[3px] border-black ${d.bg}`}>
          <div className="wrap grid min-h-[calc(100svh-19rem)] content-start gap-4 pb-8 md:min-h-[calc(100svh-15rem)] md:grid-cols-12">
            <span className="block py-1 font-display text-[3.6rem] font-black uppercase leading-[1] group-hover:underline md:col-span-12 md:text-[3.9rem]">{d.title}</span>
            <span className="lede self-end md:col-span-4">{d.line}</span>
            <span className="relative block aspect-[16/10] overflow-hidden border-[3px] border-black md:col-span-8 md:aspect-[21/9]">
              <Image src={d.img} alt={d.alt} fill sizes="(min-width:768px) 66vw, 100vw" className="door-img object-cover" />
            </span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
