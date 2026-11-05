"use client";
import { useEffect, useState, type MouseEvent } from "react";

type Theme = "dark" | "light";
const KEY = "srm-theme";

// Switching wipes the new theme across the page from the button that was pressed. The icon is one
// drawing that CSS turns from sun to moon off data-theme, so it is right before React has loaded.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => { setTheme((document.documentElement.dataset.theme as Theme) ?? "light"); }, []);

  const toggle = (e: MouseEvent) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
      try { localStorage.setItem(KEY, next); } catch {}
    };
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || still) return apply();
    const { clientX: x, clientY: y } = e;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 650, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" });
    });
  };

  return (
    <button type="button" onClick={toggle} aria-pressed={theme === "dark"} aria-label="Dark mode" className="theme-btn btn btn-line h-11 min-h-11 w-11 rounded-full p-0">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-icon h-6 w-6">
        <mask id="theme-bite">
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-shadow" cx="30" cy="8" r="7.5" fill="#000" />
        </mask>
        <g mask="url(#theme-bite)"><circle className="theme-core" cx="12" cy="12" r="5" fill="currentColor" /></g>
        <g className="theme-rays" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
