"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { processSteps, STATION_GAP } from "@/lib/process";
import { scrollStore } from "@/lib/scrollStore";
import { Surface } from "./links";
import { getDotTexture, Glow, ParticleField, StudioLights } from "./shared";

const COLORS = ["#22d3ee", "#3b82f6", "#6366f1", "#8b5cf6", "#60a5fa", "#2dd4bf"];

function StationObject({ i, accent }: { i: number; accent: string }) {
  switch (i) {
    case 0: // discover: scanning sphere
      return (
        <group>
          <mesh><icosahedronGeometry args={[0.75, 2]} /><meshBasicMaterial color={accent} wireframe transparent opacity={0.35} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.05, 0.02, 8, 96]} /><Surface accent={accent} glow={1} /></mesh>
          <mesh><sphereGeometry args={[0.25, 32, 32]} /><meshBasicMaterial color="#e0f2fe" /></mesh>
        </group>
      );
    case 1: // architect: blueprint lattice
      return (
        <group>
          {[1.3, 0.85, 0.4].map((s) => (
            <lineSegments key={s}>
              <edgesGeometry args={[new THREE.BoxGeometry(s, s, s)]} />
              <lineBasicMaterial color={accent} transparent opacity={0.85} />
            </lineSegments>
          ))}
        </group>
      );
    case 2: // engineer: stacked modules
      return (
        <group>
          {[-0.45, 0, 0.45].map((y, k) => (
            <mesh key={y} position={[0, y, 0]} rotation={[0, k * 0.4, 0]}>
              <boxGeometry args={[1, 0.32, 1]} />
              <Surface accent={accent} glow={0.4 + k * 0.15} />
            </mesh>
          ))}
        </group>
      );
    case 3: // integrate: interlocking rings
      return (
        <group>
          <mesh rotation={[0, 0, 0]} position={[-0.32, 0, 0]}><torusGeometry args={[0.55, 0.08, 16, 64]} /><Surface accent={accent} glow={0.7} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.32, 0, 0]}><torusGeometry args={[0.55, 0.08, 16, 64]} /><Surface accent="#22d3ee" glow={0.7} /></mesh>
        </group>
      );
    case 4: // launch: rising vector
      return (
        <group>
          <mesh position={[0, 0.2, 0]}><coneGeometry args={[0.45, 1.2, 6]} /><Surface accent={accent} glow={0.6} /></mesh>
          <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.6, 0.02, 8, 64]} /><meshBasicMaterial color={accent} /></mesh>
        </group>
      );
    default: // evolve: continuous loop
      return <mesh><torusKnotGeometry args={[0.55, 0.14, 160, 16, 2, 3]} /><Surface accent={accent} glow={0.6} /></mesh>;
  }
}

export default function ProcessScene() {
  const { size } = useThree();
  const n = processSteps.length;
  const points = useMemo(() => processSteps.map((_, i) => new THREE.Vector3(i * STATION_GAP, Math.sin(i * 1.3) * 0.35, Math.cos(i * 0.9) * 0.4)), []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3([points[0].clone().add(new THREE.Vector3(-4, 0, 0)), ...points, points[n - 1].clone().add(new THREE.Vector3(4, 0, 0))]), [points, n]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 400, 0.018, 8, false), [curve]);
  const flowGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(60 * 3), 3));
    return g;
  }, []);
  const stations = useRef<(THREE.Group | null)[]>([]);
  const vec = useRef(new THREE.Vector3());
  const offset = size.width >= 1024 ? 3.4 : 0;

  useFrame((state, dt) => {
    const camera = state.camera;
    const v = vec.current;
    const p = scrollStore.process;
    const camX = p * (n - 1) * STATION_GAP;
    const k = 1 - Math.exp(-dt * 4);
    camera.position.x += (camX - offset + state.pointer.x * 0.4 - camera.position.x) * k;
    camera.position.y += (0.2 + state.pointer.y * 0.3 - camera.position.y) * k;
    camera.lookAt(camera.position.x, -1.15, 0);
    stations.current.forEach((g, i) => {
      if (!g) return;
      const d = Math.abs(i * STATION_GAP - camX) / STATION_GAP;
      const on = Math.max(0, 1 - d);
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, 0.7 + on * 0.55, k));
      g.rotation.y += dt * (0.2 + on * 0.6);
      g.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.2;
    });
    const fa = flowGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < 60; i++) {
      curve.getPointAt((state.clock.elapsedTime * 0.02 + i / 60) % 1, v);
      (fa.array as Float32Array).set([v.x, v.y, v.z], i * 3);
    }
    fa.needsUpdate = true;
  });

  return (
    <>
      <StudioLights intensity={0.8} />
      <mesh geometry={tube}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.55} />
      </mesh>
      <points geometry={flowGeo}>
        <pointsMaterial map={getDotTexture()} size={0.16} color="#67e8f9" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {points.map((p, i) => (
        <group key={i} position={p}>
          <group ref={(g) => { stations.current[i] = g; }}>
            <StationObject i={i} accent={COLORS[i]} />
          </group>
          <Glow color={COLORS[i]} scale={3} opacity={0.3} />
          <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 0.93, 64]} />
            <meshBasicMaterial color={COLORS[i]} transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      <group position={[(n - 1) * STATION_GAP * 0.5, 0, 0]}>
        <ParticleField count={900} radius={16} size={0.04} opacity={0.35} speed={0.004} />
      </group>
    </>
  );
}
