"use client";

import { useMemo } from "react";
import { AdditiveBlending, CanvasTexture, SRGBColorSpace } from "three";

let cached: CanvasTexture | null = null;

/** One soft radial falloff, shared by every halo and every dust speck. */
export function getGlowTexture() {
  if (cached) return cached;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.22, "rgba(255,255,255,0.55)");
  g.addColorStop(0.55, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  cached = new CanvasTexture(canvas);
  cached.colorSpace = SRGBColorSpace;
  return cached;
}

/**
 * A billboarded additive sprite  the cheapest convincing bloom. Real
 * post-processing would add an EffectComposer to a route that is already
 * over the WebGL budget; layered additive halos get most of the look for
 * a texture and a draw call.
 */
export function Glow({
  color = "#22D3EE",
  scale = 1,
  opacity = 0.6,
  position,
}: {
  color?: string;
  scale?: number;
  opacity?: number;
  position?: [number, number, number];
}) {
  const map = useMemo(() => getGlowTexture(), []);
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}
