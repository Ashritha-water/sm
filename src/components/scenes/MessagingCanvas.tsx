"use client";

import MessagingScene from "@/components/three/MessagingScene";
import SceneCanvas from "@/components/three/SceneCanvas";

export default function MessagingCanvas() {
  return (
    <SceneCanvas className="absolute inset-0" camera={{ position: [0, 0.6, 8.5], fov: 42 }}>
      <MessagingScene />
    </SceneCanvas>
  );
}
