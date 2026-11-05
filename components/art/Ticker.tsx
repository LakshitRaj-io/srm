// Decorative band: everything it repeats also appears as readable text on the page.
export function Ticker({ items, tone = "gold", reverse = false, tilt = 0, speed = 38 }: { items: string[]; tone?: "gold" | "blue" | "black" | "white"; reverse?: boolean; tilt?: number; speed?: number }) {
  const bg = { gold: "bg-gold text-black", blue: "bg-blue text-white", black: "bg-black text-white", white: "bg-white text-black" }[tone];
  return (
    <div aria-hidden="true" style={{ rotate: `${tilt}deg` }} className={`ticker-wrap relative z-10 ${tilt ? "-mx-[3%]" : ""} overflow-hidden border-y-[3px] border-black ${bg}`}>
      <div className={`ticker ${reverse ? "ticker-rev" : ""}`} style={{ "--t": `${speed}s` } as React.CSSProperties}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {[...items, ...items].map((t, i) => (
              <span key={i} className="whitespace-nowrap px-6 py-1.5 font-display text-4xl font-black uppercase md:text-6xl">{t} <span className="pl-10">✦</span></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
