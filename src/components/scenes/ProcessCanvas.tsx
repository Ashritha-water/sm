"use client";

import ProcessScene from "@/components/three/ProcessScene";
import SceneCanvas from "@/components/three/SceneCanvas";

export default function ProcessCanvas({ className = "absolute inset-0" }: { className?: string }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 1.1, 8.6], fov: 40 }}>
      <ProcessScene />
    </SceneCanvas>
  );
}
