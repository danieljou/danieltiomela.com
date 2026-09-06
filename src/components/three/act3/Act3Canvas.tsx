"use client";

import dynamic from "next/dynamic";
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
  onHover,
}: {
  active: boolean;
  locale: Locale;
  onHover: (label: string | null) => void;
}) {
  return (
    <div className="absolute inset-0">
      <OrbitCanvas active={active} locale={locale} onHover={onHover} />
    </div>
  );
}
