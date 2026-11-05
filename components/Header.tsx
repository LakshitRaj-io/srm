"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PORTAL, WWW } from "@/data/site";

const NAV = [
  { href: "/admissions", label: "Admissions", sub: [["Apply by programme", "/admissions#routes"], ["How to apply", "/admissions#steps"], ["Fees and scholarships", "/admissions#funding"], ["International applicants", "/admissions#international"]] },
  { href: "/academics", label: "Academics", sub: [["Programme finder", "/academics#finder"], ["Study areas", "/academics#areas"], ["Programme page pattern", "/academics#detail"]] },
  { href: "/research", label: "Research", sub: [["Find your pathway", "/research#pathways"], ["Centres and facilities", "/research#centres"], ["Research record", "/research#record"], ["Contact the Directorate", "/research#contact"]] },
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
    <header ref={ref} className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink" aria-label="SRMIST redesign concept home">
          SRM<span className="text-blue">IST</span>
        </Link>
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href} className="relative flex items-center">
                <Link href={n.href} aria-current={path === n.href ? "page" : undefined} className={`px-2 py-2 font-semibold ${path === n.href ? "text-blue underline decoration-gold decoration-[3px] underline-offset-8" : "text-ink hover:text-blue"}`}>{n.label}</Link>
                <button type="button" aria-expanded={open === n.href} aria-controls={`menu-${n.label}`} aria-label={`${n.label} sections`} onClick={() => setOpen(open === n.href ? null : n.href)} className="grid h-9 w-8 place-items-center text-ink hover:text-blue">
                  <span aria-hidden="true" className={`transition-transform ${open === n.href ? "rotate-180" : ""}`}>▾</span>
                </button>
                <ul id={`menu-${n.label}`} hidden={open !== n.href} className="absolute left-0 top-full mt-3 w-64 border-2 border-ink bg-paper p-2 shadow-[6px_6px_0_var(--color-ink)]">
                  {n.sub.map(([l, h]) => (<li key={h}><Link href={h} onClick={() => setOpen(null)} className="block px-3 py-2 hover:bg-gold">{l}</Link></li>))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="hidden bg-gold px-4 py-2 font-bold text-ink hover:bg-ink hover:text-gold sm:block">
            Apply <span aria-hidden="true">↗</span><span className="sr-only"> on the official portal, applications.srmist.edu.in (opens in a new tab)</span>
          </a>
          <button type="button" className="border-2 border-ink px-3 py-1.5 font-semibold lg:hidden" aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobile(!mobile)}>
            {mobile ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <nav id="mobile-menu" aria-label="Mobile" hidden={!mobile} className="border-t-2 border-ink bg-paper px-4 pb-6 lg:hidden">
        <ul>
          {NAV.map((n) => (
            <li key={n.href} className="border-b border-ink/20 py-3">
              <Link href={n.href} className="font-display text-2xl font-bold">{n.label}</Link>
              <ul className="mt-1">{n.sub.map(([l, h]) => (<li key={h}><Link href={h} className="block py-2 text-ink-soft">{l}</Link></li>))}</ul>
            </li>
          ))}
        </ul>
        <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="mt-4 block bg-gold px-4 py-3 text-center font-bold">Apply on the official portal ↗</a>
        <a href={WWW} target="_blank" rel="noopener noreferrer" className="mt-2 block py-2 text-center underline">Official SRMIST website ↗</a>
      </nav>
    </header>
  );
}
