"use client";

import { useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";
import {
  CatmullRomCurve3,
  CylinderGeometry,
  AdditiveBlending,
  TubeGeometry,
  Vector3,
  type Group,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { getProject } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { ACT3_LAYOUT, HELIX, ORDERED_SLUGS, helixAngle, helixPoint } from "./constants";
import { Glow } from "../shared/Glow";
import { Edge } from "../shared/Edge";
import { ProjectObject } from "./ProjectObject";

const CAMERA_RADIUS = 5.4;
const FLOOR_Y = -1.15;
const BEAM = new CylinderGeometry(0.035, 0.035, 9, 12, 1, true);

/** The helix ribbon: the path through time that the screens sit on. */
function Ribbon({ count }: { count: number }) {
  const { core, sleeve } = useMemo(() => {
    const pts: Vector3[] = [];
    for (let c = -0.6; c <= count - 0.4; c += 0.06) {
      const [x, y, z] = helixPoint(c);
      pts.push(new Vector3(x, y - 0.55, z));
    }
    const curve = new CatmullRomCurve3(pts);
    return {
      core: new TubeGeometry(curve, 320, 0.012, 6, false),
      sleeve: new TubeGeometry(curve, 160, 0.06, 6, false),
    };
  }, [count]);

  return (
    <>
      <mesh geometry={sleeve}>
        <meshBasicMaterial color="#2F6BFF" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh geometry={core}>
        <meshBasicMaterial color="#67E8F9" transparent opacity={0.75} />
      </mesh>
    </>
  );
}

/** The column everything winds around, with a ring where each project joins it. */
function Column({ count }: { count: number }) {
  const rings = Array.from({ length: count }, (_, i) => i);
  const top = (count - 1) * HELIX.rise;
  return (
    <group>
      <mesh geometry={BEAM} position={[0, top / 2, 0]} scale={[1, (top + 3) / 9, 1]}>
        <meshBasicMaterial
          color="#67E8F9"
          transparent
          opacity={0.55}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={BEAM} position={[0, top / 2, 0]} scale={[5, (top + 3) / 9, 5]}>
        <meshBasicMaterial
          color="#2F6BFF"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {rings.map((i) => (
        <group key={i} position={[0, i * HELIX.rise - 0.55, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.01, 8, 48]} />
            <meshBasicMaterial color="#67E8F9" />
          </mesh>
          <Glow color="#22D3EE" scale={0.8} opacity={0.5} />
        </group>
      ))}
    </group>
  );
}

/** Concentric rings on the ground, slowly breathing outward  the ground plane
    that makes the helix a standing object rather than something in a void. */
function Ground() {
  const rings = useRef<(Group | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    rings.current.forEach((g, i) => {
      if (!g) return;
      const k = (t * 0.12 + i / 6) % 1;
      g.scale.setScalar(0.4 + k * 2.6);
    });
  });
  return (
    <group position={[0, FLOOR_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {Array.from({ length: 6 }, (_, i) => (
        <group
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
        >
          <mesh>
            <ringGeometry args={[2.0, 2.02, 96]} />
            <meshBasicMaterial color="#4C86FF" transparent opacity={0.35} depthWrite={false} />
          </mesh>
        </group>
      ))}
      <mesh>
        <ringGeometry args={[HELIX.radius - 0.02, HELIX.radius, 96]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.5} />
      </mesh>
      <Glow color="#2F6BFF" scale={9} opacity={0.22} />
    </group>
  );
}

/**
 * Orbits the helix: the camera sits outside the column at the angle of the
 * project nearest the scroll position and climbs with it, always looking
 * slightly inward at that project. Scrolling is therefore a slow spiral
 * walk up through the work, oldest to newest.
 */
function CameraRig({
  count,
  progress,
  active,
}: {
  count: number;
  progress: RefObject<number>;
  active: boolean;
}) {
  const displayed = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const sway = useRef({ x: 0, y: 0 });
  const target = useRef(new Vector3());
  const { camera, invalidate } = useThree();

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!active) return;
    displayed.current += (progress.current - displayed.current) * 0.05;
    const c = displayed.current * (count - 1);
    const a = helixAngle(c) + sway.current.x * 0.12;
    const y = c * HELIX.rise;
    sway.current.x += (pointer.current.x - sway.current.x) * 0.05;
    sway.current.y += (pointer.current.y - sway.current.y) * 0.05;
    camera.position.set(
      Math.cos(a) * CAMERA_RADIUS,
      y + 0.35 - sway.current.y * 0.3,
      Math.sin(a) * CAMERA_RADIUS,
    );
    target.current.set(Math.cos(a) * HELIX.radius * 0.5, y, Math.sin(a) * HELIX.radius * 0.5);
    camera.lookAt(target.current);
    invalidate();
  });

  return null;
}

export function ProjectOrbit({
  active,
  locale,
  progress,
  onHover,
  onSelect,
}: {
  active: boolean;
  locale: Locale;
  progress: RefObject<number>;
  onHover: (label: string | null) => void;
  onSelect: (index: number) => void;
}) {
  const slugs = ORDERED_SLUGS;

  return (
    <group>
      <Ground />
      <Ribbon count={slugs.length} />
      <Column count={slugs.length} />
      <CameraRig count={slugs.length} progress={progress} active={active} />
      {slugs.map((slug, i) => {
        const project = getProject(slug);
        if (!project) return null;
        const layout = ACT3_LAYOUT[slug];
        const position = helixPoint(i);
        const copy = project.i18n[locale];
        return (
          <group key={slug}>
            {/* Spoke from the column to the screen's foot. */}
            <Edge
              from={[0, position[1] - 0.55, 0]}
              to={[position[0], position[1] - 0.55, position[2]]}
              color="#2F6BFF"
              opacity={0.6}
            />
            <ProjectObject
              position={position}
              angle={helixAngle(i)}
              kind={layout.kind}
              slug={slug}
              name={copy.name}
              stack={project.stack}
              href={`/${locale}/projects/${slug}`}
              onHover={onHover}
              onSelect={onSelect}
              label={`${copy.name} · ${project.year} · ${project.role}`}
              active={active}
              bobOffset={i * 1.7}
              progress={progress}
              orderIndex={i}
              total={slugs.length}
            />
          </group>
        );
      })}
    </group>
  );
}
