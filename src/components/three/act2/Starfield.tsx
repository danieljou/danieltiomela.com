"use client";

import { useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";

const STAR_COUNT = 600;
const RADIUS = 12;

/**
 * Computed once at module load, not inside the component: `Math.random`
 * is an impure call, and the render-purity lint rule (React Compiler
 * compatibility) flags impure calls made during render, including inside a
 * `useMemo` initializer. Module scope runs once, well before any render.
 */
const STAR_POSITIONS = (() => {
  const positions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = RADIUS * (0.8 + Math.random() * 0.4);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
})();

/** A static backdrop, not an ambient animation  it never needs its own frame. */
export function Starfield() {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(STAR_POSITIONS, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#8da0c0" size={0.03} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}
