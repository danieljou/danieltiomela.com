"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

const OrbitCanvas = dynamic(() => import("./OrbitCanvas"), { ssr: false });

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
 * The one place the canvas is real navigation, not decoration: clicking a
 * project navigates to its case study, same as the real HTML cards in
 * StagePanels below it. Those cards remain the only way a keyboard visitor
 * reaches the same pages  this canvas stays `aria-hidden`, matching every
 * other scene in this section.
 */
export function Act3Canvas({ locale }: { locale: Locale }) {
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
      className="relative mb-8 h-[50vh] w-full overflow-hidden rounded-xl border border-line bg-surface"
    >
      <OrbitCanvas active={active} locale={locale} onHover={setHoverLabel} />
      <div
        className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-line bg-bg/85 px-3 py-1.5 font-mono text-xs text-secondary-text transition-opacity duration-200"
        style={{ opacity: hoverLabel ? 1 : 0 }}
      >
        {hoverLabel}
      </div>
    </div>
  );
}
