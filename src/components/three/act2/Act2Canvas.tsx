"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LiveClock } from "../shared/LiveClock";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

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
 * The globe: draggable (mouse or touch), slow ambient auto-rotation,
 * mission arcs to real delivery locations. Same gates as Act I  no canvas
 * at all under reduced motion or without WebGL, and the render loop only
 * runs while this box is actually on screen.
 */
export function Act2Canvas({
  clockLabel,
  missionLabels,
}: {
  clockLabel: string;
  missionLabels: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [active, setActive] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

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
    document.body.style.cursor = hoverLabel ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoverLabel]);

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
      className="relative mb-8 h-[50vh] w-full overflow-hidden rounded-xl border border-line bg-surface touch-none"
    >
      <GlobeCanvas active={active} onHover={setHoverLabel} missionLabels={missionLabels} />

      <LiveClock label={clockLabel} className="absolute right-3 top-3 text-right" />

      {/* Real HTML label, not canvas-drawn  see Act I's cluster note on why
          this stays out of the accessibility tree along with the rest of
          the decorative canvas. */}
      <div
        className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-line bg-bg/85 px-3 py-1.5 font-mono text-xs text-secondary-text transition-opacity duration-200"
        style={{ opacity: hoverLabel ? 1 : 0 }}
      >
        {hoverLabel}
      </div>
    </div>
  );
}
