"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { heroLabelEls, heroNodes, heroTextRect, type HeroKind } from "@/lib/heroNodes";
import { scrollStore } from "@/lib/scrollStore";
import { useScene } from "./SceneCanvas";
import { Glow, ParticleField, StudioLights, getDotTexture } from "./shared";

type Kind = HeroKind;
const ORBITERS = heroNodes;

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4);

function Core({ intro }: { intro: React.RefObject<number> }) {
  const { tier } = useScene();
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const p = scrollStore.hero;
    const s = easeOut(intro.current) * (1 + p * 0.5);
    g.scale.setScalar(Math.max(s, 0.001));
    g.rotation.y += dt * 0.12;
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    if (inner.current) inner.current.rotation.y -= dt * 0.35;
    if (ringA.current) ringA.current.rotation.z += dt * 0.18;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.12;
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.45, 0]} />
        {tier === "high" ? (
          <meshPhysicalMaterial
            transmission={1}
            thickness={1.4}
            roughness={0.06}
            ior={1.45}
            color="#c7d2fe"
            attenuationColor="#3b82f6"
            attenuationDistance={2.5}
            clearcoat={1}
            envMapIntensity={1.4}
            flatShading
          />
        ) : (
          <meshPhysicalMaterial color="#1e2a5a" metalness={0.4} roughness={0.15} clearcoat={1} transparent opacity={0.55} flatShading />
        )}
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial color="#e0f2fe" />
      </mesh>
      <Glow color="#3b82f6" scale={4.2} opacity={0.55} />
      <Glow color="#8b5cf6" scale={2.4} opacity={0.5} />
      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.15, 0.006, 8, 160]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.45} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, 0.4, 0]}>
        <torusGeometry args={[2.5, 0.004, 8, 160]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function OrbiterShape({ kind, color, hovered }: { kind: Kind; color: string; hovered: boolean }) {
  const mat = (
    <meshPhysicalMaterial
      color="#0f172a"
      emissive={color}
      emissiveIntensity={hovered ? 1.1 : 0.4}
      metalness={0.35}
      roughness={0.18}
      clearcoat={1}
      envMapIntensity={1.2}
    />
  );
  switch (kind) {
    case "ai":
      return <mesh>{mat}<octahedronGeometry args={[0.36, 0]} /></mesh>;
    case "web":
      return (
        <group>
          <RoundedBox args={[0.82, 0.56, 0.06]} radius={0.04}>{mat}</RoundedBox>
          <mesh position={[0, 0.2, 0.035]}>
            <planeGeometry args={[0.74, 0.06]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </mesh>
        </group>
      );
    case "mobile":
      return (
        <group>
          <RoundedBox args={[0.36, 0.7, 0.05]} radius={0.05}>{mat}</RoundedBox>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.28, 0.56]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} />
          </mesh>
        </group>
      );
    case "rag":
      return <mesh>{mat}<torusKnotGeometry args={[0.22, 0.07, 96, 12]} /></mesh>;
    case "enterprise":
      return (
        <group>
          {[-0.2, 0, 0.2].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              {mat}
              <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
            </mesh>
          ))}
        </group>
      );
    case "whatsapp":
      return (
        <group>
          <mesh>{mat}<sphereGeometry args={[0.3, 32, 32]} /></mesh>
          <mesh position={[-0.2, -0.24, 0]} rotation={[0, 0, Math.PI / 4]}>
            {mat}
            <coneGeometry args={[0.09, 0.18, 16]} />
          </mesh>
        </group>
      );
    default:
      return <mesh>{mat}<dodecahedronGeometry args={[0.34, 0]} /></mesh>;
  }
}

