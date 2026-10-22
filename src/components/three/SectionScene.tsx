"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SceneVariant } from "./SectionSceneCanvas";

const SectionSceneCanvas = dynamic(() => import("./SectionSceneCanvas"), { ssr: false });

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
 * A WebGL stage behind one section. Same contract as the hero scene: never
 * in the first bundle, never requested unless the viewport is wide enough,
 * motion is allowed and WebGL exists, and the render loop only runs while
 * the section is on screen. When any of that fails the section simply keeps
 * its CSS 3D layers  there is no empty or broken state.
 */
export function SectionScene({
  variant = "tunnel",
  className,
}: {
  variant?: SceneVariant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      setEligible(!reduce && wide && supportsWebGL());
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !eligible) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        setActive(e.isIntersecting);
        // Mounted on first sight and kept: tearing a WebGL context down and
        // rebuilding it on every scroll past is far costlier than idling it.
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "100px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eligible]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        // Dissolve into the page at the section's top and bottom edges
        // instead of ending on a hard line.
        "[mask-image:linear-gradient(180deg,transparent,#000_16%,#000_84%,transparent)]",
        className,
      )}
    >
      {eligible && mounted && <SectionSceneCanvas variant={variant} active={active} />}
    </div>
  );
}
