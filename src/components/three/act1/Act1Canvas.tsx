"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/** Matches the `lg:top-24` on the sticky wrapper in StagePanels. */
const STICKY_TOP_OFFSET = 96;

const SystemJourneyCanvas = dynamic(() => import("./SystemJourneyCanvas"), {
  ssr: false,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Act I minimal, per the build order: camera on a curve, five nodes,
 * nothing else. Not pinned yet  it's a normal-flow illustration above the
 * stage cards, animating off Act I's own scroll fraction. The sticky,
 * full-viewport pin is a separate, deliberate pass once Acts II/III exist
 * to justify the engineering it needs (see ImmersiveSection's own note).
 *
 * Same gates as the hero scene: no canvas at all under reduced motion or
 * without WebGL  StagePanels' text is the only thing those visitors get,
 * and that was already true before this component existed.
 */
export function Act1Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [active, setActive] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const progress = useRef(0);

  // Progress synchronized to the sticky pin's actual active window, not a
  // generic "how far through the section" fraction: those two ranges
  // differ (the section includes header text the sticky container doesn't),
  // and using the wrong one meant the geospatial/cluster stages (progress
  // ~0.75/~1.0) were computed correctly but the canvas had already
  // unstuck and scrolled off-screen by the time progress reached them.
  useEffect(() => {
    function update() {
      const wrapper = document.getElementById("immersive-act-1-scene");
      const box = containerRef.current;
      if (!wrapper || !box) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const boxHeight = box.getBoundingClientRect().height;
      const total = wrapperRect.height - boxHeight;
      const scrolled = STICKY_TOP_OFFSET - wrapperRect.top;
      progress.current = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    document.body.style.cursor = hoverLabel ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoverLabel]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setEligible(!reduceMotion && supportsWebGL());
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!eligible) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eligible]);

  if (!eligible) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative mb-8 h-[42vh] w-full overflow-hidden rounded-xl border border-line bg-surface lg:mb-0 lg:h-[60vh]"
    >
      <SystemJourneyCanvas progressRef={progress} active={active} onHover={setHoverLabel} />
      {/* Real HTML, not a canvas-drawn label  hidden from assistive tech
          along with the rest of this decorative canvas (see the module
          note): Act I's text panels already carry every fact a keyboard or
          screen-reader visitor needs, hovering a container just surfaces it
          sooner for a mouse visitor exploring the scene. */}
      <div
        className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-line bg-bg/85 px-3 py-1.5 font-mono text-xs text-secondary-text transition-opacity duration-200"
        style={{ opacity: hoverLabel ? 1 : 0 }}
      >
        {hoverLabel}
      </div>
    </div>
  );
}
