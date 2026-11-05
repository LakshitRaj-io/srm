"use client";
import { useEffect } from "react";

const QUIET = 140; // ms without wheel events that marks the start of a new gesture
const SPEED = 750;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// True when something inside the page, such as the programme list, can still scroll this way.
function innerScroll(from: EventTarget | null, dy: number) {
  for (let el = from instanceof Element ? from : null; el && el !== document.body; el = el.parentElement) {
    const o = getComputedStyle(el).overflowY;
    if ((o === "auto" || o === "scroll") && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 1) return true;
    }
  }
  return false;
}

// After the SRM hero, one wheel gesture or key press moves one section. The hero keeps its native
// scroll, and a section taller than the screen scrolls normally until its end. Touch uses CSS
// scroll snap instead. Reduced motion and low-end devices keep ordinary scrolling, still and whole.
export function SectionPager() {
  useEffect(() => {
    const root = document.documentElement;
    const pages = [...document.querySelectorAll<HTMLElement>(".page")];
    if (!pages.length || root.dataset.lite === "1" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.dataset.pager = "1";

    // Sections animate in as they reach the middle of the screen, and reset once fully away.
    const enter = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { rootMargin: "-30% 0px -30% 0px" });
    const leave = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) e.target.classList.remove("in"); }));
    pages.forEach((p) => { enter.observe(p); leave.observe(p); });

    const footer = document.querySelector<HTMLElement>("body footer");
    const hero = document.querySelector<HTMLElement>("main .fx-tall");
    let frame = 0;
    let moving = false;
    let lastWheel = 0;
    let lastSize = 0;
    let lastEnd = 0;

    const measure = () => {
      const hdr = document.querySelector("header")?.offsetHeight ?? 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = root.scrollHeight - vh;
      const stops = [...pages, ...(footer ? [footer] : [])].map((el) => {
        const r = el.getBoundingClientRect();
        return { top: Math.min(max, Math.round(r.top + y - hdr)), bottom: Math.round(r.bottom + y) };
      });
      const heroEnd = hero ? Math.round(hero.getBoundingClientRect().bottom + y - vh) : -1;
      return { y, vh, stops, heroEnd };
    };

    const stop = () => { cancelAnimationFrame(frame); moving = false; };
    const glide = (to: number) => {
      const from = window.scrollY;
      const t0 = performance.now();
      moving = true;
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / SPEED);
        window.scrollTo({ top: from + (to - from) * ease(k), behavior: "instant" });
        if (k < 1) frame = requestAnimationFrame(tick);
        else { moving = false; lastEnd = performance.now(); }
      };
      frame = requestAnimationFrame(tick);
    };

    // Where one step from here lands, or null to leave the scroll to the browser.
    const target = (dir: 1 | -1) => {
      const { y, vh, stops, heroEnd } = measure();
      if (y < heroEnd - 2 || (dir < 0 && y <= heroEnd + 2)) return null;
      let i = -1;
      stops.forEach((s, k) => { if (s.top <= y + 4) i = k; });
      if (dir > 0) {
        if (i >= 0 && stops[i].bottom > y + vh + 4 && i < stops.length - 1 && stops[i].bottom - stops[i].top > vh) return null;
        return stops[i + 1]?.top ?? null;
      }
      if (i >= 0 && y > stops[i].top + 4) return stops[i].bottom - stops[i].top > vh ? null : stops[i].top;
      if (i <= 0) return heroEnd >= 0 ? heroEnd : null;
      // Going back into a section taller than the screen lands on its end.
      const prev = stops[i - 1];
      return prev.bottom - prev.top > vh ? prev.bottom - vh : prev.top;
    };

    const wheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || !e.deltaY) return;
      const now = performance.now();
      const size = Math.abs(e.deltaY);
      const fresh = now - lastWheel > QUIET || (size >= 60 && size >= lastSize && now - lastEnd > 250);
      lastWheel = now;
      lastSize = size;
      if (moving) { e.preventDefault(); return; }
      if (e.target instanceof Element && e.target.closest(".guide-panel, header")) return;
      if (innerScroll(e.target, e.deltaY)) return;

      // Stop exactly at the end of the hero, so its last frame is never skipped.
      const { y, heroEnd } = measure();
      if (e.deltaY > 0 && y < heroEnd - 2 && y + e.deltaY > heroEnd) {
        e.preventDefault();
        window.scrollTo({ top: heroEnd, behavior: "instant" });
        return;
      }
      const to = target(e.deltaY > 0 ? 1 : -1);
      if (to === null) return;
      e.preventDefault();
      if (fresh) glide(to);
    };

    const key = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable], .guide-panel, [role=dialog]")) return;
      if (e.key === " " && t?.closest("a, button, summary")) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      if (moving) { e.preventDefault(); return; }
      const to = target(down ? 1 : -1);
      if (to === null) return;
      e.preventDefault();
      glide(to);
    };

    addEventListener("wheel", wheel, { passive: false });
    addEventListener("keydown", key);
    addEventListener("pointerdown", stop);
    return () => {
      stop();
      enter.disconnect();
      leave.disconnect();
      removeEventListener("wheel", wheel);
      removeEventListener("keydown", key);
      removeEventListener("pointerdown", stop);
      delete root.dataset.pager;
    };
  }, []);
  return null;
}
