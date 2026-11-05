import Link from "next/link";
import { CHECKED, PORTAL, WWW } from "@/data/site";
import { ExtLink } from "./ExtLink";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-5xl font-extrabold tracking-tight md:text-7xl">Learn. Leap. <span className="text-gold">Lead.</span></p>
          <p className="mt-6 max-w-xl text-sm text-paper/80">
            Independent redesign concept based on SRMIST&apos;s public website. It is not the official website or application portal, and it accepts no applications, payments or enquiries. Facts were checked against official pages on {CHECKED}; always confirm on the official source.
          </p>
        </div>
        <nav aria-label="Concept pages">
          <h2 className="font-bold text-gold">This concept</h2>
          <ul className="mt-3 space-y-2">
            <li><Link href="/" className="hover:text-gold">Home</Link></li>
            <li><Link href="/admissions" className="hover:text-gold">Admissions</Link></li>
            <li><Link href="/academics" className="hover:text-gold">Academics</Link></li>
            <li><Link href="/research" className="hover:text-gold">Research</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="font-bold text-gold">Official SRMIST</h2>
          <ul className="mt-3 space-y-2">
            <li><ExtLink href={WWW} showHost={false}>Official website</ExtLink></li>
            <li><ExtLink href={PORTAL} showHost={false}>Application portal</ExtLink></li>
            <li><ExtLink href={`${WWW}/contact-us/`} showHost={false}>Contact us</ExtLink></li>
          </ul>
          <p className="mt-4 text-sm text-paper/80">Call +91-44-27417000</p>
        </div>
      </div>
    </footer>
  );
}
