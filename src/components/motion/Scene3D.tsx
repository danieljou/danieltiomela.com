"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const MAX = 7; // degrees  the whole object leans, it never swings

/**
 * Gives its children a shared 3D space and tips the whole group toward the
 * cursor, so cards at different depths slide against one another  real
 * parallax, not a per-card hover. Mouse only; touch and pen see the resting
 * pose, and reduced motion removes the transform entirely (see globals.css).
 *
 * Direct children opt into depth with `className="layer"` and `--z` / `--ry`.
 */
export function Scene3D({
  className,
  stageClassName,
  baseRx = 0,
  baseRy = 0,
  global = false,
  children,
}: {
  className?: string;
  stageClassName?: string;
  /** Resting pose in degrees, before the pointer moves it. */
  baseRx?: number;
  baseRy?: number;
  /**
   * Follow the cursor anywhere on the page, not just over the stage  for a
   * stage that sits under something that must receive the pointer itself.
   */
  global?: boolean;
  children: React.ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!global) return;
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const el = host.current;
      const stage = el?.firstElementChild as HTMLElement | null;
      if (!el || !stage) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      stage.style.setProperty("--sry", `${px * 2 * MAX * 1.6}deg`);
      stage.style.setProperty("--srx", `${-py * 2 * MAX * 1.6}deg`);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [global]);

  return (
    <div
      ref={host}
      className={cn("scene3d", className)}
      onPointerMove={(e) => {
        if (global || e.pointerType !== "mouse") return;
        const host = e.currentTarget;
        const stage = host.firstElementChild as HTMLElement | null;
        if (!stage) return;
        const r = host.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        stage.style.setProperty("--sry", `${px * 2 * MAX}deg`);
        stage.style.setProperty("--srx", `${-py * 2 * MAX}deg`);
      }}
      onPointerLeave={(e) => {
        const stage = e.currentTarget.firstElementChild as HTMLElement | null;
        stage?.style.setProperty("--sry", "0deg");
        stage?.style.setProperty("--srx", "0deg");
      }}
    >
      <div
        className={cn("scene3d-stage", stageClassName)}
        style={
          {
            "--base-rx": `${baseRx}deg`,
            "--base-ry": `${baseRy}deg`,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
