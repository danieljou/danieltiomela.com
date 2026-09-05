"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-triggered entrance, once. Renders fully visible by default (see the
 * `.reveal` rule in globals.css, scoped behind `html.js`)  a no-JS visitor,
 * or one whose IntersectionObserver never fires, gets the content anyway.
 * Never re-hides on scroll-out: `is-visible` is one-way.
 */
export function Reveal({
  children,
  className,
  /** Stagger offset in ms  60ms per item is the brand's spec for lists. */
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Must start `false` identically on server and client  `typeof
  // IntersectionObserver === "undefined"` is also true during SSR (no DOM in
  // Node), so using it in the initializer made the server always render
  // "visible" while the browser didn't, a hydration mismatch on every
  // Reveal on the page.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Deferred to a callback, not called synchronously in the effect body.
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