function Orbiter({
  data,
  index,
  positions,
  intro,
}: {
  data: (typeof ORBITERS)[number];
  index: number;
  positions: React.RefObject<THREE.Vector3[]>;
  intro: React.RefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const proj = useRef(new THREE.Vector3());
  const axis = useMemo(() => new THREE.Euler(data.tilt, 0, data.tilt * 0.4), [data.tilt]);
  const vec = useRef(new THREE.Vector3());
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const { size, camera } = state;
    const v = vec.current;
    const t = state.clock.elapsedTime;
    const k = easeOut((intro.current - 0.15 - index * 0.06) / 0.85);
    const spread = 1 + (1 - k) * 2.2 + scrollStore.hero * 1.6;
    const a = data.phase + t * data.speed;
    v.set(Math.cos(a) * data.r * spread, data.y + Math.sin(t * 0.6 + index) * 0.12, Math.sin(a) * data.r * spread).applyEuler(axis);
    g.position.copy(v);
    positions.current[index].copy(v);
    g.rotation.y += dt * 0.5;
    g.rotation.x += dt * 0.2;
    const target = (hovered ? 1.35 : 1) * Math.max(k, 0.001);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 1 - Math.exp(-dt * 8)));
    const el = heroLabelEls[index];
    if (el) {
      const pr = proj.current;
      g.getWorldPosition(pr);
      pr.y += 0.62;
      pr.project(camera);
      const x = (pr.x * 0.5 + 0.5) * size.width;
      const y = (-pr.y * 0.5 + 0.5) * size.height;
      // hide labels that would sit on the copy (with a margin), and labels on the far side of the orbit
      const r = heroTextRect;
      const gap = 28;
      const dx = Math.max(r.x0 - gap - x, 0, x - r.x1 - gap);
      const dy = Math.max(r.y0 - gap - y, 0, y - r.y1 - gap);
      const clear = THREE.MathUtils.smoothstep(Math.max(dx, dy), 0, 40);
      const front = THREE.MathUtils.smoothstep(v.z, -0.8, 0.6);
      const o = size.width >= 1100 ? k * clear * front * Math.max(0, 1 - scrollStore.hero * 1.8) * (pr.z < 1 ? 1 : 0) : 0;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.style.opacity = o.toFixed(3);
      el.dataset.active = hovered ? "true" : "false";
    }
  });
  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
    >
      <OrbiterShape kind={data.kind} color={data.color} hovered={hovered} />
      <Glow color={data.color} scale={hovered ? 1.8 : 1.1} opacity={hovered ? 0.7 : 0.35} />
    </group>
  );
}

/** Lines from the core to every orbiter and between neighbours, with travelling data pulses. */
function Connections({ positionsRef, n }: { positionsRef: React.RefObject<THREE.Vector3[]>; n: number }) {
  const segs = n * 2;
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segs * 6), 3));
    return g;
  }, [segs]);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const origin = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const positions = positionsRef.current;
    const attr = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < n; i++) {
      const p = positions[i];
      const q = positions[(i + 1) % n];
      arr.set([0, 0, 0, p.x, p.y, p.z], i * 6);
      arr.set([p.x, p.y, p.z, q.x, q.y, q.z], (n + i) * 6);
    }
    attr.needsUpdate = true;
    const inst = pulses.current;
    if (!inst) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < segs; i++) {
      const from = i < n ? origin : positions[i - n];
      const to = i < n ? positions[i] : positions[(i - n + 1) % n];
      const k = (t * (i < n ? 0.35 : 0.22) + i * 0.137) % 1;
      a.lerpVectors(i < n ? to : from, i < n ? from : to, k);
      m.makeScale(1, 1, 1).setPosition(a);
      inst.setMatrixAt(i, m);
    }
    inst.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <instancedMesh ref={pulses} args={[undefined, undefined, segs]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshBasicMaterial map={getDotTexture()} color="#67e8f9" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

function CameraRig() {
  useFrame((state, dt) => {
    const camera = state.camera;
    const p = scrollStore.hero;
    const k = 1 - Math.exp(-dt * 2.5);
    const tx = state.pointer.x * 1.1;
    const ty = state.pointer.y * 0.6 + p * 0.8;
    const tz = 11.5 - p * 6.5;
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z += (tz - camera.position.z) * k;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  const { tier, reduced } = useScene();
  const intro = useRef(reduced ? 1 : 0);
  const positions = useRef(ORBITERS.map(() => new THREE.Vector3()));
  const offset = useRef(new THREE.Group());
  const { size } = useThree();
  const narrow = size.width < 768;
  const mid = size.width < 1100;
  // on wide screens, push the universe further right so it stays clear of the copy
  const halfWidth = Math.tan((21 * Math.PI) / 180) * 11.5 * (size.width / size.height);
  const deskX = Math.max(1.9, halfWidth * 0.43);
  useFrame((_, dt) => {
    if (!reduced) intro.current = Math.min(1, intro.current + dt / 2.4);
  });
  return (
    <>
      <StudioLights />
      <CameraRig />
      <group ref={offset} position={narrow ? [0, 0.1, 0] : mid ? [2.6, 0.4, 0] : [deskX, 0, 0]} scale={narrow ? 0.72 : mid ? 0.8 : 1}>
        <Core intro={intro} />
        {ORBITERS.map((o, i) => (
          <Orbiter key={o.kind} data={o} index={i} positions={positions} intro={intro} />
        ))}
        <Connections positionsRef={positions} n={ORBITERS.length} />
      </group>
      <ParticleField count={tier === "high" ? 2600 : 1800} radius={18} size={0.05} opacity={0.55} />
    </>
  );
}
