"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useDeviceTier, useReducedMotion, type Tier } from "@/hooks/useMediaQuery";

type SceneInfo = { tier: Tier; reduced: boolean };
const SceneContext = createContext<SceneInfo>({ tier: "high", reduced: false });
export const useScene = () => useContext(SceneContext);

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const c = document.createElement("canvas");
    webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

type Props = {
  children: ReactNode;
  className?: string;
  /** Shown when WebGL is unavailable. */
  fallback?: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  /** Keep the scene mounted from page load (used for the hero). */
  eager?: boolean;
};

/**
 * Mounts a WebGL scene only when it is near the viewport, pauses rendering
 * when it scrolls out of view, unmounts it when far away (freeing GPU memory),
 * and adapts pixel ratio to device performance.
 */
export default function SceneCanvas({ children, className, fallback = null, camera, eager }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const [near, setNear] = useState(!!eager);
  const [visible, setVisible] = useState(!!eager);
  // this component only renders in the browser (loaded with ssr: false), so window is available
  const [supported] = useState(hasWebGL);
  const [drop, setDrop] = useState(0);
  const maxDpr = tier === "high" ? 1.75 : tier === "mid" ? 1.4 : 1.15;
  const dpr = Math.max(0.75, Math.min(window.devicePixelRatio || 1, maxDpr) - drop);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(([e]) => setNear(e.isIntersecting || !!eager), {
      rootMargin: "120% 0px 120% 0px",
    });
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "60px" });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [eager]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {!supported ? (
        fallback
      ) : near ? (
        <SceneContext.Provider value={{ tier, reduced }}>
          <Canvas
            dpr={dpr}
            frameloop={reduced ? "demand" : visible ? "always" : "never"}
            camera={{ position: camera?.position ?? [0, 0, 8], fov: camera?.fov ?? 40, near: 0.1, far: 100 }}
            gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
            style={{ pointerEvents: "auto" }}
          >
            <PerformanceMonitor
              onDecline={() => setDrop((d) => Math.min(1, d + 0.25))}
              onIncline={() => setDrop((d) => Math.max(0, d - 0.15))}
            />
            {children}
          </Canvas>
        </SceneContext.Provider>
      ) : null}
    </div>
  );
}
