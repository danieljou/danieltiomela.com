"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const MAX_TILT = 6; // degrees  enough to read as depth, never enough to distract

/**
 * A Card that leans toward the cursor and lights up where it is pointed.
 * The effect is pure CSS variables (see `.tilt` in globals.css), so pointer
 * movement never causes a React re-render. Mouse only: touch and pen keep
 * the plain card, and reduced motion drops the lean but keeps the light.
 */
export function TiltCard({
  className,
  onPointerMove,
  onPointerLeave,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      {...props}
      className={cn("tilt", className)}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (e.pointerType !== "mouse") return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el.style.setProperty("--ry", `${(px - 0.5) * 2 * MAX_TILT}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * 2 * MAX_TILT}deg`);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        const el = e.currentTarget;
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }}
    />
  );
}
