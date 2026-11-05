"use client";
import { useState } from "react";
import { INTL_PORTAL, applyRoutes } from "@/data/site";
import { ExtLink } from "../ExtLink";

const WHO = [["india", "I'm applying from India"], ["abroad", "I'm applying from abroad"]] as const;

// Two choices lead to the right official application page. Nothing is submitted here.
export function RouteFinder() {
  const [who, setWho] = useState<string | null>(null);
  const [group, setGroup] = useState<number | null>(null);
  const choice = (on: boolean) => `btn w-full justify-start text-left ${on ? "bg-black text-white" : "bg-white text-black"}`;
  return (
    <div className="grid gap-0 border-[3px] border-black md:grid-cols-3">
      <div className="border-b-[3px] border-black p-5 md:border-b-0 md:border-r-[3px]">
        <h3 className="t-card">1. Where from?</h3>
        <div className="mt-4 space-y-2">
          {WHO.map(([k, l]) => (<button key={k} type="button" aria-pressed={who === k} onClick={() => { setWho(k); setGroup(null); }} className={choice(who === k)}>{l}</button>))}
        </div>
      </div>
      <div className="border-b-[3px] border-black p-5 md:border-b-0 md:border-r-[3px]">
        <h3 className="t-card">2. What to study?</h3>
        {who === "india" ? (
          <div className="mt-4 space-y-2">
            {applyRoutes.map((g, i) => (<button key={g.group} type="button" aria-pressed={group === i} onClick={() => setGroup(i)} className={choice(group === i)}>{g.group}</button>))}
          </div>
        ) : <p className="mt-4">{who === "abroad" ? "International applicants use one portal for all programmes." : "Choose where you're applying from first."}</p>}
      </div>
      <div aria-live="polite" className="bg-gold p-5">
        <h3 className="t-card">3. Apply here</h3>
        {who === "abroad" ? (
          <ExtLink href={INTL_PORTAL} className="btn btn-line mt-4 w-full">International portal</ExtLink>
        ) : group !== null ? (
          <ul className="mt-3">{applyRoutes[group].items.map(([l, h]) => (<li key={h}><ExtLink href={h} className="block py-1.5 font-bold underline">{l}</ExtLink></li>))}</ul>
        ) : <p className="mt-4">Your official application page will appear here.</p>}
      </div>
    </div>
  );
}
