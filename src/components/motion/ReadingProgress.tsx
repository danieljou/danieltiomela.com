"use client";

import { useEffect, useState } from "react";

/**
 * A direct readout of scroll position, not an animation  the fill tracks
 * the scrollbar 1:1 with no easing or transition, so there is nothing for
 * `prefers-reduced-motion` to need to stop.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-60 h-0.75 bg-line/40"
    >
      <div
        className="h-full origin-left grad-brand"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
