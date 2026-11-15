"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { VisualKind } from "@/lib/services";
import { Links, Pulses, Surface, type V3 } from "./links";
import { Glow } from "./shared";

type P = { accent: string };

/** A: layered browser windows built from interface components. */
function Web({ accent }: P) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.children.forEach((c, i) => (c.position.y = [0.5, 0, -0.5][i] + Math.sin(s.clock.elapsedTime * 0.8 + i) * 0.06));
  });
  const windows: V3[] = [[-0.6, 0.5, -0.6], [0.1, 0, 0], [0.8, -0.5, 0.6]];
  return (
    <group rotation={[0.1, -0.5, 0]}>
      <group ref={g}>
        {windows.map((p, i) => (
          <group key={i} position={p}>
            <RoundedBox args={[2.2, 1.4, 0.06]} radius={0.06}><Surface accent={accent} glow={0.18} /></RoundedBox>
            <mesh position={[0, 0.58, 0.035]}><planeGeometry args={[2.1, 0.14]} /><meshBasicMaterial color={accent} transparent opacity={0.8} /></mesh>
            {[-0.85, -0.72, -0.59].map((x) => (
              <mesh key={x} position={[x, 0.58, 0.04]}><circleGeometry args={[0.035, 16]} /><meshBasicMaterial color="#0b1124" /></mesh>
            ))}
            <mesh position={[-0.55, 0.05, 0.04]}><planeGeometry args={[0.85, 0.7]} /><meshBasicMaterial color={accent} transparent opacity={0.22} /></mesh>
            {[0.25, 0.08, -0.09, -0.26].map((y, j) => (
              <mesh key={y} position={[0.45, y, 0.04]}><planeGeometry args={[j === 0 ? 0.9 : 0.75 - j * 0.1, 0.06]} /><meshBasicMaterial color="#cbd5e1" transparent opacity={0.35} /></mesh>
            ))}
          </group>
        ))}
      </group>
      <Links pairs={[[[-0.6, 0.5, -0.57], [0.1, 0, 0.03]], [[0.1, 0, 0.03], [0.8, -0.5, 0.63]]]} color={accent} opacity={0.5} />
      <Pulses pairs={[[[-0.6, 0.5, -0.57], [0.1, 0, 0.03]], [[0.1, 0, 0.03], [0.8, -0.5, 0.63]]]} color="#93c5fd" />
    </group>
  );
}

/** B: application architecture, modules wired to a core service. */
function Application({ accent }: P) {
  const mods = useMemo<V3[]>(() => Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return [Math.cos(a) * 1.9, Math.sin(a * 2) * 0.35, Math.sin(a) * 1.9];
  }), []);
  const pairs = useMemo(() => mods.map((m) => [[0, 0, 0], m] as [V3, V3]).concat(mods.map((m, i) => [m, mods[(i + 1) % 6]] as [V3, V3])), [mods]);
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => g.current && (g.current.rotation.y += dt * 0.25));
  return (
    <group ref={g} rotation={[0.35, 0, 0]}>
      <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.12}><Surface accent={accent} glow={0.6} /></RoundedBox>
      <Glow color={accent} scale={2.6} opacity={0.4} />
      {mods.map((p, i) => (
        <RoundedBox key={i} position={p} args={[0.5, 0.36, 0.5]} radius={0.07}><Surface accent={i % 2 ? "#22d3ee" : accent} glow={0.3} /></RoundedBox>
      ))}
      <Links pairs={pairs} color={accent} opacity={0.35} />
      <Pulses pairs={pairs.slice(0, 6)} bidirectional perLink={2} />
    </group>
  );
}

function Phone({ x, z, r, screen, accent }: { x: number; z: number; r: number; screen: number; accent: string }) {
return (
  <group position={[x, 0, z]} rotation={[0, r, 0]}>
    <RoundedBox args={[1.25, 2.55, 0.1]} radius={0.16} smoothness={6}><Surface accent={accent} glow={0.12} /></RoundedBox>
    <mesh position={[0, 0, 0.055]}><planeGeometry args={[1.1, 2.35]} /><meshBasicMaterial color="#070b17" /></mesh>
    <mesh position={[0, 0.72, 0.06]}><planeGeometry args={[0.95, 0.62]} /><meshBasicMaterial color={screen ? "#8b5cf6" : accent} transparent opacity={0.55} /></mesh>
    {[0.22, 0.02, -0.18, -0.38, -0.58].map((y, i) => (
      <group key={y} position={[0, y, 0.06]}>
        <mesh position={[-0.36, 0, 0]}><circleGeometry args={[0.07, 20]} /><meshBasicMaterial color={accent} transparent opacity={0.7} /></mesh>
        <mesh position={[0.1, 0, 0]}><planeGeometry args={[0.62 - (i % 3) * 0.1, 0.06]} /><meshBasicMaterial color="#cbd5e1" transparent opacity={0.35} /></mesh>
      </group>
    ))}
    <mesh position={[0, -0.95, 0.06]}><planeGeometry args={[0.95, 0.2]} /><meshBasicMaterial color={accent} transparent opacity={0.85} /></mesh>
  </group>
);
}

