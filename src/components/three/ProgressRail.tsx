"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/content/types";
import { IMMERSIVE_ACT_IDS } from "./acts";

/**
 * Always visible while the section is on screen  the visitor should never
 * wonder if there's more, and can jump to any act without scrolling through
 * the others. Real anchor links, not scroll-hijack: keyboard and
 * find-in-page both work normally.
 */
export function ProgressRail({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = IMMERSIVE_ACT_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        const idx = IMMERSIVE_ACT_IDS.indexOf(
          topMost.target.id as (typeof IMMERSIVE_ACT_IDS)[number],
        );
        if (idx >= 0) setActive(idx);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const labels = [dict.immersive.rail.act1, dict.immersive.rail.act2, dict.immersive.rail.act3];

  return (
    <nav
      aria-label={dict.immersive.progressLabel}
      className="sticky top-16 z-30 -mx-1 mb-10 flex gap-2 overflow-x-auto bg-bg/85 px-1 py-3 backdrop-blur-sm sm:top-20"
    >
      {IMMERSIVE_ACT_IDS.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === i ? "true" : undefined}
          className={cn(
            "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm transition-colors duration-200",
            active === i
              ? "border-secondary/50 bg-secondary/10 text-secondary-text"
              : "border-line text-muted hover:text-text",
          )}
        >
          <span className="font-mono text-xs tabular-nums" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          {labels[i]}
        </a>
      ))}
    </nav>
  );
}
