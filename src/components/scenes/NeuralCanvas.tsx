"use client";

import NeuralScene from "@/components/three/NeuralScene";
import SceneCanvas from "@/components/three/SceneCanvas";

export default function NeuralCanvas() {
  return (
    <SceneCanvas className="absolute inset-0" camera={{ position: [0, 0.2, 5.6], fov: 40 }}>
      <NeuralScene />
    </SceneCanvas>
  );
}
