"use client";

import { useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry } from "three";
import { Glow, getGlowTexture } from "../shared/Glow";

const STAR_COUNT = 700;
const RADIUS = 14;

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
    const r = RADIUS * (0.7 + Math.random() * 0.5);
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
  const map = useMemo(() => getGlowTexture(), []);

  return (
    <>
      <points geometry={geometry}>
        <pointsMaterial
          map={map}
          color="#cfe3ff"
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {/* Two far-off colour washes so the void isn't one flat navy. */}
      <Glow color="#2F6BFF" scale={14} opacity={0.16} position={[-5, 2, -9]} />
      <Glow color="#7C5CFF" scale={12} opacity={0.14} position={[6, -2, -10]} />
    </>
  );
}
