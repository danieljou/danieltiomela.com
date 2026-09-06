"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";

const SystemJourneyCanvas = dynamic(() => import("./SystemJourneyCanvas"), {
  ssr: false,
});

/**
 * Pure presentation now: eligibility (reduced motion / WebGL), the render
 * loop's on/off state, and scroll progress are all owned once by
 * `ImmersiveExperience` for the whole three-act experience, not
 * re-implemented per act. This just fills whatever box it's given.
 */
export function Act1Canvas({
  active,
  progress,
  onHover,
}: {
  active: boolean;
  progress: RefObject<number>;
  onHover: (label: string | null) => void;
}) {
  return (
    <div className="absolute inset-0">
      <SystemJourneyCanvas progressRef={progress} active={active} onHover={onHover} />
    </div>
  );
}
