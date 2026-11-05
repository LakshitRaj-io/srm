"use client";
import { useEffect, useState } from "react";

const KEY = "srm-campaign-30-dismissed";

// The live site shows this campaign as a full-screen image on every visit. Here it is an
// in-flow strip: real text, never blocks the page, and stays dismissed.
export function CampaignNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { setShow(localStorage.getItem(KEY) !== "1"); } catch { setShow(true); }
  }, []);
  if (!show) return null;
  const close = () => {
    setShow(false);
    try { localStorage.setItem(KEY, "1"); } catch {}
  };
  return (
    <aside aria-label="Campaign" className="bg-gold text-ink">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-2 text-sm md:px-8">
        <p>
          <strong>Alumni campaign:</strong> 30 days, 30 scholars, 30 global platforms.{" "}
          <a className="font-semibold underline" href="https://alumni.srmist.edu.in/funds/view/2988.dz" target="_blank" rel="noopener noreferrer">
            Contribute<span className="sr-only"> on alumni.srmist.edu.in (opens in a new tab)</span> ↗
          </a>
        </p>
        <button type="button" onClick={close} aria-label="Dismiss campaign notice" className="grid h-11 w-11 shrink-0 place-items-center text-lg font-bold hover:bg-ink hover:text-gold">×</button>
      </div>
    </aside>
  );
}
