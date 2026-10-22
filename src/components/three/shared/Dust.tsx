"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PointsMaterial,
  type Points,
} from "three";
import { getGlowTexture } from "./Glow";

/** Deterministic, so SSR/HMR/StrictMode never disagree about where dust is. */
export function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A volume of drifting light specks  what makes empty space read as space. */
export function Dust({
  count = 400,
  size = [8, 4, 8],
  center = [0, 0, 0],
  color = "#67E8F9",
  px = 0.05,
  opacity = 0.7,
  drift = 0.01,
  seed = 7,
}: {
  count?: number;
  size?: [number, number, number];
  center?: [number, number, number];
  color?: string;
  px?: number;
  opacity?: number;
  drift?: number;
  seed?: number;
}) {
  const ref = useRef<Points>(null);
  const points = useMemo(() => {
    const r = rng(seed);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * size[0];
      pos[i * 3 + 1] = (r() - 0.5) * size[1];
      pos[i * 3 + 2] = (r() - 0.5) * size[2];
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    const m = new PointsMaterial({
      color,
      size: px,
      map: getGlowTexture(),
      transparent: true,
      opacity,
      blending: AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    return { g, m };
  }, [count, size, color, px, opacity, seed]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * drift;
  });

  return (
    <points ref={ref} position={center} geometry={points.g} material={points.m} />
  );
}
