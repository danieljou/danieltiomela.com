"use client";

import { useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

/** A receding grid  the single strongest depth cue in a flythrough. */
export function Floor({
  y = -1.3,
  x = [-7, 7],
  z = [-9, 7],
  step = 0.9,
  color = "#2F6BFF",
  opacity = 0.28,
}: {
  y?: number;
  x?: [number, number];
  z?: [number, number];
  step?: number;
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    for (let px = x[0]; px <= x[1] + 1e-6; px += step) pts.push(px, y, z[0], px, y, z[1]);
    for (let pz = z[0]; pz <= z[1] + 1e-6; pz += step) pts.push(x[0], y, pz, x[1], y, pz);
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, [x, z, y, step]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}
