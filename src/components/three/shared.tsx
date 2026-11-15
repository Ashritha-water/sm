"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useScene } from "./SceneCanvas";

/** Deterministic pseudo-random number in [0, 1) for a given seed. */
export function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

let dotTexture: THREE.Texture | null = null;
/** Soft round sprite used for particles and glows (generated, no download). */
export function getDotTexture() {
  if (dotTexture || typeof document === "undefined") return dotTexture!;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grd.addColorStop(0.6, "rgba(255,255,255,0.18)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  dotTexture = new THREE.CanvasTexture(c);
  dotTexture.colorSpace = THREE.SRGBColorSpace;
  return dotTexture;
}

/** Studio reflections made from light panels, so no HDR file needs downloading. */
export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.25 * intensity} />
      <directionalLight position={[5, 6, 4]} intensity={1.4 * intensity} color="#cfe0ff" />
      <pointLight position={[-6, -2, 3]} intensity={30 * intensity} color="#7c3aed" distance={18} />
      <pointLight position={[6, 1, 2]} intensity={22 * intensity} color="#22d3ee" distance={16} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, -6]} scale={[12, 2, 1]} color="#93c5fd" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#8b5cf6" />
        <Lightformer form="rect" intensity={1.4} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#22d3ee" />
        <Lightformer form="ring" intensity={1.2} position={[0, 0, 6]} scale={3} color="#ffffff" />
      </Environment>
    </>
  );
}

/** Field of drifting particles drawn as one draw call. */
export function ParticleField({
  count = 1500,
  radius = 14,
  size = 0.06,
  color = "#9fb6ff",
  opacity = 0.7,
  speed = 0.012,
}: {
  count?: number;
  radius?: number;
  size?: number;
  color?: string;
  opacity?: number;
  speed?: number;
}) {
  const { tier } = useScene();
  const n = Math.round(count * (tier === "high" ? 1 : tier === "mid" ? 0.6 : 0.3));
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = radius * Math.cbrt(seeded(i * 3 + 1));
      const t = seeded(i * 3 + 2) * Math.PI * 2;
      const f = Math.acos(2 * seeded(i * 3 + 3) - 1);
      p.set([r * Math.sin(f) * Math.cos(t), r * Math.sin(f) * Math.sin(t) * 0.6, r * Math.cos(f)], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, [n, radius]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        map={getDotTexture()}
        size={size}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** Gently moves the camera toward the pointer for depth and parallax. */
export function PointerRig({ strength = 0.6, children }: { strength?: number; children?: ReactNode }) {
  const base = useRef<THREE.Vector3 | null>(null);
  useFrame((state, dt) => {
    const camera = state.camera;
    if (!base.current) base.current = camera.position.clone();
    const k = 1 - Math.exp(-dt * 2.5);
    camera.position.x += (base.current.x + state.pointer.x * strength - camera.position.x) * k;
    camera.position.y += (base.current.y + state.pointer.y * strength * 0.6 - camera.position.y) * k;
    camera.lookAt(0, 0, 0);
  });
  return <>{children}</>;
}

/** A soft additive glow sprite. */
export function Glow({ color = "#3b82f6", scale = 3, opacity = 0.6, position }: { color?: string; scale?: number; opacity?: number; position?: [number, number, number] }) {
  return (
    <sprite scale={scale} position={position}>
      <spriteMaterial map={getDotTexture()} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}
