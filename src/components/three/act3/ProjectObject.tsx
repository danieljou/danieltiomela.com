"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import type { ObjectKind } from "./constants";

/** Shape reflects what the project actually is, not a generic marker. */
function Shape({ kind }: { kind: ObjectKind }) {
  if (kind === "infra") {
    return (
      <>
        <mesh position={[-0.14, 0.1, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshBasicMaterial color="#2F6BFF" />
        </mesh>
        <mesh position={[0.14, 0, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshBasicMaterial color="#2F6BFF" />
        </mesh>
        <mesh position={[0, -0.14, 0.1]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshBasicMaterial color="#2F6BFF" />
        </mesh>
      </>
    );
  }
  if (kind === "geo") {
    return (
      <mesh>
        <icosahedronGeometry args={[0.24, 0]} />
        <meshBasicMaterial color="#2F6BFF" wireframe />
      </mesh>
    );
  }
  return (
    <>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.28]} />
        <meshBasicMaterial color="#2F6BFF" />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[0.32, 0.04, 0.22]} />
        <meshBasicMaterial color="#4C86FF" />
      </mesh>
    </>
  );
}

export function ProjectObject({
  position,
  kind,
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
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0} />
      </mesh>
      <group ref={scaleRef}>
        <Shape kind={kind} />
      </group>
    </group>
  );
}
