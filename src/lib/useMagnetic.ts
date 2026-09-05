"use client";

import { useCallback, useRef } from "react";

/**
 * A small pull toward the cursor, for primary CTAs only  never on touch or
 * coarse pointers (there is no hover to pull toward), and never under
 * reduced motion. Returns event handlers rather than a ref so it composes
 * with whatever the caller already passed in.
 */
export function useMagnetic(enabled: boolean, strength = 0.25, max = 8) {
  const active = useRef(false);

  const shouldRun = useCallback(() => {
    if (!enabled) return false;
    if (typeof window === "undefined") return false;
    if (!window.matchMedia("(pointer: fine)").matches) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return true;
  }, [enabled]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!shouldRun()) return;
      const el = e.currentTarget;
      if (!active.current) {
        active.current = true;
        el.style.transition = "transform 150ms var(--ease-brand)";
      }
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tx = Math.max(-max, Math.min(max, x * strength));
      const ty = Math.max(-max, Math.min(max, y * strength));
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    },
    [shouldRun, strength, max],
  );

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!active.current) return;
    active.current = false;
    e.currentTarget.style.transform = "";
  }, []);

  return { onMouseMove, onMouseLeave };
}
