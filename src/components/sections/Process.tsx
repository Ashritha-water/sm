"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import LazyMount from "@/components/ui/LazyMount";
import Reveal from "@/components/ui/Reveal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { processSteps } from "@/lib/process";
import { scrollStore } from "@/lib/scrollStore";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProcessCanvas = dynamic(() => import("@/components/scenes/ProcessCanvas"), { ssr: false });

function Pinned() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const n = processSteps.length;

  useGSAP(
    () => {
      const setX = gsap.quickSetter(track.current, "xPercent");
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, delay: 0.08, ease: "power2.out" },
        onRefresh: (self) => {
          scrollStore.process = self.progress;
        },
        onUpdate: (self) => {
          scrollStore.process = self.progress;
          // each panel is 1/n of the track; slide one panel per step
          setX(-self.progress * ((n - 1) / n) * 100);
          setActive(Math.min(n - 1, Math.round(self.progress * (n - 1))));
        },
      });
      // this section changes page height once it mounts, so re-measure every trigger
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="relative" style={{ height: `${n * 75 + 60}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <LazyMount className="absolute inset-0" margin="150% 0px">
          <ProcessCanvas />
        </LazyMount>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(22,24,29,0.92)_0%,rgba(22,24,29,0.6)_35%,transparent_60%)]" />

        <div className="shell pointer-events-none relative flex h-full flex-col justify-between py-28">
          <div>
            <p className="eyebrow">Our development process</p>
            <h2 id="process-title" className="display mt-5 max-w-xl text-[clamp(2.4rem,4.4vw,4.2rem)]">
              From first idea to production, and beyond.
            </h2>
          </div>

          <div className="overflow-hidden [mask-image:linear-gradient(90deg,#000,#000_70%,transparent)]">
            <ol ref={track} className="flex will-change-transform" style={{ width: `${n * 50}vw` }}>
              {processSteps.map((s, i) => (
                <li
                  key={s.n}
                  className={`w-[50vw] pr-[8vw] transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-20"}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span className="font-mono text-sm text-cyan">{s.n}</span>
                  <h3 className="display mt-3 text-5xl text-white xl:text-6xl">{s.title}</h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-soft">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-center gap-3" aria-hidden>
            {processSteps.map((s, i) => (
              <span key={s.n} className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full transition-all duration-500 ${i <= active ? "bg-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]" : "bg-line-strong"}`} />
                {i < n - 1 && <span className={`h-px w-16 transition-colors duration-500 ${i < active ? "bg-cyan/60" : "bg-line"}`} />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stacked() {
  return (
    <section id="process" aria-labelledby="process-title-m" className="relative py-28">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Our development process</p>
          <h2 id="process-title-m" className="display mt-5 text-[clamp(2.2rem,8vw,3.4rem)]">
            From first idea to production, and beyond.
          </h2>
        </Reveal>
        <ol className="relative mt-12 border-l border-line pl-8">
          {processSteps.map((s, i) => (
            <li key={s.n} className="relative pb-10 last:pb-0">
              <span aria-hidden className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
              <Reveal delay={i * 0.04} y={16}>
                <span className="font-mono text-xs text-cyan">{s.n}</span>
                <h3 className="display mt-2 text-3xl text-white">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-soft">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Process() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  return desktop ? <Pinned /> : <Stacked />;
}
