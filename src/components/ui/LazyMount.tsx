"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children only once the placeholder comes near the viewport.
 * Used to defer downloading 3D scene code until a visitor scrolls toward it.
 */
export default function LazyMount({
  children,
  className,
  margin = "100% 0px",
}: {
  children: ReactNode;
  className?: string;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, show]);
  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  );
}
