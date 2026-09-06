"use client";

import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import type { ObjectKind } from "./constants";
import { createProjectTexture } from "./projectTexture";

const SCREEN_W = 0.56;
const SCREEN_H = 0.35;

/** A floating "screen" showing the project's own dashboard/map/ops mockup
    rather than an abstract shape  see projectTexture.ts for why this isn't
    a real screenshot. A thin bezel behind the plane reads as a device, not
    a flat card pasted in space. */
function Screen({ kind, slug, name, stack }: { kind: ObjectKind; slug: string; name: string; stack: string[] }) {
  const texture = useMemo(
    () => createProjectTexture({ slug, name, kind, stack }),
    [slug, name, kind, stack],
  );

  return (
    <group>
      <mesh position={[0, 0, -0.008]}>
        <planeGeometry args={[SCREEN_W + 0.04, SCREEN_H + 0.04]} />
        <meshBasicMaterial color="#060a14" />
      </mesh>
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

export function ProjectObject({
  position,
  kind,
  slug,
  name,
  stack,
  href,
  onHover,
  label,
  active,
  bobOffset,
  progress,
  orderIndex,
  total,
}: {
  position: [number, number, number];
  kind: ObjectKind;
  slug: string;
  name: string;
  stack: string[];
  href: string;
  onHover: (label: string | null) => void;
  label: string;
  active: boolean;
  bobOffset: number;
  /** Act III's own 0-1 scroll progress  drives sequenced emphasis below. */
  progress: RefObject<number>;
  orderIndex: number;
  total: number;
}) {
  const rootRef = useRef<Group>(null);
  const scaleRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const hoverAmount = useRef(0);
  const targetHover = useRef(0);
  const router = useRouter();
  const { invalidate } = useThree();

  function handleOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    targetHover.current = 1;
    onHover(label);
  }
  function handleOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    targetHover.current = 0;
    onHover(null);
  }
  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    router.push(href);
  }

  useFrame((state) => {
    if (!active) return;
    const root = rootRef.current;
    if (root) {
      root.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + bobOffset) * 0.08;
      // Billboard  the screen always faces the flythrough camera, so the
      // mockup stays legible instead of edge-on as the camera moves past it.
      root.quaternion.copy(state.camera.quaternion);
    }
    // The project nearest the current scroll position along the timeline
    // reads as "current" even without a hover, echoing Act I's stage-by-
    // stage reveal instead of leaving every project equally emphasised.
    const continuousIndex = progress.current * (total - 1);
    const sequenceEmphasis = Math.max(0, 1 - Math.abs(continuousIndex - orderIndex));
    const target = Math.max(targetHover.current, sequenceEmphasis);
    hoverAmount.current += (target - hoverAmount.current) * 0.15;
    const scaleGroup = scaleRef.current;
    if (scaleGroup) {
      scaleGroup.scale.setScalar(1 + hoverAmount.current * 0.35);
    }
    const glow = glowRef.current;
    if (glow) {
      (glow.material as MeshBasicMaterial).opacity = hoverAmount.current * 0.35;
    }
    invalidate();
  });

  return (
    <group
      ref={rootRef}
      position={position}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
      onClick={handleClick}
    >
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <planeGeometry args={[SCREEN_W + 0.18, SCREEN_H + 0.18]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0} />
      </mesh>
      <group ref={scaleRef}>
        <Screen kind={kind} slug={slug} name={name} stack={stack} />
      </group>
    </group>
  );
}
