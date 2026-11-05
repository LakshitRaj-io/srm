"use client";
import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

// The layout script sets data-lite on devices with little memory or few cores, or with data saver on.
const lite = () => document.documentElement.dataset.lite === "1";
const noop = () => () => {};

export const isLite = () => typeof document !== "undefined" && lite();

// True when motion should stay still: the visitor asked for that, or the device needs it.
export function useCalm() {
  const reduced = useReducedMotion();
  const low = useSyncExternalStore(noop, lite, () => false);
  return Boolean(reduced) || low;
}
