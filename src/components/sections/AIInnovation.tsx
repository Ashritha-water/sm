"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import LazyMount from "@/components/ui/LazyMount";
import Reveal from "@/components/ui/Reveal";

const NeuralCanvas = dynamic(() => import("@/components/scenes/NeuralCanvas"), { ssr: false });

const capabilities = [
  { k: "LLM", title: "Large Language Models", text: "Selected, prompted and evaluated for your task, cost and privacy needs." },
  { k: "RAG", title: "Retrieval Augmented Generation", text: "Answers grounded in your documents, with sources shown." },
  { k: "CHAT", title: "Intelligent Chatbots", text: "Assistants for customers and staff on web, apps and WhatsApp." },
  { k: "KM", title: "Knowledge Management", text: "Scattered files turned into searchable, permission-aware knowledge." },
  { k: "AGENT", title: "AI Agents", text: "Agents that use your tools and APIs to complete multi-step work." },
  { k: "AUTO", title: "Enterprise Automation", text: "AI steps inside workflows: read, classify, route and draft." },
];

const principles = [
  ["Start with the problem", "We define the decision or task to improve, and how success will be measured."],
  ["Ground it in your data", "Models work from your systems and documents, with access rules respected."],
  ["Measure before launch", "Evaluation sets and guardrails check quality, safety and cost."],
  ["Keep people in control", "Review steps and clear hand-offs where the stakes are high."],
];

export default function AIInnovation() {
  return (
    <section id="ai" aria-labelledby="ai-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(124,58,237,0.16),transparent_60%)]" />
      <div className="shell relative">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">AI &amp; innovation</p>
          <h2 id="ai-title" className="display mt-5 text-[clamp(2.4rem,5.4vw,5.2rem)]">
            Beyond Traditional Software.
            <span className="block text-muted">Into Intelligent Engineering.</span>
          </h2>
        </Reveal>

        <div className="relative mt-10 h-[420px] sm:h-[520px] lg:h-[620px]">
          <LazyMount className="absolute inset-0">
            <NeuralCanvas />
          </LazyMount>
          {/* capability labels around the neural structure */}
          <ul className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
            {capabilities.map((c, i) => {
              const pos = [
                "left-[4%] top-[14%]", "left-[0%] top-[46%]", "left-[6%] bottom-[10%]",
                "right-[4%] top-[14%]", "right-[0%] top-[46%]", "right-[6%] bottom-[10%]",
              ][i];
              return (
                <li key={c.k} className={`absolute ${pos} ${i > 2 ? "text-right" : ""}`}>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-cyan">{c.k}</span>
                  <span className="mt-1 block text-sm text-soft">{c.title}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.k} delay={i * 0.05} className="border-t border-line pt-5">
              <h3 className="text-lg font-medium text-white">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <h3 className="display text-[clamp(1.8rem,3vw,2.8rem)] text-white">Practical AI for real business problems.</h3>
            <p className="mt-5 max-w-md leading-relaxed text-soft">
              We do not start with a model. We start with a workflow that costs you time or money, then design an AI
              system around it that is measurable, secure and maintainable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services/artificial-intelligence" className="btn btn-ghost">AI Solutions</Link>
              <Link href="/services/generative-ai-rag" className="btn btn-ghost">Generative AI &amp; RAG</Link>
            </div>
          </Reveal>
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {principles.map(([t, d], i) => (
              <li key={t} className="bg-void p-7">
                <span className="font-mono text-xs text-violet">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 font-medium text-white">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
