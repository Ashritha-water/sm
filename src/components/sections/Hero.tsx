"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { heroLabelEls, heroNodes, heroTextRect } from "@/lib/heroNodes";
import { scrollStore } from "@/lib/scrollStore";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroCanvas = dynamic(() => import("@/components/scenes/HeroCanvas"), { ssr: false });

const line1 = ["Engineering", "Tomorrow."];
const line2 = ["Building", "Intelligent", "Digital", "Experiences."];
const ease = [0.16, 1, 0.3, 1] as const;

function Words({ words, start, className }: { words: string[]; start: number; className?: string }) {
  return (
    <span className={`block ${className ?? ""}`}>
      {words.map((w, i) => (
        <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: start + i * 0.08, ease }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const textBlock = useRef<HTMLDivElement>(null);

  // tell the 3D scene where the copy sits, so orbit labels never cover it
  useEffect(() => {
    const measure = () => {
      if (!textBlock.current || !stage.current) return;
      const t = textBlock.current.getBoundingClientRect();
      const s = stage.current.getBoundingClientRect();
      Object.assign(heroTextRect, { x0: t.left - s.left, y0: t.top - s.top, x1: t.right - s.left, y1: t.bottom - s.top });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (textBlock.current) ro.observe(textBlock.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onRefresh: (self) => {
          scrollStore.hero = self.progress;
        },
        onUpdate: (self) => {
          scrollStore.hero = self.progress;
        },
      });
      gsap.to(copy.current, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
      });
      gsap.to(stage.current, {
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "45% top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-labelledby="hero-title" className="relative overflow-hidden md:min-h-[100svh]">
      <div ref={stage} className="absolute inset-x-0 top-0 h-[54svh] md:h-full">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(37,99,235,0.16),transparent_60%)]" />
        <HeroCanvas />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {heroNodes.map((n, i) => (
            <span
              key={n.kind}
              ref={(el) => {
                heroLabelEls[i] = el;
              }}
              style={{ opacity: 0 }}
              className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 transition-colors duration-300 will-change-transform data-[active=true]:text-white"
            >
              {n.label}
            </span>
          ))}
        </div>
      </div>
      {/* readability scrim behind the copy */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(22,24,29,0.92)_0%,rgba(22,24,29,0.55)_38%,transparent_65%)] max-md:bg-none" />
      {/* phones: fade the 3D area into the page above the copy */}
      <div className="pointer-events-none absolute inset-x-0 top-[34svh] h-[20svh] bg-gradient-to-b from-transparent to-void md:hidden" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />

      <div ref={copy} className="shell pointer-events-none relative flex flex-col pt-[48svh] pb-20 md:min-h-[100svh] md:justify-center md:pt-28 md:pb-24">
        <div ref={textBlock} className="w-fit">
        <motion.p
          className="eyebrow mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          Digital Engineering · AI · Enterprise Software
        </motion.p>
        <h1 id="hero-title" className="display max-w-[15ch] text-[clamp(2.4rem,min(6.2vw,10.5svh),6.2rem)] text-white">
          <Words words={line1} start={0.3} />
          <Words words={line2} start={0.55} className="text-soft/80" />
        </h1>
        <motion.p
          className="mt-8 max-w-xl text-base leading-relaxed text-soft md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease }}
        >
          We transform ambitious ideas into powerful digital products through engineering, artificial intelligence and
          next-generation technology.
        </motion.p>
        <motion.div
          className="pointer-events-auto mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease }}
        >
          <Link href="/#services" className="btn btn-primary">
            Explore Our Capabilities
            <span aria-hidden>→</span>
          </Link>
          <Link href="/#contact" className="btn btn-ghost">
            Let&apos;s Build Something
          </Link>
        </motion.div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex [@media(max-height:820px)]:!hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        aria-hidden
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-line-strong">
          <span className="absolute inset-x-0 top-0 h-4 animate-[scrollcue_2s_ease-in-out_infinite] bg-cyan" />
        </span>
      </motion.div>
    </section>
  );
}
