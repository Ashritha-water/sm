import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { nav, site } from "@/lib/site";
import Year from "@/components/ui/Year";

export default function Footer() {
  const { email, phone, address } = site.contact;
  return (
    <footer className="relative border-t border-line bg-void pt-20 pb-10">
      <div className="shell">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Image src="/brand/logo-light.svg" alt="Sri Mithra Enterprises Pvt Ltd" width={612} height={255} className="h-16 w-auto" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              Engineering intelligent digital products, enterprise applications and AI systems for ambitious businesses.
            </p>
            {(email || phone || address) && (
              <ul className="mt-6 space-y-2 text-sm text-soft">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">{phone}</a>
                  </li>
                )}
                {address && <li className="text-muted">{address}</li>}
              </ul>
            )}
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow !text-muted">Company</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[...nav, { label: "Contact", href: "/#contact" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-soft hover:text-white">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow !text-muted">Services</p>
            <ul className="mt-5 grid gap-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-soft hover:text-white">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline mt-16" />
        <div className="mt-8 flex flex-col gap-4 text-xs leading-relaxed text-muted md:flex-row md:justify-between">
          <p>© <Year /> {site.legalName}. All rights reserved.</p>
          <p className="max-w-xl md:text-right">
            Meta and WhatsApp are trademarks of Meta Platforms, Inc. Their use on this site describes the platforms we
            build on and does not imply endorsement or sponsorship by Meta.
          </p>
        </div>
        {site.social.length > 0 && (
          <ul className="mt-6 flex gap-5 text-sm">
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-soft hover:text-white">{s.label}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
