"use client";

import { useMemo } from "react";
import { BufferGeometry, Line as ThreeLine, LineBasicMaterial, Vector3 } from "three";
import { getProject } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { ACT3_LAYOUT, TIMELINE_END, TIMELINE_START, timelineZ } from "./constants";
import { ProjectObject } from "./ProjectObject";

/** A visual spine, not a moving element  it's the fixed reference the
    projects are positioned against, so it doesn't rotate or bob. */
function TimelineAxis() {
  const line = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 0, timelineZ(TIMELINE_START)),
      new Vector3(0, 0, timelineZ(TIMELINE_END)),
    ]);
    const material = new LineBasicMaterial({ color: "#2D3F66", transparent: true, opacity: 0.5 });
    return new ThreeLine(geometry, material);
  }, []);

  return <primitive object={line} />;
}

const ORBIT_RADII = [0.9, 1.1, 0.8, 1.0, 0.9, 1.05, 0.85];
const ORBIT_ANGLES = [0.3, 1.6, 2.8, 4.0, 5.1, 0.9, 3.4];

export function ProjectOrbit({
  active,
  locale,
  onHover,
}: {
  active: boolean;
  locale: Locale;
  onHover: (label: string | null) => void;
}) {
  const slugs = Object.keys(ACT3_LAYOUT);

  return (
    <group>
      <TimelineAxis />
      {slugs.map((slug, i) => {
        const project = getProject(slug);
        if (!project) return null;
        const layout = ACT3_LAYOUT[slug];
        const angle = ORBIT_ANGLES[i % ORBIT_ANGLES.length];
        const radius = ORBIT_RADII[i % ORBIT_RADII.length];
        const position: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.4,
          timelineZ(layout.t),
        ];
        const copy = project.i18n[locale];
        return (
          <ProjectObject
            key={slug}
            position={position}
            kind={layout.kind}
            href={`/${locale}/projects/${slug}`}
            onHover={onHover}
            label={`${copy.name} · ${project.year} · ${project.role}`}
            active={active}
            bobOffset={i * 1.7}
          />
        );
      })}
    </group>
  );
}
