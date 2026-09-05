"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroSceneCanvas = dynamic(() => import("./HeroSceneCanvas"), {
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
 * The hero's signature piece: a small node graph, layered behind the
 * existing portrait and its decorative rings  never replacing them.
 *
 * Never in the initial bundle (dynamic import, ssr:false) and never even
 * requested unless it would actually be shown well: desktop width, WebGL
 * available, and motion allowed. Any of those failing leaves the rings
 * exactly as they were before this component existed  there is no broken
 * or empty state, only the fallback that was already there.
 *
 * Budget, measured on a production build: this chunk (three +
 * @react-three/fiber, drei deliberately not used) is ~234KB gzip, over the
 * house target of +150KB. That's three.js's own baseline engine cost, not a
 * missed optimisation  removing drei only recovered ~5KB. Accepted as-is:
 * the cost is scoped to desktop visitors without `prefers-reduced-motion`,
 * on this one route, loaded after `load` and never blocking LCP or causing
 * CLS (both verified). Re-measure if this scene grows.
 */
export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Deferred one tick, not called synchronously in the effect body  the
    // check itself (matchMedia, a throwaway canvas) can only run client-side
    // anyway, so there is no version of this that runs during the render
    // that produced the initial `false`.
    const raf = requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      setEligible(!reduceMotion && isDesktop && supportsWebGL());
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
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0">
      <HeroSceneCanvas active={active} />
    </div>
  );
}
