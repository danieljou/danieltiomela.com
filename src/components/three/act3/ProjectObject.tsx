"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import {
  DoubleSide,
  EdgesGeometry,
  PlaneGeometry,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import type { ObjectKind } from "./constants";
import { Glow } from "../shared/Glow";
import { useHoverCursor } from "../shared/interact";
import { createProjectTexture } from "./projectTexture";

const SCREEN_W = 1.34;
const SCREEN_H = 0.84;
const SCREEN_EDGES = new EdgesGeometry(new PlaneGeometry(SCREEN_W + 0.06, SCREEN_H + 0.06));

/** A floating "screen" showing the project's own dashboard/map/ops mockup
    rather than an abstract shape  see projectTexture.ts for why this isn't
    a real screenshot. The bezel is double-sided so, seen from the far side of
    the helix, the screen reads as a dark slab rather than disappearing. */
function Screen({ kind, slug, name, stack }: { kind: ObjectKind; slug: string; name: string; stack: string[] }) {
  const texture = useMemo(
    () => createProjectTexture({ slug, name, kind, stack }),
    [slug, name, kind, stack],
  );

  return (
    <group>
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[SCREEN_W + 0.1, SCREEN_H + 0.1]} />
        <meshBasicMaterial color="#060a14" side={DoubleSide} />
      </mesh>
      <lineSegments geometry={SCREEN_EDGES} position={[0, 0, 0.004]}>
        <lineBasicMaterial color="#67E8F9" transparent opacity={0.75} />
      </lineSegments>
      <mesh>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#2F6BFF" />
        )}
      </mesh>
    </group>
  );
}

/**
 * One project on the helix. It faces straight out from the column, so the
 * camera orbiting at the current project's angle always meets it head-on,
 * while the others are seen at an angle  that obliquity is what makes the
 * helix read as a physical object. The one nearest the scroll position swells
 * and lights up, echoing Act I's stage-by-stage emphasis.
 */
export function ProjectObject({
  position,
  angle,
  kind,
  slug,
  name,
  stack,
  href,
  onHover,
  onSelect,
  label,
  active,
  bobOffset,
  progress,
  orderIndex,
  total,
}: {
  position: [number, number, number];
  /** Angle around the column, radians  sets which way the screen faces. */
  angle: number;
  kind: ObjectKind;
  slug: string;
  name: string;
  stack: string[];
  href: string;
  onHover: (label: string | null) => void;
  /** Called instead of navigating when this isn't the focused project. */
  onSelect?: (index: number) => void;
  label: string;
  active: boolean;
  bobOffset: number;
  /** Act III's own 0-1 scroll progress  drives sequenced emphasis below. */
  progress: RefObject<number>;
  orderIndex: number;
  total: number;
}) {
  const bobRef = useRef<Group>(null);
  const scaleRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const haloRef = useRef<Group>(null);
  const hoverAmount = useRef(0);
  const targetHover = useRef(0);
  const router = useRouter();
  const { invalidate } = useThree();
  const cursor = useHoverCursor();

  function handleOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    targetHover.current = 1;
    cursor.over();
    onHover(label);
  }
  function handleOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    targetHover.current = 0;
    cursor.out();
    onHover(null);
  }
  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    // The focused project opens; any other one is first brought into focus.
    const focused = Math.abs(progress.current * (total - 1) - orderIndex) < 0.5;
    if (focused || !onSelect) router.push(href);
    else onSelect(orderIndex);
  }

  useFrame((state) => {
    if (!active) return;
    const bob = bobRef.current;
    if (bob) bob.position.y = Math.sin(state.clock.elapsedTime * 0.6 + bobOffset) * 0.05;

    const continuousIndex = progress.current * (total - 1);
    const sequenceEmphasis = Math.max(0, 1 - Math.abs(continuousIndex - orderIndex));
    const target = Math.max(targetHover.current, sequenceEmphasis);
    hoverAmount.current += (target - hoverAmount.current) * 0.12;
    const h = hoverAmount.current;

    scaleRef.current?.scale.setScalar(0.82 + h * 0.3);
    const glow = glowRef.current;
    if (glow) (glow.material as MeshBasicMaterial).opacity = h * 0.14;
    haloRef.current?.scale.setScalar(1 + h * 0.5);
    invalidate();
  });

  return (
    <group position={position} rotation={[0, Math.PI / 2 - angle, 0]}>
      <group ref={bobRef} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <group ref={haloRef}>
          <Glow color="#2F6BFF" scale={3.4} opacity={0.3} position={[0, 0, -0.1]} />
        </group>
        <mesh ref={glowRef} position={[0, 0, -0.04]}>
          <planeGeometry args={[SCREEN_W + 0.4, SCREEN_H + 0.4]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0} />
        </mesh>
        <group ref={scaleRef}>
          <Screen kind={kind} slug={slug} name={name} stack={stack} />
        </group>
      </group>
    </group>
  );
}
