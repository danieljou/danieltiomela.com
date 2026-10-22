"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Glow } from "../shared/Glow";
import { JOURNEY_CURVE } from "./constants";

const PACKETS = 9;

/**
 * Packets riding the same curve the camera follows, so the eye is always
 * carried forward with the traffic. No `invalidate()` of its own; it rides
 * the render loop `Journey` keeps alive (see SystemJourneyCanvas).
 */
export function DataFlow() {
  const refs = useRef<(Group | null)[]>([]);

  useFrame((state) => {
    for (let i = 0; i < PACKETS; i++) {
      const g = refs.current[i];
      if (!g) continue;
      const t = (state.clock.elapsedTime * 0.07 + i / PACKETS) % 1;
      JOURNEY_CURVE.getPointAt(t, g.position);
      g.scale.setScalar(0.7 + Math.sin(t * Math.PI) * 0.6);
    }
  });

  return (
    <>
      {Array.from({ length: PACKETS }, (_, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Glow color="#67E8F9" scale={0.45} opacity={0.9} />
        </group>
      ))}
    </>
  );
}
