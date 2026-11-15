"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { VisualKind } from "@/lib/services";
import { ServiceVisual } from "./ServiceVisuals";
import { Glow, ParticleField, StudioLights } from "./shared";

/** Shows one service visual; it scales in on change and leans toward the pointer. */
export default function ServiceStage({ kind, accent, engaged = false }: { kind: VisualKind; accent: string; engaged?: boolean }) {
  const g = useRef<THREE.Group>(null);
  const grow = useRef(0);
  const last = useRef(kind);
  useFrame((state, dt) => {
    const el = g.current;
    if (!el) return;
    if (last.current !== kind) {
      last.current = kind;
      grow.current = 0;
    }
    grow.current = Math.min(1, grow.current + dt * 1.6);
    const e = 1 - Math.pow(1 - grow.current, 3);
    const target = (engaged ? 1.08 : 1) * (0.6 + 0.4 * e);
    el.scale.setScalar(THREE.MathUtils.lerp(el.scale.x, target, 1 - Math.exp(-dt * 6)));
    const k = 1 - Math.exp(-dt * 3);
    el.rotation.y += (state.pointer.x * 0.45 - el.rotation.y) * k;
    el.rotation.x += (-state.pointer.y * 0.25 - el.rotation.x) * k;
  });
  return (
    <>
      <StudioLights />
      <Glow color={accent} scale={9} opacity={0.12} position={[0, 0, -3]} />
      <group ref={g}>
        <ServiceVisual key={kind} kind={kind} accent={accent} />
      </group>
      <ParticleField count={500} radius={9} size={0.04} opacity={0.4} />
    </>
  );
}
