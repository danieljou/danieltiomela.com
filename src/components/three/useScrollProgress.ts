"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Progress through a tall section, 0 to 1. Stored in a ref, never React
 * state  this is meant to be read inside a `useFrame` or rAF loop once the
 * section has a pinned canvas driving off it; a `setState` per scroll frame
 * is the first cause of jank in that kind of scroll-driven scene.
 *
 * Not wired to the pinned/cross-fade presentation yet (see ImmersiveSection):
 * that lands with the actual camera/canvas work. Kept here now because nothing
 * about this hook is 3D-specific  it's the same primitive the eventual
 * `useFrame` consumer will need, so it doesn't need reworking later.
 */
export function useScrollProgress(sectionRef: RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    function update() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      progress.current = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return progress;
}
