"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

export type Tier = "low" | "mid" | "high";

/** Rough device capability tier used to scale particle counts and pixel ratio. */
export function useDeviceTier(): Tier {
  const small = useMediaQuery("(max-width: 767px)");
  const tablet = useMediaQuery("(max-width: 1100px)");
  const coarse = useMediaQuery("(pointer: coarse)");
  if (small) return "low";
  if (typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4) return "low";
  if (tablet || coarse) return "mid";
  return "high";
}
