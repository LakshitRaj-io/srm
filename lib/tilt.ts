"use client";
import type { PointerEvent } from "react";
import { useCalm } from "./calm";

// Leans an element toward a mouse pointer through --rx, --ry, --gx and --gy. Touch and calm devices stay still.
export function useTilt(max = 12) {
  const calm = useCalm();
  return {
    onPointerMove(e: PointerEvent<HTMLElement>) {
      if (calm || e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
      el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    },
    onPointerLeave(e: PointerEvent<HTMLElement>) {
      const el = e.currentTarget;
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    },
  };
}
