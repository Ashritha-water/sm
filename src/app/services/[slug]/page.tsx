import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceVisualPanel from "@/components/sections/ServiceVisualPanel";
import Reveal from "@/components/ui/Reveal";
import { processSteps } from "@/lib/process";
import { getService, services } from "@/lib/services";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Service not found" };
  return {
    title: s.title,
    description: s.summary,
    alternates: { canonical: `/services/${s.slug}/` },
    openGraph: { title: `${s.title} | ${site.name}`, description: s.summary, url: `/services/${s.slug}/`, images: ["/og.png"] },
    twitter: { title: `${s.title} | ${site.name}`, description: s.summary },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const i = services.indexOf(s);
  const related = [1, 2, 3].map((k) => services[(i + k) % services.length]);
  const isWhatsApp = s.slug === "whatsapp-business-api";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.summary,
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
    areaServed: "Worldwide",
    url: `${site.url}/services/${s.slug}/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40" aria-labelledby="svc-title">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 75% 30%, ${s.accent}1f, transparent 60%)` }} />
        <div className="shell relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/#services" className="hover:text-white">Services</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-soft">{s.title}</li>
              </ol>
            </nav>
            <p className="eyebrow mt-10" style={{ color: s.accent }}>Service {s.index}</p>
            <h1 id="svc-title" className="display mt-4 text-[clamp(2.6rem,5.4vw,5rem)] text-white">{s.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-soft">{s.summary}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/?service=${s.slug}#contact`} className="btn btn-primary">
                Start this project <span aria-hidden>→</span>
              </Link>
              <Link href="/#services" className="btn btn-ghost">All services</Link>
            </div>
          </div>
          <ServiceVisualPanel kind={s.visual} accent={s.accent} />
        </div>
      </section>

      {isWhatsApp && (
        <section className="pb-8" aria-label="Meta Tech Provider">
          <div className="shell">
            <div className="glass rounded-3xl p-7 md:p-9">
              <p className="eyebrow !text-wa">Meta Tech Provider</p>
              <p className="mt-4 max-w-3xl leading-relaxed text-soft">
                As a Meta Tech Provider, Sri Mithra Enterprises can help your business onboard to the WhatsApp Business
                Platform and build on its APIs. Message templates, pricing and features are set by Meta and follow the
                WhatsApp Business Platform policies.
              </p>
              <p className="mt-4 text-xs text-muted">
                WhatsApp and Meta are trademarks of Meta Platforms, Inc. Sri Mithra Enterprises is an independent company;
                this does not imply endorsement or sponsorship by Meta.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 md:py-28" aria-labelledby="build-title">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">What we build</p>
            <h2 id="build-title" className="display mt-4 max-w-2xl text-[clamp(2rem,3.6vw,3.4rem)]">{s.short}</h2>
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {s.capabilities.map((c, k) => (
              <li key={c.title} className="bg-void p-8 md:p-10">
                <span className="font-mono text-xs" style={{ color: s.accent }}>{String(k + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl font-medium text-white">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="tech-title">
        <div className="shell grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Technologies</p>
            <h2 id="tech-title" className="display mt-4 text-[clamp(2rem,3.4vw,3rem)]">Built with</h2>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {s.technologies.map((t) => (
                <li key={t} className="rounded-full border border-line px-4 py-2 font-mono text-sm text-soft">{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow">What you can expect</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.4vw,3rem)]">Outcomes</h2>
            <ul className="mt-8 space-y-4">
              {s.outcomes.map((o) => (
                <li key={o} className="flex gap-4 border-b border-line pb-4 text-soft">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: s.accent }} />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="deliver-title">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">How we deliver</p>
            <h2 id="deliver-title" className="display mt-4 text-[clamp(2rem,3.4vw,3rem)]">Six steps, one accountable team.</h2>
          </Reveal>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
            {processSteps.map((p) => (
              <li key={p.n} className="bg-void p-6">
                <span className="font-mono text-xs text-cyan">{p.n}</span>
                <p className="mt-3 font-medium text-white">{p.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="related-title">
        <div className="shell">
          <h2 id="related-title" className="eyebrow">Related services</h2>
          <ul className="mt-6 border-t border-line">
            {related.map((r) => (
              <li key={r.slug} className="border-b border-line">
                <Link href={`/services/${r.slug}`} className="group flex items-baseline gap-5 py-6">
                  <span className="font-mono text-xs text-muted">{r.index}</span>
                  <span className="display flex-1 text-2xl text-soft transition-colors group-hover:text-white md:text-3xl">{r.title}</span>
                  <span aria-hidden className="text-cyan opacity-0 transition-opacity group-hover:opacity-100">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="glass mt-20 flex flex-col items-start justify-between gap-8 rounded-[28px] p-8 md:flex-row md:items-center md:p-12">
            <div>
              <h2 className="display text-[clamp(1.8rem,3vw,2.8rem)] text-white">Let&apos;s talk about your project.</h2>
              <p className="mt-3 text-soft">Tell us what you are building. We will reply with next steps.</p>
            </div>
            <Link href={`/?service=${s.slug}#contact`} className="btn btn-primary shrink-0">
              Start Your Project <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
