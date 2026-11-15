"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import HeroScene from "@/components/three/HeroScene";

export default function HeroCanvas() {
  return (
    <SceneCanvas eager className="absolute inset-0" camera={{ position: [0, 0, 11.5], fov: 42 }}>
      <HeroScene />
    </SceneCanvas>
  );
}
