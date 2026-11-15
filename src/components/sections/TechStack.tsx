"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { useReducedMotion } from "@/hooks/useMediaQuery";

const groups = [
  { name: "Frontend", items: ["React", "Next.js", "Angular", "TypeScript"], at: [17, 27], color: "#3b82f6", glyph: "rounded-[3px]" },
  { name: "Backend", items: ["Node.js", "NestJS", "Express"], at: [50, 17], color: "#6366f1", glyph: "rotate-45 rounded-[2px]" },
  { name: "Database", items: ["PostgreSQL", "MongoDB", "Redis"], at: [83, 27], color: "#22d3ee", glyph: "rounded-full" },
  { name: "AI", items: ["LLMs", "RAG", "Vector Databases", "AI Agents"], at: [20, 73], color: "#8b5cf6", glyph: "rounded-full ring-2 ring-current bg-transparent" },
  { name: "Infrastructure", items: ["AWS", "Docker", "Linux", "CI/CD"], at: [51, 82], color: "#60a5fa", glyph: "rounded-none" },
  { name: "Integrations", items: ["REST APIs", "GraphQL", "gRPC", "Kafka"], at: [81, 72], color: "#2dd4bf", glyph: "rotate-45 rounded-none" },
] as const;

/** Item positions around each category hub, in % of the constellation panel. */
function layout(at: readonly [number, number], count: number, gi: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + gi * 0.7 + 0.4;
    // rounded so server and browser render identical numbers (avoids hydration mismatches)
    return [Math.round((at[0] + Math.cos(a) * 14.5) * 100) / 100, Math.round((at[1] + Math.sin(a) * 17) * 100) / 100] as const;
  });
}

export default function TechStack() {
  const panel = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !panel.current) return;
    const r = panel.current.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 });
  };

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative py-28 md:py-40">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Technology stack</p>
          <h2 id="stack-title" className="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">
            A constellation of proven technology.
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-soft">
            The tools our engineers work with every day, chosen for reliability, performance and long-term support.
          </p>
        </Reveal>

        {/* desktop: interactive constellation */}
        <div
          className="relative mt-16 hidden h-[640px] [perspective:1400px] lg:block"
          onPointerMove={onMove}
          onPointerLeave={() => {
            setTilt({ x: 0, y: 0 });
            setHover(null);
          }}
        >
          <div
            ref={panel}
            className="relative h-full rounded-[32px] border border-line bg-[radial-gradient(ellipse_at_center,rgba(30,41,90,0.35),rgba(22,24,29,0)_70%)] transition-transform duration-700 ease-out [transform-style:preserve-3d]"
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {groups.map((g, gi) => {
                const next = groups[(gi + 1) % groups.length].at;
                const dim = hover !== null && hover !== gi;
                return (
                  <g key={g.name} opacity={dim ? 0.15 : 1} style={{ transition: "opacity .4s" }}>
                    <line x1={g.at[0]} y1={g.at[1]} x2={next[0]} y2={next[1]} stroke="rgba(148,163,184,0.16)" strokeWidth="0.12" strokeDasharray="0.6 0.6" vectorEffect="non-scaling-stroke" />
                    {layout(g.at, g.items.length, gi).map(([x, y], i) => (
                      <line key={i} x1={g.at[0]} y1={g.at[1]} x2={x} y2={y} stroke={g.color} strokeOpacity={hover === gi ? 0.8 : 0.35} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    ))}
                  </g>
                );
              })}
            </svg>

            <ul className="absolute inset-0" aria-label="Technology categories">
              {groups.map((g, gi) => {
                const dim = hover !== null && hover !== gi;
                return (
                  <li key={g.name} className="contents">
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-400"
                      style={{ left: `${g.at[0]}%`, top: `${g.at[1]}%`, transform: "translate(-50%,-50%) translateZ(60px)", opacity: dim ? 0.3 : 1 }}
                      onPointerEnter={() => setHover(gi)}
                    >
                      <div className="glass flex items-center gap-2.5 rounded-full px-4 py-2" style={{ boxShadow: `0 0 40px -8px ${g.color}` }}>
                        <span className={`h-2.5 w-2.5 ${g.glyph}`} style={{ background: g.glyph.includes("bg-transparent") ? "transparent" : g.color, color: g.color }} />
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">{g.name}</span>
                      </div>
                    </div>
                    <ul aria-label={g.name}>
                      {layout(g.at, g.items.length, gi).map(([x, y], i) => (
                        <li
                          key={g.items[i]}
                          className="absolute transition-all duration-500"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%,-50%) translateZ(${hover === gi ? 90 : 30}px)`,
                            opacity: dim ? 0.25 : 1,
                          }}
                          onPointerEnter={() => setHover(gi)}
                        >
                          <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-void/80 px-3 py-1.5 text-sm text-soft">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
                            {g.items[i]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* mobile and tablet: grouped list */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:hidden">
          {groups.map((g) => (
            <div key={g.name} className="bg-void p-6">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: g.color }}>
                <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />
                {g.name}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 text-sm text-soft">{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
