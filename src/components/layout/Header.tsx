"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-void/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="Sri Mithra Enterprises, home" className="relative z-10 shrink-0" onClick={() => setOpen(false)}>
          <Image src="/brand/wordmark-light.svg" alt="srimithra" width={612} height={190} priority className="h-8 w-auto md:h-9" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-soft transition-colors hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/#contact" className="btn btn-primary hidden !h-10 !px-5 text-sm sm:inline-flex">
            Let&apos;s Build
          </Link>
          <button
            type="button"
            className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-white transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-4 bg-white transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

    </header>
    <div
      id="mobile-menu"
      className={`fixed inset-0 top-[72px] z-40 bg-void/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      hidden={!open}
    >
      <nav aria-label="Mobile" className="shell flex flex-col gap-1 pt-8">
        {[...nav, { label: "Contact", href: "/#contact" }].map((n, i) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className="display flex items-baseline gap-4 border-b border-line py-4 text-4xl text-ink"
          >
            <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
    </>
  );
}
