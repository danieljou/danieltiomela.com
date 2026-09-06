"use client";

import dynamic from "next/dynamic";
import { LiveClock } from "../shared/LiveClock";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), { ssr: false });

/**
 * Pure presentation: eligibility, the render-loop on/off state, and which
 * act is current are all owned once by `ImmersiveExperience`. This just
 * fills whatever box it's given  the globe itself is still draggable
 * (that's local pointer state inside Globe.tsx, not scroll-driven).
 */
export function Act2Canvas({
  active,
  clockLabel,
  missionLabels,
  onHover,
}: {
  active: boolean;
  clockLabel: string;
  missionLabels: string[];
  onHover: (label: string | null) => void;
}) {
  return (
    <div className="absolute inset-0">
      <GlobeCanvas active={active} onHover={onHover} missionLabels={missionLabels} />
      <LiveClock label={clockLabel} className="absolute right-4 top-4 text-right sm:right-6 sm:top-6" />
    </div>
  );
}
