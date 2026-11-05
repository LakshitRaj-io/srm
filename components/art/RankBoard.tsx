import { nirf } from "@/data/site";
import { Scramble } from "./Scramble";

// Departures-style board for the NIRF 2025 results.
export function RankBoard() {
  return (
    <dl className="grid border-[3px] border-white sm:grid-cols-2">
      {nirf.map(([k, v], i) => (
        <div key={k} className={`flex items-center justify-between gap-4 border-b-[3px] border-white px-4 py-2 sm:odd:border-r-[3px] ${i < 2 ? "bg-gold text-black" : ""}`}>
          <dt className="font-display text-2xl font-extrabold uppercase leading-none md:text-3xl">{k}</dt>
          <dd className="font-display text-5xl font-black leading-none md:text-6xl"><Scramble value={v} /></dd>
        </div>
      ))}
    </dl>
  );
}
