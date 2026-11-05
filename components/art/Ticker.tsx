import Image from "next/image";

// Decorative band: everything it repeats also appears as readable text on the page.
export function Ticker({ items, tone = "gold", reverse = false, speed = 38 }: { items: string[]; tone?: "gold" | "blue" | "black" | "white"; reverse?: boolean; speed?: number }) {
  const bg = { gold: "bg-gold text-black", blue: "bg-blue text-white", black: "bg-black text-white", white: "bg-white text-black" }[tone];
  return (
    <div aria-hidden="true" className={`ticker-wrap overflow-hidden border-y-[3px] border-black ${bg}`}>
      <div className={`ticker ${reverse ? "ticker-rev" : ""}`} style={{ "--t": `${speed}s` } as React.CSSProperties}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {[...items, ...items].map((t, i) => (
              <span key={i} className="flex items-center gap-6 whitespace-nowrap pl-6 font-display text-4xl font-extrabold uppercase leading-[1.25] md:text-6xl md:leading-[1.25]">
                {t}
                <Image src="/images/srm-crest.png" alt="" width={48} height={48} className="h-9 w-9 md:h-12 md:w-12" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
