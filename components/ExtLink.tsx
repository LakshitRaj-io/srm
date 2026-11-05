import type { ReactNode } from "react";

const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");

// Every link that leaves this concept names its destination, so nobody mistakes it for a page here.
export function ExtLink({ href, children, className = "", showHost = true }: { href: string; children: ReactNode; className?: string; showHost?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {showHost ? (
        <span className="ml-1.5 text-[0.78em] font-normal">↗ {host(href)}</span>
      ) : (
        <span aria-hidden="true"> ↗</span>
      )}
      <span className="sr-only"> (opens {host(href)} in a new tab)</span>
    </a>
  );
}
