"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Entry = { el: HTMLElement; delay: number; done: boolean };
const entries = new Set<Entry>();
let raf = 0;
let bound = false;

function frame() {
  raf = 0;
  const vh = window.innerHeight;
  for (const e of entries) {
    if (e.done) continue;
    const top = e.el.getBoundingClientRect().top;
    // 0 while the element is below the fold, 1 once it has risen to 62% of
    // the viewport. One-way: it never tips back down on scroll-up.
    const raw = (vh - top - e.delay) / (vh * 0.38);
    const p = Math.min(1, Math.max(0, raw));
    e.el.style.setProperty("--p", p.toFixed(3));
    if (p >= 1) e.done = true;
  }
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(frame);
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

/**
 * Scroll-scrubbed 3D entrance: the block tips up from the page and settles
 * as it rises into view. One shared scroll listener for every instance.
 * Visible by default without JS (the hidden state lives behind `.js`).
 */
export function Reveal3D({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Extra px the element must rise before it starts, for staggering. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const entry: Entry = { el, delay, done: false };
    entries.add(entry);
    bind();
    schedule();
    return () => {
      entries.delete(entry);
    };
  }, [delay]);

  return (
    <div ref={ref} className={cn("reveal3d", className)}>
      {children}
    </div>
  );
}