/** C: mobile devices showing app interfaces. */
function Mobile({ accent }: P) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    g.current.rotation.y = -0.35 + Math.sin(s.clock.elapsedTime * 0.4) * 0.25;
    g.current.position.y = Math.sin(s.clock.elapsedTime * 0.9) * 0.08;
  });
  return (
    <group ref={g}>
      <Phone x={-0.75} z={-0.6} r={0.25} screen={1} accent={accent} />
      <Phone x={0.55} z={0.3} r={-0.15} screen={0} accent={accent} />
      <Glow color={accent} scale={4} opacity={0.25} position={[0, 0, -1]} />
    </group>
  );
}

const AI_NODES: V3[][] = [3, 5, 5, 3].map((n, li) =>
  Array.from({ length: n }, (_, i) => [(li - 1.5) * 1.25, (i - (n - 1) / 2) * 0.62, Math.sin(i + li) * 0.3] as V3),
);
const AI_PAIRS: [V3, V3][] = AI_NODES.slice(0, -1).flatMap((layer, l) => layer.flatMap((a) => AI_NODES[l + 1].map((b) => [a, b] as [V3, V3])));

/** D: neural network with layers of connected nodes. */
function AI({ accent }: P) {
  const nodes = AI_NODES;
  const pairs = AI_PAIRS;
  const g = useRef<THREE.Group>(null);
  useFrame((s) => g.current && (g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.5));
  return (
    <group ref={g}>
      {nodes.flat().map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.13, 24, 24]} /><Surface accent={i % 3 ? accent : "#22d3ee"} glow={0.9} /></mesh>
      ))}
      <Links pairs={pairs} color={accent} opacity={0.22} />
      <Pulses pairs={pairs} size={0.09} speed={0.45} color="#c4b5fd" />
    </group>
  );
}

const RAG_DOCS: V3[] = [[-2, 0.8, 0], [-2.1, 0, 0.3], [-2, -0.8, 0]];
const RAG_EMBEDS: V3[] = Array.from({ length: 22 }, (_, i) => [-0.3 + Math.sin(i * 2.3) * 0.55, Math.cos(i * 1.7) * 0.9, Math.sin(i * 3.1) * 0.5]);
const RAG_CORE: V3 = [1.8, 0, 0];
const RAG_PAIRS: [V3, V3][] = [
  ...RAG_DOCS.flatMap((d, i) => RAG_EMBEDS.filter((_, j) => j % 3 === i).map((e) => [d, e] as [V3, V3])),
  ...RAG_EMBEDS.filter((_, j) => j % 4 === 0).map((e) => [e, RAG_CORE] as [V3, V3]),
];

/** E: knowledge engine, documents to embeddings to an AI core. */
function Rag({ accent }: P) {
  const docs = RAG_DOCS;
  const embeds = RAG_EMBEDS;
  const core = RAG_CORE;
  const pairs = RAG_PAIRS;
  const coreRef = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => coreRef.current && (coreRef.current.rotation.y += dt * 0.6));
  return (
    <group rotation={[0.1, -0.25, 0]}>
      {docs.map((p, i) => (
        <group key={i} position={p} rotation={[0, 0.4, 0]}>
          <RoundedBox args={[0.7, 0.9, 0.03]} radius={0.04}><Surface accent={accent} glow={0.2} /></RoundedBox>
          {[0.28, 0.16, 0.04, -0.08, -0.2].map((y) => (
            <mesh key={y} position={[0, y, 0.02]}><planeGeometry args={[0.5, 0.04]} /><meshBasicMaterial color="#cbd5e1" transparent opacity={0.4} /></mesh>
          ))}
        </group>
      ))}
      {embeds.map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color={i % 4 === 0 ? "#67e8f9" : accent} /></mesh>
      ))}
      <mesh ref={coreRef} position={core}><icosahedronGeometry args={[0.55, 0]} /><Surface accent="#8b5cf6" glow={0.8} /></mesh>
      <Glow color="#8b5cf6" scale={2.6} opacity={0.5} position={core} />
      <Links pairs={pairs} color={accent} opacity={0.2} />
      <Pulses pairs={pairs} size={0.08} speed={0.4} color="#ddd6fe" />
    </group>
  );
}

