"use client";

import { useSyncExternalStore } from "react";

/** Current year, rendered on the client so the page can stay fully prerendered. */
export default function Year() {
  const year = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <>{year}</>;
}
