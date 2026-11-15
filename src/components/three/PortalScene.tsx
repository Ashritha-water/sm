"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useScene } from "./SceneCanvas";
import { getDotTexture, Glow, seeded, StudioLights } from "./shared";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const fragment = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float swirl = sin(a * 5.0 + r * 9.0 - uTime * 1.6) * 0.5 + 0.5;
    float swirl2 = sin(a * 3.0 - r * 14.0 + uTime * 1.1) * 0.5 + 0.5;
    vec3 blue = vec3(0.15, 0.36, 0.95);
    vec3 violet = vec3(0.52, 0.32, 0.98);
    vec3 cyan = vec3(0.35, 0.85, 0.95);
    vec3 col = mix(blue, violet, swirl);
    col = mix(col, cyan, swirl2 * smoothstep(0.2, 0.9, r) * 0.6);
    float core = smoothstep(0.35, 0.0, r);
    float edge = smoothstep(1.0, 0.9, r);
    float alpha = edge * (0.18 + 0.45 * swirl * swirl2) + core * 0.6;
    gl_FragColor = vec4(col * (0.9 + core), alpha);
  }
`;

/** A luminous gateway: glowing rings, a swirling event horizon and particles drawn into it. */
export default function PortalScene() {
  const { tier } = useScene();
  const COUNT = tier === "high" ? 900 : tier === "mid" ? 550 : 300;
  const [uniforms] = useState(() => ({ uTime: { value: 0 } }));
  const mat = useRef<THREE.ShaderMaterial>(null);
  const portal = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  const seeds = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({ a: seeded(i * 4) * Math.PI * 2, r: 2.2 + seeded(i * 4 + 1) * 5, s: 0.15 + seeded(i * 4 + 2) * 0.35, z: (seeded(i * 4 + 3) - 0.5) * 2, o: i / COUNT })), [COUNT]);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    return g;
  }, [COUNT]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (mat.current) mat.current.uniforms.uTime.value = t;
    const arr = (geo.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    seeds.forEach((s, i) => {
      const life = (t * s.s * 0.25 + s.o) % 1; // 0 = far out, 1 = swallowed by the portal
      const r = s.r * (1 - life) + 0.2;
      const a = s.a + life * 5;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r * 0.92;
      arr[i * 3 + 2] = s.z * (1 - life) - life * 0.5;
    });
    geo.getAttribute("position").needsUpdate = true;
    if (ringA.current) ringA.current.rotation.z += dt * 0.25;
    if (ringB.current) ringB.current.rotation.z -= dt * 0.18;
    const g = portal.current;
    if (g) {
      const k = 1 - Math.exp(-dt * 2.5);
      g.rotation.y += (state.pointer.x * 0.35 - g.rotation.y) * k;
      g.rotation.x += (-state.pointer.y * 0.25 - g.rotation.x) * k;
    }
  });

  return (
    <>
      <StudioLights intensity={0.8} />
      <group ref={portal}>
        <mesh>
          <circleGeometry args={[2.05, 96]} />
          <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={ringA}>
          <torusGeometry args={[2.1, 0.05, 24, 200]} />
          <meshPhysicalMaterial color="#0f172a" emissive="#60a5fa" emissiveIntensity={1.6} metalness={0.6} roughness={0.15} clearcoat={1} />
        </mesh>
        <mesh ref={ringB} rotation={[0, 0, 0.6]}>
          <torusGeometry args={[2.45, 0.012, 12, 200, Math.PI * 1.6]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[0, 0, 2.4]}>
          <torusGeometry args={[2.7, 0.008, 12, 200, Math.PI * 0.9]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.6} />
        </mesh>
        <Glow color="#3b82f6" scale={9} opacity={0.35} />
        <Glow color="#8b5cf6" scale={5} opacity={0.3} />
      </group>
      <points geometry={geo}>
        <pointsMaterial map={getDotTexture()} size={0.07} color="#bfdbfe" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}
