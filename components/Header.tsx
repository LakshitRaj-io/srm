"use client";
import { motion, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PORTAL, WWW } from "@/data/site";

const NAV = [
  { href: "/admissions", label: "Admissions", sub: [["Find your route", "/admissions#finder"], ["How to apply", "/admissions#steps"], ["Apply by programme", "/admissions#routes"], ["Fees and scholarships", "/admissions#funding"], ["International applicants", "/admissions#international"]] },
  { href: "/academics", label: "Academics", sub: [["Programme finder", "/academics#finder"], ["Study areas", "/academics#areas"], ["Programme page example", "/academics#detail"]] },
  { href: "/research", label: "Research", sub: [["Find your pathway", "/research#pathways"], ["Explore the centres", "/research#centres"], ["Research record", "/research#record"], ["Contact the Directorate", "/research#contact"]] },
] as const;

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const path = usePathname();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => { setOpen(null); setMobile(false); }, [path]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", click);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("mousedown", click); };
  }, []);

  return (
    <header ref={ref} className="sticky top-0 z-40 border-b-[3px] border-black bg-white">
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="SRM Institute of Science and Technology home">
          <Image src="/images/srm-crest.png" alt="" width={52} height={52} priority className="h-[3.25rem] w-[3.25rem]" />
          <span className="hidden font-display text-xl font-extrabold uppercase leading-[1] sm:block">SRM Institute of<br />Science and Technology</span>
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-2">
            {NAV.map((n) => (
              <li key={n.href} className="relative flex items-center">
                <Link href={n.href} aria-current={path === n.href ? "page" : undefined} className={`px-2 py-1 font-display text-2xl font-extrabold uppercase hover:bg-gold ${path === n.href ? "bg-black text-white hover:text-black" : ""}`}>{n.label}</Link>
                <button type="button" aria-expanded={open === n.href} aria-controls={`menu-${n.label}`} aria-label={`${n.label} sections`} onClick={() => setOpen(open === n.href ? null : n.href)} className="grid h-9 w-7 place-items-center hover:bg-gold">
                  <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open === n.href ? "rotate-180" : ""}`}><path d="M1.5 4 6 8.5 10.5 4" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>
                </button>
                <ul id={`menu-${n.label}`} hidden={open !== n.href} className="absolute left-0 top-full mt-4 w-64 border-[3px] border-black bg-white shadow-[8px_8px_0_#000]">
                  {n.sub.map(([l, h]) => (<li key={h}><Link href={h} onClick={() => setOpen(null)} className="block px-3 py-2 font-semibold hover:bg-gold">{l}</Link></li>))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-gold hidden sm:inline-flex">
            Apply <span aria-hidden="true">↗</span><span className="sr-only"> on the official portal, applications.srmist.edu.in (opens in a new tab)</span>
          </a>
          <button type="button" className="btn btn-line lg:hidden" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobile(!mobile)}>
            {mobile ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="absolute -bottom-[3px] left-0 h-[3px] w-full origin-left bg-gold" />
      <nav id="mobile-menu" aria-label="Mobile" hidden={!mobile} className="border-t-[3px] border-black bg-gold pb-6 lg:hidden">
        <div className="wrap">
          <ul>
            {NAV.map((n) => (
              <li key={n.href} className="py-3">
                <Link href={n.href} className="font-display text-5xl font-extrabold uppercase">{n.label}</Link>
                <ul className="mt-1">{n.sub.map(([l, h]) => (<li key={h}><Link href={h} className="block py-1 font-medium">{l}</Link></li>))}</ul>
              </li>
            ))}
          </ul>
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-3 w-full">Apply on the official portal ↗</a>
          <a href={WWW} target="_blank" rel="noopener noreferrer" className="mt-3 block text-center font-bold underline">Official SRMIST website ↗</a>
        </div>
      </nav>
    </header>
  );
}
