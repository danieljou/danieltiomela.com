"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";
import type { RefObject } from "react";
import { POINTS, stageT } from "./constants";

/** Stage 05  the pull-back. Named containers, not decoration. */
const CLUSTER_STAGE_T = stageT(4);
const CONTAINERS: { position: [number, number, number]; label: string }[] = [
  { position: [-0.5, 0.3, 0], label: "API" },
  { position: [0.5, 0.3, 0], label: "Worker" },
  { position: [0, -0.3, 0.4], label: "Database" },
  { position: [0, 0.3, -0.5], label: "Cache" },
];

/**
 * The one moment of agency in Act I: hover a container, its name surfaces
 * in the real HTML badge the parent renders (not a canvas-drawn label).
 */
export function ClusterReveal({
  progressRef,
  onHover,
}: {
  progressRef: RefObject<number>;
  onHover: (label: string | null) => void;
}) {
  const groupRef = useRef<Group>(null);
  const amount = useRef(0);

  useFrame(() => {
    const dist = Math.abs(progressRef.current - CLUSTER_STAGE_T);
    const target = dist < 0.15 ? 1 - dist / 0.15 : 0;
    amount.current += (target - amount.current) * 0.08;
    const group = groupRef.current;
    if (group) {
      group.visible = amount.current > 0.02;
      group.scale.setScalar(0.6 + amount.current * 0.4);
    }
  });

  // Cursor styling is a DOM side effect and belongs in an effect, not a
  // handler run during a render commit  Act1Canvas does it, keyed off the
  // same hover state this callback reports.
  function handleOver(e: ThreeEvent<PointerEvent>, label: string) {
    e.stopPropagation();
    onHover(label);
  }
  function handleOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    onHover(null);
  }

  return (
    <group ref={groupRef} position={POINTS[4]}>
      {CONTAINERS.map((c) => (
        <mesh
          key={c.label}
          position={c.position}
          onPointerOver={(e) => handleOver(e, c.label)}
          onPointerOut={handleOut}
        >
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial color="#2F6BFF" />
        </mesh>
      ))}
    </group>
  );
}
