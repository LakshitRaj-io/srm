import Link from "next/link";
import { PORTAL, WWW } from "@/data/site";
import { ExtLink } from "./ExtLink";
import { Seal } from "./art/Seal";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t-[3px] border-black bg-gold text-black">
      <div className="wrap grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-6"><Seal size="9rem" /></div>
        <nav aria-label="Site pages" className="md:col-span-3">
          <h2 className="text-3xl">Explore</h2>
          <ul className="mt-2 space-y-1 font-semibold">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/admissions" className="hover:underline">Admissions</Link></li>
            <li><Link href="/academics" className="hover:underline">Academics</Link></li>
            <li><Link href="/research" className="hover:underline">Research</Link></li>
          </ul>
        </nav>
        <div className="md:col-span-3">
          <h2 className="text-3xl">Official</h2>
          <ul className="mt-2 space-y-1 font-semibold">
            <li><ExtLink href={WWW} showHost={false} className="hover:underline">Website</ExtLink></li>
            <li><ExtLink href={PORTAL} showHost={false} className="hover:underline">Application portal</ExtLink></li>
            <li><ExtLink href={`${WWW}/contact-us/`} showHost={false} className="hover:underline">Contact us</ExtLink></li>
            <li><a href="tel:+914427417000" className="hover:underline">+91-44-27417000</a></li>
          </ul>
        </div>
      </div>
      <p aria-hidden="true" className="whitespace-nowrap px-2 pb-2 text-center font-display text-[12.8vw] font-black uppercase leading-[0.8]">Learn Leap Lead</p>
    </footer>
  );
}
