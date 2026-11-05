import Image from "next/image";
import type { ReactNode } from "react";

// Shared inner-page opening: title on the left, photo with the rising stepped edge on the right.
export function PageHero({ title, lede, image, alt, children }: { title: string; lede: string; image: string; alt: string; children?: ReactNode }) {
  return (
    <section className="wrap grid items-end gap-8 pt-12 md:grid-cols-12 md:gap-10 md:pt-16">
      <div className="pb-2 md:col-span-6 md:pb-14">
        <h1 className="t-page">{title}</h1>
        <p className="lede mt-5 text-ink-soft">{lede}</p>
        {children}
      </div>
      <div className="stepped relative aspect-[16/10] md:col-span-6 md:aspect-[5/4]">
        <Image src={image} alt={alt} fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}
