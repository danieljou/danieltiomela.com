"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { BackSide, type Group } from "three";
import { GLOBE_RADIUS } from "./constants";
import { createEarthTexture } from "./worldTexture";

const MAX_TILT = 1.1; // radians, ~63  clamped so a vertical drag can't flip the globe upside down

/**
 * Full trackball: drag horizontally to spin, vertically to tilt. Tilt is
 * clamped (not a free X rotation) so a fast vertical drag can't flip the
 * globe past its pole and read as broken. Slow ambient auto-rotation on Y
 * resumes once drag inertia has settled on both axes.
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
  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const tilt = useRef(0);
  const { invalidate } = useThree();
  const texture = useMemo(() => createEarthTexture(), []);

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e: ThreeEvent<PointerEvent>) {
    if (!dragging.current || !groupRef.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    const rotY = dx * 0.006;
    const rotX = dy * 0.006;
    groupRef.current.rotation.y += rotY;
    tilt.current = Math.max(-MAX_TILT, Math.min(MAX_TILT, tilt.current + rotX));
    groupRef.current.rotation.x = tilt.current;
    velocity.current = { x: rotX, y: rotY };
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
      velocity.current.x *= 0.94;
      velocity.current.y *= 0.94;
      if (Math.abs(velocity.current.y) < 0.0006) {
        velocity.current.y = 0.0015; // ambient auto-rotation, Y only
      }
      groupRef.current.rotation.y += velocity.current.y;
      tilt.current = Math.max(
        -MAX_TILT,
        Math.min(MAX_TILT, tilt.current + velocity.current.x),
      );
      groupRef.current.rotation.x = tilt.current;
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
        <sphereGeometry args={[GLOBE_RADIUS, 48, 32]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
        ) : (
          <meshBasicMaterial color="#2F6BFF" wireframe transparent opacity={0.35} />
        )}
      </mesh>

      {/* Atmosphere  a "poor man's fresnel": a slightly larger backside-only
          shell reads as a soft glow at the silhouette without a custom shader. */}
      <mesh scale={1.06}>
        <sphereGeometry args={[GLOBE_RADIUS, 32, 24]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.18} side={BackSide} />
      </mesh>

      {children}
    </group>
  );
}
