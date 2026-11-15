"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollStore } from "@/lib/scrollStore";
import { getDotTexture, StudioLights } from "./shared";
import { useScene } from "./SceneCanvas";

const N = 9;
const GAP = 0.62;

/** A city of instanced towers that rises with scroll: scalable architecture, built block by block. */
export default function ArchitectureScene() {
  const { reduced } = useScene();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const tops = useRef<THREE.Points>(null);

  const cells = useMemo(() => {
    const out: { x: number; z: number; h: number; d: number; c: THREE.Color }[] = [];
    const blue = new THREE.Color("#1d4ed8");
    const violet = new THREE.Color("#7c3aed");
    const cyan = new THREE.Color("#22d3ee");
    const night = new THREE.Color("#0b1124");
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const x = (i - (N - 1) / 2) * GAP;
        const z = (j - (N - 1) / 2) * GAP;
        const d = Math.hypot(x, z);
        const wave = Math.sin(i * 1.7) * Math.cos(j * 1.3);
        const h = Math.max(0.15, 2.6 - d * 0.55 + wave * 0.6);
        const c = blue.clone().lerp(violet, Math.min(1, h / 3)).lerp(cyan, h > 2.3 ? 0.35 : 0).lerp(night, 0.74);
        out.push({ x, z, h, d, c });
      }
    return out;
  }, []);

  // pairs of tall neighbouring towers whose roofs are linked
  const links = useMemo(() => {
    const tall = cells.map((c, i) => ({ ...c, i })).filter((c) => c.h > 1.3);
    const pairs: [number, number][] = [];
    tall.forEach((a) =>
      tall.forEach((b) => {
        if (a.i < b.i && Math.hypot(a.x - b.x, a.z - b.z) < GAP * 1.5) pairs.push([a.i, b.i]);
      }),
    );
    return { tall: tall.map((t) => t.i), pairs };
  }, [cells]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(links.pairs.length * 6), 3));
    return g;
  }, [links]);
  const topGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(links.tall.length * 3), 3));
    return g;
  }, [links]);

  const m = useMemo(() => new THREE.Matrix4(), []);
  const heights = useMemo(() => new Float32Array(cells.length), [cells]);
  const colored = useRef(false);

  useFrame((state, dt) => {
    const inst = mesh.current;
    if (!inst) return;
    if (!colored.current) {
      cells.forEach((c, i) => inst.setColorAt(i, c.c));
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
      colored.current = true;
    }
    const p = reduced ? 1 : scrollStore.about;
    const t = state.clock.elapsedTime;
    cells.forEach((c, i) => {
      const k = THREE.MathUtils.clamp(p * 1.9 - c.d * 0.28, 0, 1);
      const e = 1 - Math.pow(1 - k, 3);
      const h = Math.max(0.02, c.h * e * (1 + Math.sin(t * 0.8 + c.d * 2) * 0.03));
      heights[i] = h;
      m.makeScale(1, h, 1).setPosition(c.x, h / 2, c.z);
      inst.setMatrixAt(i, m);
    });
    inst.instanceMatrix.needsUpdate = true;

    const la = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    links.pairs.forEach(([a, b], i) => {
      (la.array as Float32Array).set([cells[a].x, heights[a] + 0.02, cells[a].z, cells[b].x, heights[b] + 0.02, cells[b].z], i * 6);
    });
    la.needsUpdate = true;
    const ta = topGeo.getAttribute("position") as THREE.BufferAttribute;
    links.tall.forEach((ci, i) => (ta.array as Float32Array).set([cells[ci].x, heights[ci] + 0.05, cells[ci].z], i * 3));
    ta.needsUpdate = true;

    if (group.current) {
      group.current.rotation.y += dt * 0.06;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.08, 0.05);
    }
  });

  return (
    <>
      <StudioLights intensity={0.9} />
      <group ref={group} position={[0, -1.5, 0]}>
        <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
          <boxGeometry args={[0.44, 1, 0.44]} />
          <meshPhysicalMaterial color="#ffffff" metalness={0.7} roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} emissive="#1e3a8a" emissiveIntensity={0.08} envMapIntensity={1.1} />
        </instancedMesh>
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial color="#67e8f9" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
        <points ref={tops} geometry={topGeo}>
          <pointsMaterial map={getDotTexture()} size={0.22} color="#a5f3fc" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[N * GAP + 1, N * GAP + 1, N + 1, N + 1]} />
          <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.08} />
        </mesh>
      </group>
    </>
  );
}
