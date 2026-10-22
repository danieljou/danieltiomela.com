"use client";

import { useMemo } from "react";
import { TubeGeometry } from "three";
import { JOURNEY_CURVE } from "./constants";

/** The route a request takes: a thin bright core inside a wide soft sleeve. */
export function Connections() {
  const core = useMemo(() => new TubeGeometry(JOURNEY_CURVE, 160, 0.014, 8, false), []);
  const sleeve = useMemo(() => new TubeGeometry(JOURNEY_CURVE, 80, 0.07, 8, false), []);
  return (
    <>
      <mesh geometry={sleeve}>
        <meshBasicMaterial color="#2F6BFF" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh geometry={core}>
        <meshBasicMaterial color="#67E8F9" transparent opacity={0.8} />
      </mesh>
    </>
  );
}
