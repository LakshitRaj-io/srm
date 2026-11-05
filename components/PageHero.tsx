import type { ReactNode } from "react";
import { Parallax } from "./art/Parallax";

// Inner-page opening: a poster-scale title that slams up, over a photo strip.
export function PageHero({ title, lede, image, alt, tone = "bg-gold text-black", children }: { title: string[]; lede: string; image: string; alt: string; tone?: string; children?: ReactNode }) {
  return (
    <section className={tone}>
      <div className="wrap pb-8 pt-8 md:pt-10">
        <h1 className="t-page" aria-label={title.join(" ")}>
          {title.map((l, i) => (
            <span key={l} aria-hidden="true" className="block overflow-hidden"><span className="slam block" style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>{l}</span></span>
          ))}
        </h1>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <p className="lede">{lede}</p>
          {children}
        </div>
      </div>
      <Parallax src={image} alt={alt} priority className="h-[44svh] border-y-[3px] border-black md:h-[62svh]" />
    </section>
  );
}
