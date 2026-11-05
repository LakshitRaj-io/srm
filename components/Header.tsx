"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PORTAL, WWW } from "@/data/site";

const NAV = [
  { href: "/admissions", label: "Admissions", sub: [["How to apply", "/admissions#steps"], ["Apply by programme", "/admissions#routes"], ["Fees and scholarships", "/admissions#funding"], ["International applicants", "/admissions#international"]] },
  { href: "/academics", label: "Academics", sub: [["Programme finder", "/academics#finder"], ["Study areas", "/academics#areas"], ["Programme page example", "/academics#detail"]] },
  { href: "/research", label: "Research", sub: [["Find your pathway", "/research#pathways"], ["Research record", "/research#record"], ["Centres and facilities", "/research#centres"], ["Contact the Directorate", "/research#contact"]] },
] as const;

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const path = usePathname();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => { setOpen(null); setMobile(false); }, [path]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", click);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("mousedown", click); };
  }, []);

  return (
    <header ref={ref} className="sticky top-0 z-40 bg-white shadow-[0_1px_0_#d5dcea]">
      <div className="wrap flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="SRM Institute of Science and Technology, redesign concept home">
          <Image src="/images/srm-crest.png" alt="" width={56} height={56} priority className="h-14 w-14" />
          <span className="hidden font-display font-semibold leading-tight text-blue sm:block">SRM Institute of<br />Science and Technology</span>
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-4">
            {NAV.map((n) => (
              <li key={n.href} className="relative flex items-center">
                <Link href={n.href} aria-current={path === n.href ? "page" : undefined} className={`rounded-md px-2 py-2 font-medium hover:text-blue ${path === n.href ? "text-blue" : ""}`}>{n.label}</Link>
                <button type="button" aria-expanded={open === n.href} aria-controls={`menu-${n.label}`} aria-label={`${n.label} sections`} onClick={() => setOpen(open === n.href ? null : n.href)} className="grid h-9 w-7 place-items-center rounded-md hover:bg-mist">
                  <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open === n.href ? "rotate-180" : ""}`}><path d="M2 4.5 6 8.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                </button>
                <ul id={`menu-${n.label}`} hidden={open !== n.href} className="absolute left-0 top-full mt-3 w-64 rounded-2xl bg-white p-2 shadow-[0_16px_40px_rgb(15_31_75/0.16)]">
                  {n.sub.map(([l, h]) => (<li key={h}><Link href={h} onClick={() => setOpen(null)} className="block rounded-lg px-3 py-2 hover:bg-mist">{l}</Link></li>))}
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
      <nav id="mobile-menu" aria-label="Mobile" hidden={!mobile} className="bg-white pb-6 lg:hidden">
        <div className="wrap">
          <ul>
            {NAV.map((n) => (
              <li key={n.href} className="py-3">
                <Link href={n.href} className="font-display text-2xl font-semibold">{n.label}</Link>
                <ul className="mt-1">{n.sub.map(([l, h]) => (<li key={h}><Link href={h} className="block py-1.5 text-ink-soft">{l}</Link></li>))}</ul>
              </li>
            ))}
          </ul>
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-3 w-full">Apply on the official portal ↗</a>
          <a href={WWW} target="_blank" rel="noopener noreferrer" className="link mt-3 block text-center">Official SRMIST website ↗</a>
        </div>
      </nav>
    </header>
  );
}
