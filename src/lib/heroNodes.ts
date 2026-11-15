/** Orbiting elements of the hero "digital universe" (plain data, no 3D imports). */
export type HeroKind = "ai" | "web" | "mobile" | "rag" | "enterprise" | "whatsapp" | "product";

export const heroNodes: { label: string; kind: HeroKind; color: string; r: number; speed: number; tilt: number; phase: number; y: number; href: string }[] = [
  { label: "Artificial Intelligence", kind: "ai", color: "#8b5cf6", r: 3.3, speed: 0.15, tilt: 0.42, phase: 0.0, y: 0.3, href: "/services/artificial-intelligence" },
  { label: "Web Engineering", kind: "web", color: "#3b82f6", r: 4.3, speed: 0.11, tilt: -0.28, phase: 0.9, y: -0.2, href: "/services/web-development" },
  { label: "Mobile Applications", kind: "mobile", color: "#22d3ee", r: 3.8, speed: 0.13, tilt: 0.18, phase: 1.8, y: 0.5, href: "/services/mobile-apps" },
  { label: "RAG & Knowledge", kind: "rag", color: "#a78bfa", r: 4.8, speed: 0.09, tilt: 0.3, phase: 2.7, y: -0.4, href: "/services/generative-ai-rag" },
  { label: "Enterprise Software", kind: "enterprise", color: "#60a5fa", r: 3.6, speed: 0.12, tilt: -0.4, phase: 3.6, y: 0.1, href: "/services/enterprise-applications" },
  { label: "WhatsApp Automation", kind: "whatsapp", color: "#2dd4bf", r: 4.5, speed: 0.1, tilt: -0.15, phase: 4.5, y: 0.35, href: "/services/whatsapp-business-api" },
  { label: "Product Engineering", kind: "product", color: "#818cf8", r: 4.0, speed: 0.14, tilt: 0.1, phase: 5.4, y: -0.5, href: "/services/saas-product-development" },
];

/** Hero copy block in canvas pixel coordinates; labels are hidden where they would overlap it. */
export const heroTextRect = { x0: 0, y0: 0, x1: 0, y1: 0 };

/** DOM label elements, positioned each frame by the hero scene. */
export const heroLabelEls: (HTMLElement | null)[] = [];
