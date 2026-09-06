"use client";

import { useMemo } from "react";
import { BufferGeometry, Line as ThreeLine, LineBasicMaterial, Vector3 } from "three";

/**
 * A real `THREE.Line`, mounted via `<primitive>`  not the `<threeLine>` JSX
 * tag. That tag exists in fiber's TypeScript types but fiber's runtime
 * element registry doesn't resolve it to `THREE.Line`, so it throws at
 * render time despite type-checking cleanly (see the hero scene's own note).
 */
export function Edge({
  from,
  to,
  color = "#2D3F66",
  opacity = 0.6,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  opacity?: number;
}) {
  const line = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(...from),
      new Vector3(...to),
    ]);
    const material = new LineBasicMaterial({ color, transparent: true, opacity });
    return new ThreeLine(geometry, material);
  }, [from, to, color, opacity]);

  return <primitive object={line} />;
}
