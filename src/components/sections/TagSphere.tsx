"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SphereItem {
  label: string;
  /** Index of the group it belongs to  picks its colour. */
  group: number;
}

const GROUP_STYLE = [
  "border-secondary/50 bg-secondary/10 text-secondary-text",
  "border-primary-text/50 bg-primary/10 text-primary-text",
  "border-accent/50 bg-accent/10 text-[#b3a2ff]",
  "border-line-strong bg-surface text-muted",
];

/** Fibonacci sphere: even spacing for any item count, no clumping at the poles. */
function layout(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)] as const;
  });
}

/**
 * The stack as a slowly turning 3D sphere of real tags. Positions are
 * projected by hand each frame (not CSS 3D) so every label always faces the
 * reader and stays crisp; depth shows as scale and brightness. The list is
 * still a real `<ul>`, in source order, so assistive tech reads it normally.
 * Turns only while on screen; under reduced motion it renders once, still.
 */
export function TagSphere({
  items,
  label,
  className,
}: {
  items: SphereItem[];
  label: string;
  className?: string;
}) {
  const host = useRef<HTMLUListElement>(null);
  const nodes = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const base = layout(items.length);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ay = 0.4;
    let ax = 0.25;
    let vy = 0.0035;
    let vx = 0;
    let running = false;
    let raf = 0;
    let visible = false;

    function render() {
      const w = el!.clientWidth;
      const h = el!.clientHeight;
      const R = Math.min(w * 0.2, h * 0.42);
      const cy = Math.cos(ay);
      const sy = Math.sin(ay);
      const cx = Math.cos(ax);
      const sx = Math.sin(ax);
      base.forEach(([x, y, z], i) => {
        const node = nodes.current[i];
        if (!node) return;
        // rotate about Y, then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const persp = 1 / (1 - z2 * 0.32); // nearer = bigger
        const px = x1 * R * persp * 2.1; // a wide ellipse: the page is wider than it is tall
        const py = y2 * R * persp;
        node.style.transform = `translate(-50%,-50%) translate(${px.toFixed(1)}px,${py.toFixed(1)}px) scale(${(0.95 * persp).toFixed(3)})`;
        node.style.opacity = String(0.45 + ((z2 + 1) / 2) * 0.55);
        node.style.zIndex = String(Math.round((z2 + 1) * 50));
      });
    }

    function tick() {
      ay += vy;
      ax += vx;
      vx *= 0.95;
      vy += (0.0035 - vy) * 0.02;
      render();
      raf = running ? requestAnimationFrame(tick) : 0;
    }

    function start() {
      if (running || reduce || !visible) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = el!.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      vy = 0.0035 + px * 0.018;
      vx = py * 0.008;
    }

    // Scrolling spins it: the sphere is turned by the page, not just by the cursor.
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      vy += Math.max(-0.05, Math.min(0.05, (y - lastY) * 0.0004));
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove);
    const ro = new ResizeObserver(render);
    ro.observe(el);
    render();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [items.length]);

  return (
    <ul
      ref={host}
      aria-label={label}
      className={cn("relative h-[26rem] w-full select-none sm:h-[32rem]", className)}
    >
      {items.map((it, i) => (
        <li
          key={`${it.group}-${it.label}`}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          className={cn(
            "sphere-item whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[12.5px] leading-tight backdrop-blur-sm",
            GROUP_STYLE[it.group % GROUP_STYLE.length],
          )}
        >
          {it.label}
        </li>
      ))}
    </ul>
  );
}

export { GROUP_STYLE };
