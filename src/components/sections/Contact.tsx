"use client";

import dynamic from "next/dynamic";
import LazyMount from "@/components/ui/LazyMount";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import ContactForm from "./ContactForm";

const PortalCanvas = dynamic(() => import("@/components/scenes/PortalCanvas"), { ssr: false });

export default function Contact() {
  const { email, phone, address } = site.contact;
  const hasDetails = email || phone || address || site.social.length > 0;
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <div className="relative -mx-5 h-[320px] sm:h-[420px] lg:mx-0 lg:h-[460px]">
            <LazyMount className="absolute inset-0">
              <PortalCanvas />
            </LazyMount>
          </div>
          <Reveal>
            <p className="eyebrow">Let&apos;s create something extraordinary</p>
            <h2 id="contact-title" className="display mt-5 text-[clamp(2.3rem,4.6vw,4.4rem)]">
              Have an Idea? Let&apos;s Engineer It Into Reality.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-soft">
              From business applications to intelligent AI products, let&apos;s build technology that creates meaningful
              impact.
            </p>
          </Reveal>
          {hasDetails && (
            <ul className="mt-10 space-y-3 text-soft">
              {email && (
                <li>
                  <span className="mr-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Email</span>
                  <a className="hover:text-white" href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {phone && (
                <li>
                  <span className="mr-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Phone</span>
                  <a className="hover:text-white" href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                </li>
              )}
              {address && (
                <li>
                  <span className="mr-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Office</span>
                  {address}
                </li>
              )}
              {site.social.length > 0 && (
                <li className="flex flex-wrap gap-4 pt-2">
                  {site.social.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white">
                      {s.label} ↗
                    </a>
                  ))}
                </li>
              )}
            </ul>
          )}
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