/** F: product prototype whose components assemble and evolve. */
function Product({ accent }: P) {
  const parts = useMemo(() => [
    { p: [0, 0, 0] as V3, s: [1.6, 0.12, 1.1] as V3, d: [0, -0.8, 0] as V3 },
    { p: [-0.45, 0.34, 0] as V3, s: [0.6, 0.5, 0.9] as V3, d: [-1.1, 0.2, 0.3] as V3 },
    { p: [0.42, 0.3, -0.2] as V3, s: [0.6, 0.4, 0.5] as V3, d: [1.1, 0.5, -0.5] as V3 },
    { p: [0.42, 0.3, 0.32] as V3, s: [0.6, 0.4, 0.4] as V3, d: [1, -0.2, 0.9] as V3 },
    { p: [0, 0.78, 0] as V3, s: [1.4, 0.08, 1] as V3, d: [0, 1.2, 0] as V3 },
  ], []);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const g = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    const k = (Math.sin(s.clock.elapsedTime * 0.7) + 1) / 2;
    const e = k * k * (3 - 2 * k);
    parts.forEach((pt, i) => {
      const m = refs.current[i];
      if (m) m.position.set(pt.p[0] + pt.d[0] * e, pt.p[1] + pt.d[1] * e, pt.p[2] + pt.d[2] * e);
    });
    if (g.current) g.current.rotation.y += dt * 0.3;
  });
  return (
    <group ref={g} rotation={[0.45, 0, 0]} scale={1.25}>
      {parts.map((pt, i) => (
        <RoundedBox key={i} ref={(m) => { refs.current[i] = m; }} args={pt.s} radius={0.05}>
          <Surface accent={i % 2 ? accent : "#8b5cf6"} glow={0.35} />
        </RoundedBox>
      ))}
      <mesh><boxGeometry args={[2.2, 2.2, 2.2]} /><meshBasicMaterial color={accent} wireframe transparent opacity={0.06} /></mesh>
    </group>
  );
}

/** G: messaging ecosystem with chat interfaces and automation flows. */
function WhatsApp({ accent }: P) {
  const bubbles = [
    { p: [-0.9, 1.0, 0] as V3, w: 1.6, me: false },
    { p: [0.8, 0.35, 0.2] as V3, w: 1.3, me: true },
    { p: [-0.7, -0.3, 0.1] as V3, w: 1.9, me: false },
    { p: [0.9, -0.95, 0] as V3, w: 1.1, me: true },
  ];
  const g = useRef<THREE.Group>(null);
  useFrame((s) => g.current?.children.forEach((c, i) => {
    if (i < bubbles.length) c.position.y = bubbles[i].p[1] + Math.sin(s.clock.elapsedTime + i * 1.3) * 0.05;
  }));
  const flow: V3[] = [[2.2, 1.2, -0.8], [2.4, 0, -0.8], [2.2, -1.2, -0.8]];
  const pairs: [V3, V3][] = [[flow[0], flow[1]], [flow[1], flow[2]], [[1.45, 0.35, 0.2], flow[1]]];
  return (
    <group rotation={[0, -0.25, 0]} position={[-0.3, 0, 0]}>
      <group ref={g}>
        {bubbles.map((b, i) => (
          <group key={i} position={b.p}>
            <RoundedBox args={[b.w, 0.5, 0.08]} radius={0.2} smoothness={5}>
              <Surface accent={b.me ? accent : "#3b82f6"} glow={b.me ? 0.55 : 0.25} />
            </RoundedBox>
            <mesh position={[0, 0.06, 0.05]}><planeGeometry args={[b.w * 0.7, 0.05]} /><meshBasicMaterial color="#e2e8f0" transparent opacity={0.55} /></mesh>
            <mesh position={[-b.w * 0.1, -0.08, 0.05]}><planeGeometry args={[b.w * 0.5, 0.05]} /><meshBasicMaterial color="#e2e8f0" transparent opacity={0.35} /></mesh>
          </group>
        ))}
      </group>
      {flow.map((p, i) => (
        <mesh key={i} position={p}><octahedronGeometry args={[0.18, 0]} /><Surface accent={accent} glow={0.9} /></mesh>
      ))}
      <Links pairs={pairs} color={accent} opacity={0.45} />
      <Pulses pairs={pairs} color="#99f6e4" perLink={2} />
    </group>
  );
}

