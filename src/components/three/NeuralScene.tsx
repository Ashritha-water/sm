"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useScene } from "./SceneCanvas";
import { getDotTexture, Glow, StudioLights } from "./shared";

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** A neural "brain": two hemispheres of nodes, nearest-neighbour synapses, firing pulses and incoming data streams. */
export default function NeuralScene() {
  const { tier } = useScene();
  const count = tier === "high" ? 320 : tier === "mid" ? 220 : 140;

  const { nodes, edges, colors } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    let s = 1;
    while (pts.length < count) {
      const x = (rand(s++) * 2 - 1) * 1.9;
      const y = (rand(s++) * 2 - 1) * 1.35;
      const z = (rand(s++) * 2 - 1) * 1.55;
      const hx = Math.abs(x) - 0.95; // two lobes either side of a central fissure
      const inside = (hx * hx) / 0.95 + (y * y) / 1.5 + (z * z) / 2.3 < 1 && Math.abs(x) > 0.08;
      const shell = (hx * hx) / 0.95 + (y * y) / 1.5 + (z * z) / 2.3 > 0.45; // favour the surface
      if (inside && (shell || rand(s++) > 0.7)) pts.push(new THREE.Vector3(x, y * (1 - Math.max(0, -y) * 0.15), z));
    }
    const e: [number, number][] = [];
    pts.forEach((a, i) => {
      const near = pts
        .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
        .filter((o) => o.j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, 3);
      near.forEach((o) => i < o.j && o.d < 0.45 && e.push([i, o.j]));
    });
    const blue = new THREE.Color("#3b82f6");
    const violet = new THREE.Color("#a78bfa");
    const cyan = new THREE.Color("#67e8f9");
    const c = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      const col = blue.clone().lerp(violet, (p.x + 1.9) / 3.8).lerp(cyan, rand(i + 99) > 0.88 ? 0.8 : 0);
      c.set([col.r, col.g, col.b], i * 3);
    });
    return { nodes: pts, edges: e, colors: c };
  }, [count]);

  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(nodes);
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [nodes, colors]);
  const lineGeo = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => arr.set([...nodes[a].toArray(), ...nodes[b].toArray()], i * 6));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [nodes, edges]);

  // firing pulses along synapses
  const PULSES = tier === "low" ? 40 : 90;
  const firing = useMemo(() => Array.from({ length: PULSES }, (_, i) => ({ e: Math.floor(rand(i + 7) * edges.length), o: rand(i + 3), s: 0.5 + rand(i + 5) })), [PULSES, edges.length]);
  const pulseGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(PULSES * 3), 3));
    return g;
  }, [PULSES]);

  // data streams flowing in from both sides
  const streams = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        return new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(side * 6.5, (rand(i + 20) - 0.5) * 4, (rand(i + 30) - 0.5) * 3),
          new THREE.Vector3(side * 3.2, (rand(i + 40) - 0.5) * 2.5, (rand(i + 50) - 0.5) * 2),
          nodes[Math.floor(rand(i + 60) * nodes.length)].clone(),
        );
      }),
    [nodes],
  );
  const STREAM_DOTS = 14;
  const streamGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(streams.length * STREAM_DOTS * 3), 3));
    return g;
  }, [streams]);
  const streamLines = useMemo(() => {
    const pts: number[] = [];
    streams.forEach((c) => {
      const s = c.getPoints(40);
      for (let i = 0; i < s.length - 1; i++) pts.push(...s[i].toArray(), ...s[i + 1].toArray());
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, [streams]);

  const group = useRef<THREE.Group>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const pa = pulseGeo.getAttribute("position") as THREE.BufferAttribute;
    firing.forEach((f, i) => {
      let k = (t * 0.55 * f.s + f.o) % 1;
      if (k < 0.02) f.e = Math.floor(rand(t * 10 + i) * edges.length); // hop to a new synapse
      const [a, b] = edges[f.e];
      v.lerpVectors(nodes[a], nodes[b], (k = k * k * (3 - 2 * k)));
      (pa.array as Float32Array).set([v.x, v.y, v.z], i * 3);
    });
    pa.needsUpdate = true;
    const sa = streamGeo.getAttribute("position") as THREE.BufferAttribute;
    streams.forEach((c, si) => {
      for (let j = 0; j < STREAM_DOTS; j++) {
        c.getPoint(((t * 0.18 + j / STREAM_DOTS + si * 0.13) % 1), v);
        (sa.array as Float32Array).set([v.x, v.y, v.z], (si * STREAM_DOTS + j) * 3);
      }
    });
    sa.needsUpdate = true;
    const g = group.current;
    if (g) {
      g.rotation.y += dt * 0.08;
      const k = 1 - Math.exp(-dt * 2);
      g.rotation.x += (state.pointer.y * 0.2 - g.rotation.x) * k;
      g.rotation.z += (-state.pointer.x * 0.08 - g.rotation.z) * k;
    }
  });

  const dot = getDotTexture();
  return (
    <>
      <StudioLights intensity={0.6} />
      <Glow color="#7c3aed" scale={7} opacity={0.22} />
      <Glow color="#2563eb" scale={4.5} opacity={0.25} />
      <group ref={group}>
        <points geometry={pointGeo}>
          <pointsMaterial map={dot} size={0.13} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial color="#6d8cff" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
        </lineSegments>
        <points geometry={pulseGeo}>
          <pointsMaterial map={dot} size={0.2} color="#e0f2fe" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      </group>
      <lineSegments geometry={streamLines}>
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points geometry={streamGeo}>
        <pointsMaterial map={dot} size={0.12} color="#67e8f9" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}
