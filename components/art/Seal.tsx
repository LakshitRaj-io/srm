import Image from "next/image";

// The crest inside a slowly turning ring of the university motto.
export function Seal({ size = "10rem" }: { size?: string }) {
  return (
    <div aria-hidden="true" className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="spin absolute inset-0 h-full w-full">
        <defs><path id="seal-ring" d="M100 100m-84 0a84 84 0 1 1 168 0a84 84 0 1 1-168 0" /></defs>
        <circle cx="100" cy="100" r="98" fill="#fff" stroke="#000" strokeWidth="4" />
        <text fill="#000" style={{ fontFamily: "var(--font-shoulders)", fontWeight: 900, fontSize: 25, letterSpacing: 3.5 }}>
          <textPath href="#seal-ring">LEARN • LEAP • LEAD • SINCE 1985 • LEARN • LEAP •</textPath>
        </text>
      </svg>
      <Image src="/images/srm-crest.png" alt="" width={120} height={120} className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
