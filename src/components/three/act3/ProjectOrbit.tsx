"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import {
  BufferGeometry,
  CatmullRomCurve3,
  Line as ThreeLine,
  LineBasicMaterial,
  Vector3,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { getProject } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { ACT3_LAYOUT, ORDERED_SLUGS, TIMELINE_END, TIMELINE_START, timelineZ } from "./constants";
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

/** Chase-cam offset, same idea as Act I's Journey: sit above and behind the
    curve so the camera looks at each project rather than starting inside it. */
const CAMERA_OFFSET = new Vector3(0, 0.35, 1.5);

/**
 * Flies the camera along the same chronological path the objects are laid
 * out on, one project at a time, mirroring Act I's stage-by-stage Journey
 * rather than leaving Act III a single static wide shot.
 */
function CameraJourney({
  positions,
  progress,
  active,
}: {
  positions: Vector3[];
  progress: RefObject<number>;
  active: boolean;
}) {
  const curve = useMemo(() => new CatmullRomCurve3(positions), [positions]);
  const displayed = useRef(0);
  const { camera, invalidate } = useThree();
  const lookTarget = useRef(new Vector3());

  useFrame(() => {
    if (!active) return;
    displayed.current += (progress.current - displayed.current) * 0.06;
    const t = Math.min(0.999, Math.max(0, displayed.current));
    const point = curve.getPointAt(t);
    const ahead = curve.getPointAt(Math.min(0.999, t + 0.05));
    camera.position.copy(point).add(CAMERA_OFFSET);
    lookTarget.current.copy(ahead);
    camera.lookAt(lookTarget.current);
    invalidate();
  });

  return null;
}

export function ProjectOrbit({
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
  const slugs = ORDERED_SLUGS;

  const positions = useMemo(
    () =>
      slugs.map((slug, i) => {
        const layout = ACT3_LAYOUT[slug];
        const angle = ORBIT_ANGLES[i % ORBIT_ANGLES.length];
        const radius = ORBIT_RADII[i % ORBIT_RADII.length];
        return new Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.4,
          timelineZ(layout.t),
        );
      }),
    [slugs],
  );

  return (
    <group>
      <TimelineAxis />
      <CameraJourney positions={positions} progress={progress} active={active} />
      {slugs.map((slug, i) => {
        const project = getProject(slug);
        if (!project) return null;
        const layout = ACT3_LAYOUT[slug];
        const position = positions[i];
        const copy = project.i18n[locale];
        return (
          <ProjectObject
            key={slug}
            position={[position.x, position.y, position.z]}
            kind={layout.kind}
            slug={slug}
            name={copy.name}
            stack={project.stack}
            href={`/${locale}/projects/${slug}`}
            onHover={onHover}
            label={`${copy.name} · ${project.year} · ${project.role}`}
            active={active}
            bobOffset={i * 1.7}
            progress={progress}
            orderIndex={i}
            total={slugs.length}
          />
        );
      })}
    </group>
  );
}
