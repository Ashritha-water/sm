"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LazyMount from "@/components/ui/LazyMount";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/lib/services";

const ServiceCanvas = dynamic(() => import("@/components/scenes/ServiceCanvas"), { ssr: false });

export default function Services() {
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const router = useRouter();
  const s = services[active];

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-28 md:py-40">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Our technology ecosystem</p>
          <h2 id="services-title" className="display mt-5 text-[clamp(2.4rem,5vw,4.6rem)]">
            Ten disciplines. <span className="text-muted">One engineering team.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* 3D stage: the active discipline as a living object */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <div
              className="relative h-[360px] overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(ellipse_at_center,rgba(30,41,90,0.45),rgba(22,24,29,0.2)_70%)] sm:h-[460px] lg:h-full"
              onPointerEnter={() => setEngaged(true)}
              onPointerLeave={() => setEngaged(false)}
              onClick={() => router.push(`/services/${s.slug}`)}
              role="presentation"
            >
              <LazyMount className="absolute inset-0">
                <ServiceCanvas kind={s.visual} accent={s.accent} engaged={engaged} />
              </LazyMount>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45 }}
                  >
                    <p className="font-mono text-xs text-muted">{s.index} / {String(services.length).padStart(2, "0")}</p>
                    <p className="display mt-1 text-2xl text-white">{s.title}</p>
                  </motion.div>
                </AnimatePresence>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Click to explore</span>
              </div>
            </div>
          </div>

          {/* index of disciplines */}
          <ul className="border-t border-line" onPointerLeave={() => setEngaged(false)}>
            {services.map((sv, i) => {
              const on = i === active;
              return (
                <li key={sv.slug} className="border-b border-line">
                  <Link
                    href={`/services/${sv.slug}`}
                    onPointerEnter={() => {
                      setActive(i);
                      setEngaged(true);
                    }}
                    onFocus={() => setActive(i)}
                    aria-describedby={`svc-${sv.slug}`}
                    className="group block py-6 outline-none"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className={`font-mono text-xs transition-colors ${on ? "text-cyan" : "text-muted"}`}>{sv.index}</span>
                      <span className={`display flex-1 text-[clamp(1.35rem,2.2vw,2rem)] transition-colors duration-300 ${on ? "text-white" : "text-soft/70 group-hover:text-white"}`}>
                        {sv.title}
                      </span>
                      <span aria-hidden className={`text-xl transition-all duration-500 ${on ? "translate-x-0 text-cyan opacity-100" : "-translate-x-2 opacity-0"}`}>→</span>
                    </div>
                    <div
                      id={`svc-${sv.slug}`}
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden pl-[2.6rem]">
                        <p className="pt-3 text-sm leading-relaxed text-soft md:text-base">{sv.short}</p>
                        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
                          {sv.technologies.slice(0, 5).map((t) => (
                            <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-soft">{t}</li>
                          ))}
                        </ul>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm text-cyan">Learn more <span aria-hidden>↗</span></span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
