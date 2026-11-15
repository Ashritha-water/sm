"use client";

import ArchitectureScene from "@/components/three/ArchitectureScene";
import SceneCanvas from "@/components/three/SceneCanvas";

export default function ArchitectureCanvas() {
  return (
    <SceneCanvas className="absolute inset-0" camera={{ position: [7.6, 5.6, 7.6], fov: 36 }}>
      <ArchitectureScene />
    </SceneCanvas>
  );
}
