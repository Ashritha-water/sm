"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useRef } from "react";
import LazyMount from "@/components/ui/LazyMount";
import { scrollStore } from "@/lib/scrollStore";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ArchitectureCanvas = dynamic(() => import("@/components/scenes/ArchitectureCanvas"), { ssr: false });

const pillars = [
  { title: "Innovation-driven engineering", text: "We pick technology for what it does for your business, then engineer it properly." },
  { title: "Business-focused technology", text: "Every build starts from a business outcome: revenue, cost, speed or customer experience." },
  { title: "Scalable architecture", text: "Modular systems that grow with new users, products and markets without rewrites." },
  { title: "Intelligent automation", text: "AI and workflow automation applied where they remove real, repetitive effort." },
  { title: "End-to-end product development", text: "From discovery and design to engineering, launch and continuous improvement." },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 85%",
        end: "center 40%",
        scrub: true,
        onRefresh: (self) => {
          scrollStore.about = self.progress;
        },
        onUpdate: (self) => {
          scrollStore.about = self.progress;
        },
      });
      const items = gsap.utils.toArray<HTMLElement>("[data-pillar]");
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.18, x: -12 },
          {
            opacity: 1,
            x: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 55%", scrub: true },
          },
        );
      });
      gsap.fromTo(
        "[data-about-lead] span",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: "[data-about-lead]", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    },
    { scope: root },
  );

  const lead =
    "Sri Mithra Enterprises Pvt Ltd is a technology-driven company focused on building intelligent digital solutions, enterprise applications and scalable technology products.";

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="shell grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 id="about-title" className="sr-only">About Sri Mithra Enterprises</h2>
          <p data-about-lead className="display mt-6 text-[clamp(1.9rem,3.4vw,3.2rem)] !leading-[1.12] text-white">
            {lead.split(" ").map((w, i) => (
              <span key={i}>{w} </span>
            ))}
          </p>
          <ol className="mt-12 space-y-0 border-t border-line">
            {pillars.map((p, i) => (
              <li key={p.title} data-pillar className="grid grid-cols-[3rem_1fr] gap-2 border-b border-line py-5">
                <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-medium text-white">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative h-[380px] sm:h-[480px] lg:h-[640px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),transparent_65%)]" />
          <LazyMount className="absolute inset-0">
            <ArchitectureCanvas />
          </LazyMount>
        </div>
      </div>
    </section>
  );
}
