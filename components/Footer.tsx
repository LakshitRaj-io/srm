import Image from "next/image";
import Link from "next/link";
import { CHECKED, PORTAL, WWW } from "@/data/site";
import { ExtLink } from "./ExtLink";

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12 md:py-16">
        <div className="md:col-span-6">
          <div className="flex items-center gap-4">
            <Image src="/images/srm-crest.png" alt="" width={64} height={64} className="h-16 w-16" />
            <p className="font-display text-3xl font-semibold tracking-tight">Learn. Leap. Lead.</p>
          </div>
          <p className="mt-5 max-w-lg text-[0.95rem] text-white/80">
            Independent redesign concept based on SRMIST&apos;s public website. It is not the official website or application portal, and it accepts no applications, payments or enquiries. Facts were checked against official pages on {CHECKED}. Always confirm on the official source.
          </p>
        </div>
        <nav aria-label="Concept pages" className="md:col-span-3">
          <h2 className="font-sans text-base font-semibold tracking-normal">This concept</h2>
          <ul className="mt-3 space-y-1.5 text-white/85">
            <li><Link href="/" className="hover:text-gold">Home</Link></li>
            <li><Link href="/admissions" className="hover:text-gold">Admissions</Link></li>
            <li><Link href="/academics" className="hover:text-gold">Academics</Link></li>
            <li><Link href="/research" className="hover:text-gold">Research</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-3">
          <h2 className="font-sans text-base font-semibold tracking-normal">Official SRMIST</h2>
          <ul className="mt-3 space-y-1.5 text-white/85">
            <li><ExtLink href={WWW} showHost={false} className="hover:text-gold">Official website</ExtLink></li>
            <li><ExtLink href={PORTAL} showHost={false} className="hover:text-gold">Application portal</ExtLink></li>
            <li><ExtLink href={`${WWW}/contact-us/`} showHost={false} className="hover:text-gold">Contact us</ExtLink></li>
            <li><a href="tel:+914427417000" className="hover:text-gold">+91-44-27417000</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
