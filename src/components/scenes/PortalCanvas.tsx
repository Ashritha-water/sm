"use client";

import PortalScene from "@/components/three/PortalScene";
import SceneCanvas from "@/components/three/SceneCanvas";

export default function PortalCanvas() {
  return (
    <SceneCanvas className="absolute inset-0" camera={{ position: [0, 0, 7.5], fov: 45 }}>
      <PortalScene />
    </SceneCanvas>
  );
}
