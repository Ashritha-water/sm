"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getDotTexture } from "./shared";

export type V3 = [number, number, number];

/** Static connection lines between pairs of points (one draw call). */
export function Links({ pairs, color = "#60a5fa", opacity = 0.3 }: { pairs: [V3, V3][]; color?: string; opacity?: number }) {
  const geo = useMemo(() => {
    const arr = new Float32Array(pairs.length * 6);
    pairs.forEach(([a, b], i) => arr.set([...a, ...b], i * 6));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [pairs]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

/** Glowing dots travelling along the given segments (instanced, one draw call). */
export function Pulses({
  pairs,
  color = "#67e8f9",
  size = 0.12,
  speed = 0.35,
  perLink = 1,
  bidirectional = false,
}: {
  pairs: [V3, V3][];
  color?: string;
  size?: number;
  speed?: number;
  perLink?: number;
  bidirectional?: boolean;
}) {
  const count = pairs.length * perLink;
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ o: (i * 0.6180339) % 1, s: 0.7 + ((i * 7) % 5) * 0.12 })), [count]);
  const vecs = useMemo(() => pairs.map(([a, b]) => [new THREE.Vector3(...a), new THREE.Vector3(...b)] as const), [pairs]);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const sc = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  useFrame((state) => {
    const inst = ref.current;
    if (!inst) return;
    const t = state.clock.elapsedTime;
    // face the camera so dots read as round glows from any angle
    q.copy(state.camera.quaternion);
    if (inst.parent) {
      const pq = new THREE.Quaternion();
      inst.parent.getWorldQuaternion(pq);
      q.premultiply(pq.invert());
    }
    for (let i = 0; i < count; i++) {
      const [a, b] = vecs[i % vecs.length];
      let k = (t * speed * seeds[i].s + seeds[i].o) % 1;
      if (bidirectional && i % 2) k = 1 - k;
      p.lerpVectors(a, b, k);
      const fade = Math.sin(k * Math.PI);
      sc.setScalar(0.4 + fade * 0.8);
      m.compose(p, q, sc);
      inst.setMatrixAt(i, m);
    }
    inst.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={getDotTexture()} color={color} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  );
}

/** Dark lacquered surface lit by the accent colour. */
export function Surface({ accent, glow = 0.35, opacity }: { accent: string; glow?: number; opacity?: number }) {
  return (
    <meshPhysicalMaterial
      color="#0d1430"
      emissive={accent}
      emissiveIntensity={glow}
      metalness={0.3}
      roughness={0.2}
      clearcoat={1}
      clearcoatRoughness={0.15}
      envMapIntensity={1.3}
      transparent={opacity !== undefined}
      opacity={opacity ?? 1}
    />
  );
}
