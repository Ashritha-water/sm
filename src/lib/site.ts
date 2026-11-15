/**
 * Company details used across the site.
 * Contact fields are left empty on purpose: fill them in with real details.
 * Empty fields are hidden on the site, so nothing invented is ever shown.
 */
export const site = {
  name: "Sri Mithra Enterprises",
  legalName: "Sri Mithra Enterprises Private Limited",
  shortName: "srimithra",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  description:
    "Sri Mithra Enterprises engineers websites, enterprise applications, mobile apps, AI and RAG systems, SaaS products, WhatsApp Business API solutions, automation and cloud integrations.",
  contact: {
    email: "", // e.g. "hello@yourdomain.com"
    phone: "", // e.g. "+91 98765 43210"
    address: "", // registered office address
  },
  /** Add real profiles only, e.g. { label: "LinkedIn", href: "https://www.linkedin.com/company/..." } */
  social: [] as { label: string; href: string }[],
};

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "AI", href: "/#ai" },
  { label: "WhatsApp", href: "/#whatsapp" },
  { label: "Process", href: "/#process" },
  { label: "Stack", href: "/#stack" },
];
