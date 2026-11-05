import { nirf } from "@/data/site";
import { Scramble } from "./Scramble";

// Departures-style board for the NIRF 2025 results.
export function RankBoard() {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-3">
      {nirf.map(([k, v]) => (
        <div key={k} className="bg-night p-4">
          <dd className="text-3xl font-semibold tracking-tight"><Scramble value={v} /></dd>
          <dt className="mt-1 text-sm text-white/75">{k}</dt>
        </div>
      ))}
    </dl>
  );
}