/** H: automation pipeline, work items moving through stations. */
function Automation({ accent }: P) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.4, -0.6, 0), new THREE.Vector3(-1.2, 0.5, 0.4), new THREE.Vector3(0, -0.2, -0.3),
    new THREE.Vector3(1.2, 0.6, 0.3), new THREE.Vector3(2.4, -0.3, 0),
  ]), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 160, 0.025, 8, false), [curve]);
  const items = useRef<THREE.InstancedMesh>(null);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const one = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  useFrame((s) => {
    if (!items.current) return;
    for (let i = 0; i < 9; i++) {
      const k = (s.clock.elapsedTime * 0.08 + i / 9) % 1;
      curve.getPointAt(k, v);
      q.setFromEuler(new THREE.Euler(k * 6, k * 4, 0));
      m.compose(v, q, one);
      items.current.setMatrixAt(i, m);
    }
    items.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group rotation={[0.25, -0.2, 0]}>
      <mesh geometry={tube}><meshBasicMaterial color={accent} transparent opacity={0.6} /></mesh>
      {[0.12, 0.38, 0.62, 0.88].map((k) => {
        const p = curve.getPointAt(k);
        return (
          <group key={k} position={p}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.03, 12, 48]} /><Surface accent="#8b5cf6" glow={0.8} /></mesh>
            <Glow color={accent} scale={1.2} opacity={0.4} />
          </group>
        );
      })}
      <instancedMesh ref={items} args={[undefined, undefined, 9]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <Surface accent={accent} glow={0.7} />
      </instancedMesh>
    </group>
  );
}

/** I: integration hub, systems plugged into a central API layer. */
function Integration({ accent }: P) {
  const ends = useMemo<V3[]>(() => Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + 0.3;
    return [Math.cos(a) * 2.1, Math.sin(a) * 1.3, Math.sin(a * 3) * 0.4];
  }), []);
  const pairs = useMemo(() => ends.map((e) => [[0, 0, 0], e] as [V3, V3]), [ends]);
  const hub = useRef<THREE.Group>(null);
  useFrame((_, dt) => hub.current && (hub.current.rotation.z += dt * 0.3));
  return (
    <group rotation={[0.2, -0.3, 0]}>
      <group ref={hub}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.55, 0.55, 0.3, 6]} /><Surface accent={accent} glow={0.6} /></mesh>
        <mesh><torusGeometry args={[0.85, 0.02, 8, 64]} /><meshBasicMaterial color={accent} transparent opacity={0.7} /></mesh>
      </group>
      <Glow color={accent} scale={2.4} opacity={0.4} />
      {ends.map((p, i) => (
        <RoundedBox key={i} position={p} args={[0.42, 0.28, 0.12]} radius={0.05}><Surface accent={i % 2 ? "#22d3ee" : accent} glow={0.35} /></RoundedBox>
      ))}
      <Links pairs={pairs} color={accent} opacity={0.4} />
      <Pulses pairs={pairs} perLink={2} bidirectional speed={0.5} />
    </group>
  );
}

/** J: enterprise architecture, layered platforms (data, services, apps) connected vertically. */
function Enterprise({ accent }: P) {
  const layers = [-0.9, 0, 0.9];
  const nodes = useMemo<V3[]>(() => layers.flatMap((y, li) => Array.from({ length: 4 }, (_, i) => [((i % 2) - 0.5) * 1.3, y + 0.1, (Math.floor(i / 2) - 0.5) * 0.9 + li * 0.01] as V3)), []); // eslint-disable-line react-hooks/exhaustive-deps
  const pairs = useMemo(() => {
    const out: [V3, V3][] = [];
    for (let i = 0; i < 8; i++) out.push([nodes[i], nodes[i + 4]]);
    return out;
  }, [nodes]);
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => g.current && (g.current.rotation.y += dt * 0.22));
  return (
    <group ref={g} rotation={[0.42, 0, 0]}>
      {layers.map((y, i) => (
        <RoundedBox key={y} position={[0, y, 0]} args={[2.6, 0.08, 1.9]} radius={0.04}>
          <Surface accent={["#22d3ee", accent, "#8b5cf6"][i]} glow={0.25} opacity={0.85} />
        </RoundedBox>
      ))}
      {nodes.map((p, i) => (
        <RoundedBox key={i} position={p} args={[0.42, 0.14, 0.32]} radius={0.04}><Surface accent={accent} glow={0.7} /></RoundedBox>
      ))}
      <Links pairs={pairs} color="#93c5fd" opacity={0.5} />
      <Pulses pairs={pairs} bidirectional perLink={2} speed={0.4} />
    </group>
  );
}

const MAP: Record<VisualKind, (p: P) => React.JSX.Element> = {
  web: Web,
  application: Application,
  mobile: Mobile,
  ai: AI,
  rag: Rag,
  product: Product,
  whatsapp: WhatsApp,
  automation: Automation,
  integration: Integration,
  enterprise: Enterprise,
};

export function ServiceVisual({ kind, accent }: { kind: VisualKind; accent: string }) {
  const C = MAP[kind];
  return <C accent={accent} />;
}
