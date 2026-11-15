"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Links, Pulses, Surface, type V3 } from "./links";
import { Glow, ParticleField, StudioLights } from "./shared";

const TEAL = "#2dd4bf";

/** Messaging network: a hub, connected business systems, and chat interfaces floating around it. */
export default function MessagingScene() {
  const ring = useMemo<V3[]>(() =>
    Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      const r = i % 2 ? 2.6 : 3.2;
      return [Math.cos(a) * r, Math.sin(a * 2) * 0.5, Math.sin(a) * r];
    }), []);
  const pairs = useMemo(() => [
    ...ring.map((p) => [[0, 0, 0], p] as [V3, V3]),
    ...ring.map((p, i) => [p, ring[(i + 2) % ring.length]] as [V3, V3]),
  ], [ring]);

  const chats = useMemo(() => [
    { p: [-2.6, 1.5, 1.2] as V3, w: 1.5, me: false, r: 0.25 },
    { p: [2.4, 1.2, 1.4] as V3, w: 1.2, me: true, r: -0.3 },
    { p: [-2.2, -1.4, 1.6] as V3, w: 1.1, me: true, r: 0.3 },
    { p: [2.7, -1.2, 0.8] as V3, w: 1.7, me: false, r: -0.2 },
    { p: [0.2, 2.1, -1.2] as V3, w: 1.3, me: false, r: 0 },
  ], []);

  const net = useRef<THREE.Group>(null);
  const chatRefs = useRef<(THREE.Group | null)[]>([]);
  const hub = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (net.current) {
      net.current.rotation.y += dt * 0.1;
      const k = 1 - Math.exp(-dt * 2);
      net.current.rotation.x += (state.pointer.y * 0.15 + 0.25 - net.current.rotation.x) * k;
    }
    chatRefs.current.forEach((c, i) => {
      if (!c) return;
      c.position.y = chats[i].p[1] + Math.sin(t * 0.8 + i * 1.7) * 0.12;
      c.rotation.y = chats[i].r + state.pointer.x * 0.2;
    });
    if (hub.current) hub.current.scale.setScalar(1 + Math.sin(t * 2) * 0.04);
  });

  return (
    <>
      <StudioLights intensity={0.8} />
      <group ref={net}>
        <mesh ref={hub}>
          <sphereGeometry args={[0.55, 48, 48]} />
          <Surface accent={TEAL} glow={0.9} />
        </mesh>
        <Glow color={TEAL} scale={3.4} opacity={0.45} />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.012, 8, 96]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.6} />
        </mesh>
        {ring.map((p, i) => (
          <group key={i} position={p}>
            <mesh>
              <icosahedronGeometry args={[i % 2 ? 0.13 : 0.18, 0]} />
              <Surface accent={i % 3 ? "#3b82f6" : TEAL} glow={0.8} />
            </mesh>
            <Glow color={i % 3 ? "#3b82f6" : TEAL} scale={0.8} opacity={0.4} />
          </group>
        ))}
        <Links pairs={pairs} color={TEAL} opacity={0.18} />
        <Pulses pairs={pairs.slice(0, 10)} color="#99f6e4" perLink={2} bidirectional speed={0.38} />
      </group>
      {chats.map((c, i) => (
        <group key={i} ref={(g) => { chatRefs.current[i] = g; }} position={c.p}>
          <RoundedBox args={[c.w, 0.55, 0.07]} radius={0.22} smoothness={5}>
            <meshPhysicalMaterial
              color={c.me ? "#0f3b3a" : "#111a33"}
              emissive={c.me ? TEAL : "#3b82f6"}
              emissiveIntensity={0.25}
              roughness={0.15}
              clearcoat={1}
              transparent
              opacity={0.85}
            />
          </RoundedBox>
          <mesh position={[-c.w * 0.05, 0.07, 0.045]}>
            <planeGeometry args={[c.w * 0.65, 0.05]} />
            <meshBasicMaterial color="#e2e8f0" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-c.w * 0.15, -0.07, 0.045]}>
            <planeGeometry args={[c.w * 0.45, 0.05]} />
            <meshBasicMaterial color="#e2e8f0" transparent opacity={0.35} />
          </mesh>
          {c.me && (
            <mesh position={[c.w * 0.36, -0.1, 0.045]}>
              <planeGeometry args={[0.12, 0.04]} />
              <meshBasicMaterial color={TEAL} />
            </mesh>
          )}
        </group>
      ))}
      <ParticleField count={700} radius={10} size={0.04} color="#99f6e4" opacity={0.35} />
    </>
  );
}
