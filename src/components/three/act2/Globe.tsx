"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";
import { GLOBE_RADIUS } from "./constants";

/**
 * Rotates on Y only  a full trackball (X and Y) risks a disorienting flip
 * mid-drag for very little added value here. Slow ambient auto-rotation
 * resumes once drag inertia has settled; both are the same rotation.y
 * mutation, so there's nothing to reconcile between "user-driven" and
 * "ambient" states.
 */
export function Globe({
  active,
  children,
}: {
  active: boolean;
  children?: React.ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const { invalidate } = useThree();

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    dragging.current = true;
    lastX.current = e.clientX;
  }
  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging.current || !groupRef.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const rot = dx * 0.006;
    groupRef.current.rotation.y += rot;
    velocity.current = rot;
    invalidate();
  }
  function endDrag() {
    dragging.current = false;
  }

  // Safety net: release the drag even if pointerup fires outside the canvas.
  useEffect(() => {
    window.addEventListener("pointerup", endDrag);
    return () => window.removeEventListener("pointerup", endDrag);
  }, []);

  useFrame(() => {
    if (!active || !groupRef.current) return;
    if (!dragging.current) {
      velocity.current *= 0.94;
      if (Math.abs(velocity.current) < 0.0006) {
        velocity.current = 0.0015;
      }
      groupRef.current.rotation.y += velocity.current;
    }
    invalidate();
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
    >
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 24, 18]} />
        <meshBasicMaterial color="#2F6BFF" wireframe transparent opacity={0.35} />
      </mesh>
      {children}
    </group>
  );
}
