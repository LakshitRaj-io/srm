"use client";
import { useEffect, useState, type MouseEvent } from "react";

type Theme = "dark" | "light";
const KEY = "srm-theme";

// Switching wipes the new theme across the page from the button that was pressed.
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
    <button type="button" onClick={toggle} aria-pressed={theme === "dark"} aria-label="Dark mode" className="btn btn-line min-h-11 px-3">
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
