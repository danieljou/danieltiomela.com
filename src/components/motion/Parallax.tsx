"use client";

import { useEffect, useRef } from "react";

/**
 * A very slow scroll-linked drift, meant for one decorative background layer
 * at a time (the hero's Trace pattern)  not a general-purpose primitive to
 * scatter across the page. Skipped entirely under reduced motion, rather
 * than just shortened: this is the one effect on the site with no natural
 * "instant" end state, since it has no destination to snap to.
 */
export function Parallax({
  children,
  speed = 0.05,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    function update() {
      raf = 0;
      if (!el) return;
      const offset = el.getBoundingClientRect().top * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
