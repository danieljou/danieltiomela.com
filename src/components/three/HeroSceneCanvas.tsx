"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  Line as ThreeLine,
  LineBasicMaterial,
  Vector3,
  type Group,
} from "three";

/**
 * A plain segment, not `@react-three/drei`'s `<Line>`  drei alone added
 * ~90KB gzip to this route for one helper, blowing the 150KB budget. Raw
 * three/fiber primitives (already paid for) do the same job for free.
 *
 * Built as a real `THREE.Line` and mounted via `<primitive>`, not the
 * `<threeLine>` JSX tag: that tag exists in fiber's TypeScript types but
 * fiber's runtime element registry doesn't resolve it to `THREE.Line`,
 * so it throws at render time despite type-checking cleanly.
 */
function Edge({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const line = useMemo(() => {
    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(...from),
      new Vector3(...to),
    ]);
    const material = new LineBasicMaterial({
      color: "#2D3F66",
      transparent: true,
      opacity: 0.7,
    });
    return new ThreeLine(geometry, material);
  }, [from, to]);

  return <primitive object={line} />;
}

/** A loose service-mesh cluster  nodes and the edges between them, nothing more. */
const NODES: [number, number, number][] = [
  [-1.1, 0.6, 0],
  [0.3, 1.0, -0.4],
  [1.2, 0.4, 0.3],
  [-0.6, -0.3, 0.5],
  [0.6, -0.6, -0.2],
  [1.4, -0.5, 0.4],
  [-1.3, -1.0, -0.3],
  [0, 0.05, 0],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [1, 7],
  [7, 3],
  [7, 4],
  [2, 5],
  [0, 6],
  [6, 3],
  [7, 2],
];

function Graph({ active }: { active: boolean }) {
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  // Tracked independently of R3F's own pointer state, which is scoped to
  // the canvas element  this canvas is `pointer-events: none` so it never
  // steals clicks from the CTAs in front of it, which also means it never
  // receives the pointermove events R3F would otherwise use.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!active || !group.current) return;
    group.current.rotation.y += delta * 0.06;
    tilt.current.y += (pointer.current.x * 0.18 - tilt.current.y) * 0.04;
    tilt.current.x += (pointer.current.y * -0.12 - tilt.current.x) * 0.04;
    group.current.rotation.x = tilt.current.x;
    // Re-arms the next frame under frameloop="demand"  the moment `active`
    // goes false (hero scrolled out of view) this stops getting called and
    // the render loop goes idle on its own.
    invalidate();
  });

  return (
    <group ref={group}>
      {EDGES.map(([a, b], i) => (
        <Edge key={i} from={NODES[a]} to={NODES[b]} />
      ))}
      {NODES.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#22D3EE" : "#4C86FF"} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroSceneCanvas({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 3.6], fov: 42 }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      <Graph active={active} />
    </Canvas>
  );
}
