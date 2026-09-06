/**
 * Real dates from `projects.ts`, converted to a decimal-year timeline
 * position  not invented, just re-expressed for placement along a depth
 * axis. `kind` drives which shape each project renders as (see
 * ProjectObject): a geospatial system is a mesh, an infrastructure role is
 * stacked containers, everything else is a layered surface.
 */
export const TIMELINE_START = 2021; // career start (AL-INFOTECH)  a reference point, not itself plotted
export const TIMELINE_END = 2026.7; // ~now

export type ObjectKind = "web" | "infra" | "geo";

export const ACT3_LAYOUT: Record<string, { t: number; kind: ObjectKind }> = {
  "regional-digital-observatory": { t: 2024.55, kind: "web" },
  "municipal-revenue-system": { t: 2024.85, kind: "web" },
  "gis-geodata-infrastructure": { t: 2025.05, kind: "geo" },
  "real-estate-platform-infrastructure": { t: 2025.7, kind: "infra" },
  "giz-observatory-phase-2": { t: 2025.95, kind: "geo" },
  immotic: { t: 2026.2, kind: "web" },
  "passage-canada": { t: 2026.3, kind: "web" },
};

const DEPTH_SPAN = 5; // world units, timeline start to end

export function timelineZ(t: number) {
  const frac = (t - TIMELINE_START) / (TIMELINE_END - TIMELINE_START);
  return DEPTH_SPAN / 2 - frac * DEPTH_SPAN;
}
