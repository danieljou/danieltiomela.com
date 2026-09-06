"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Mesh, MeshBasicMaterial } from "three";
import type { RefObject } from "react";
import { POINTS, stageT } from "./constants";

const ACTIVE_COLOR = new Color("#22D3EE");
const IDLE_COLOR = new Color("#2F6BFF");

function Node({
  position,
  target,
  progressRef,
}: {
  position: [number, number, number];
  target: number;
  progressRef: RefObject<number>;
}) {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dist = Math.abs(progressRef.current - target);
    const isActive = dist < 0.1;
    const targetScale = isActive ? 1.5 : 1;
    mesh.scale.setScalar(mesh.scale.x + (targetScale - mesh.scale.x) * 0.1);
    const material = mesh.material as MeshBasicMaterial;
    material.color.lerp(isActive ? ACTIVE_COLOR : IDLE_COLOR, 0.08);
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshBasicMaterial color={IDLE_COLOR} />
    </mesh>
  );
}

export function Nodes({ progressRef }: { progressRef: RefObject<number> }) {
  return (
    <group>
      {POINTS.map((p, i) => (
        <Node key={i} position={p} target={stageT(i)} progressRef={progressRef} />
      ))}
    </group>
  );
}
