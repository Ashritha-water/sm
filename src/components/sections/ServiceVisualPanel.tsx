"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { VisualKind } from "@/lib/services";

const ServiceCanvas = dynamic(() => import("@/components/scenes/ServiceCanvas"), { ssr: false });

export default function ServiceVisualPanel({ kind, accent }: { kind: VisualKind; accent: string }) {
  const [engaged, setEngaged] = useState(false);
  return (
    <div
      className="relative h-[340px] overflow-hidden rounded-[28px] border border-line sm:h-[440px] lg:h-[560px]"
      style={{ background: `radial-gradient(ellipse at center, ${accent}22, rgba(22,24,29,0.2) 70%)` }}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
    >
      <ServiceCanvas kind={kind} accent={accent} engaged={engaged} />
    </div>
  );
}
