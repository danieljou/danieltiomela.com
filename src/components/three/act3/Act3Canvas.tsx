"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import type { Locale } from "@/lib/i18n";

const OrbitCanvas = dynamic(() => import("./OrbitCanvas"), { ssr: false });

/**
 * Pure presentation: eligibility and the render-loop on/off state are
 * owned once by `ImmersiveExperience`. Click-to-navigate lives inside
 * ProjectObject.tsx and is unaffected by this simplification.
 */
export function Act3Canvas({
  active,
  locale,
  progress,
  onHover,
}: {
  active: boolean;
  locale: Locale;
  progress: RefObject<number>;
  onHover: (label: string | null) => void;
}) {
  return (
    <div className="absolute inset-0">
      <OrbitCanvas active={active} locale={locale} progress={progress} onHover={onHover} />
    </div>
  );
}
