"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import LazyMount from "@/components/ui/LazyMount";
import Reveal from "@/components/ui/Reveal";

const MessagingCanvas = dynamic(() => import("@/components/scenes/MessagingCanvas"), { ssr: false });

const features = [
  ["WhatsApp Business API integration", "Connect the WhatsApp Business Platform to your website, apps and back-office systems."],
  ["Business onboarding assistance", "Guidance through business verification, number setup and account configuration."],
  ["Customer communication automation", "Order updates, reminders, bookings and support flows that run on their own."],
  ["Template management", "Create, organise and submit message templates for approval."],
  ["Campaign management", "Opt-in based broadcasts with audience segments and scheduling."],
  ["Unified team inbox", "One shared inbox so agents can pick up, assign and resolve conversations."],
  ["CRM integrations", "Contacts, conversations and outcomes synced with your CRM."],
  ["Messaging analytics", "Delivery, read and response metrics to improve every journey."],
  ["Enterprise messaging workflows", "Approvals, escalations and hand-offs across teams and systems."],
];

export default function WhatsApp() {
  return (
    <section id="whatsapp" aria-labelledby="wa-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(45,212,191,0.1),transparent_55%)]" />
      <div className="shell relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="relative order-2 h-[380px] sm:h-[480px] lg:order-1 lg:h-[660px]">
          <LazyMount className="absolute inset-0">
            <MessagingCanvas />
          </LazyMount>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow !text-wa">Meta Tech Provider</p>
            <h2 id="wa-title" className="display mt-5 text-[clamp(2.3rem,4.6vw,4.4rem)]">
              Conversations that run your business.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-soft">
              Sri Mithra Enterprises is a Meta Tech Provider. We help businesses get set up on the WhatsApp Business
              Platform and build messaging their customers value, from first onboarding to automated journeys and
              enterprise-scale workflows.
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {features.map(([t, d], i) => (
              <li key={t} className="border-t border-line">
                <Reveal delay={(i % 2) * 0.06} y={16} className="flex gap-4 py-5">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wa shadow-[0_0_12px_2px_rgba(45,212,191,0.55)]" />
                  <div>
                    <p className="font-medium text-white">{t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/services/whatsapp-business-api" className="btn btn-primary">
              Explore WhatsApp Solutions <span aria-hidden>→</span>
            </Link>
          </div>
          <p className="mt-6 max-w-lg text-xs leading-relaxed text-muted">
            WhatsApp and Meta are trademarks of Meta Platforms, Inc. Sri Mithra Enterprises is an independent company;
            this does not imply endorsement or sponsorship by Meta. Features depend on the WhatsApp Business Platform
            and its policies.
          </p>
        </div>
      </div>
    </section>
  );
}
