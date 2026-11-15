"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import ServiceStage from "@/components/three/ServiceStage";
import type { VisualKind } from "@/lib/services";

export default function ServiceCanvas({
  kind,
  accent,
  engaged,
  className = "absolute inset-0",
}: {
  kind: VisualKind;
  accent: string;
  engaged?: boolean;
  className?: string;
}) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 0.4, 7.2], fov: 38 }}>
      <ServiceStage kind={kind} accent={accent} engaged={engaged} />
    </SceneCanvas>
  );
}
