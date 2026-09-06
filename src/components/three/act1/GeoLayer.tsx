"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, type Group, type LineBasicMaterial } from "three";
import type { RefObject } from "react";
import { POINTS, stageT } from "./constants";

const GRID_SIZE = 1.6;
const GRID_DIVISIONS = 6;
/** Stage 04  the only stage with a visual treatment of its own. */
const GEO_STAGE_T = stageT(3);

function buildGrid() {
  const points: number[] = [];
  const step = (GRID_SIZE * 2) / GRID_DIVISIONS;
  for (let i = 0; i <= GRID_DIVISIONS; i++) {
    const p = -GRID_SIZE + i * step;
    points.push(-GRID_SIZE, 0, p, GRID_SIZE, 0, p);
    points.push(p, 0, -GRID_SIZE, p, 0, GRID_SIZE);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  return geometry;
}

/** A handful of data points, appearing on the grid  not a real dataset. */
const DATA_POINTS: [number, number, number][] = [
  [-0.6, 0.02, -0.4],
  [0.3, 0.02, 0.5],
  [0.8, 0.02, -0.2],
  [-0.2, 0.02, 0.8],
];

export function GeoLayer({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<Group>(null);
  // Declarative JSX + a ref, not `new LineSegments(...)` mutated by hand:
  // React attaches `materialRef.current` itself after mount, so mutating it
  // inside useFrame is the same sanctioned pattern Nodes.tsx uses via
  // `mesh.material`  a ref written by our own render-time code (even a
  // lazy `if (!ref.current)` check) is what the immutability/refs lint
  // rules (React Compiler compatibility) block.
  const materialRef = useRef<LineBasicMaterial>(null);
  const geometry = useMemo(() => buildGrid(), []);
  const amount = useRef(0);

  useFrame(() => {
    const dist = Math.abs(progressRef.current - GEO_STAGE_T);
    const target = dist < 0.12 ? 1 - dist / 0.12 : 0;
    amount.current += (target - amount.current) * 0.1;
    if (materialRef.current) {
      materialRef.current.opacity = 0.5 * amount.current;
    }
    const group = groupRef.current;
    if (group) {
      group.visible = amount.current > 0.02;
      group.scale.setScalar(0.7 + amount.current * 0.3);
    }
  });

  return (
    <group ref={groupRef} position={POINTS[3]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial ref={materialRef} color="#22D3EE" transparent opacity={0.5} />
      </lineSegments>
      {DATA_POINTS.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}
