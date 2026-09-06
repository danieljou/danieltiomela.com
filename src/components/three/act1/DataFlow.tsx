"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { POINTS } from "./constants";

/**
 * One packet per edge, looping continuously while the act is in view  no
 * `invalidate()` call of its own; it rides the render loop that `Journey`
 * already keeps alive while `active`, per the section's frameloop="demand"
 * contract (see SystemJourneyCanvas).
 */
function Packet({ from, to, offset }: { from: Vector3; to: Vector3; offset: number }) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = (state.clock.elapsedTime * 0.25 + offset) % 1;
    mesh.position.lerpVectors(from, to, t);
    const pulse = Math.sin(t * Math.PI);
    mesh.scale.setScalar(0.5 + pulse * 0.6);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color="#67E8F9" />
    </mesh>
  );
}

export function DataFlow() {
  return (
    <>
      {POINTS.slice(0, -1).map((p, i) => (
        <Packet
          key={i}
          from={new Vector3(...p)}
          to={new Vector3(...POINTS[i + 1])}
          offset={i * 0.2}
        />
      ))}
    </>
  );
}
