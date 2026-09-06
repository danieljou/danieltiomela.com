"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";
import type { RefObject } from "react";
import { CAMERA_OFFSET, POINTS } from "./constants";
import { Nodes } from "./Nodes";
import { Connections } from "./Connections";
import { DataFlow } from "./DataFlow";
import { GeoLayer } from "./GeoLayer";
import { ClusterReveal } from "./ClusterReveal";

/**
 * Camera on its own curve, offset above and behind the node curve  it
 * needs to look AT the nodes, not sit inside them. Sharing one curve for
 * both put the camera inside the first sphere at progress 0, an empty frame.
 */
function Journey({
  progressRef,
  active,
}: {
  progressRef: RefObject<number>;
  active: boolean;
}) {
  const curve = useMemo(
    () => new CatmullRomCurve3(POINTS.map((p) => new Vector3(...p))),
    [],
  );
  const displayed = useRef(0);
  const { camera, invalidate } = useThree();
  const lookTarget = useRef(new Vector3());

  useFrame(() => {
    if (!active) return;
    displayed.current += (progressRef.current - displayed.current) * 0.06;
    const t = Math.min(0.999, Math.max(0, displayed.current));
    const point = curve.getPointAt(t);
    const ahead = curve.getPointAt(Math.min(0.999, t + 0.08));
    camera.position.copy(point).add(CAMERA_OFFSET);
    lookTarget.current.copy(ahead);
    camera.lookAt(lookTarget.current);
    // Re-arms the next frame under frameloop="demand". Every other useFrame
    // in this scene (Nodes, DataFlow, GeoLayer, ClusterReveal) rides this
    // same render loop rather than calling invalidate() itself.
    invalidate();
  });

  return null;
}

export default function SystemJourneyCanvas({
  progressRef,
  active,
  onHover,
}: {
  progressRef: RefObject<number>;
  active: boolean;
  onHover: (label: string | null) => void;
}) {
  const initialCameraPosition: [number, number, number] = [
    POINTS[0][0] + CAMERA_OFFSET.x,
    POINTS[0][1] + CAMERA_OFFSET.y,
    POINTS[0][2] + CAMERA_OFFSET.z,
  ];

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: initialCameraPosition, fov: 50 }}
    >
      <ambientLight intensity={1} />
      <Journey progressRef={progressRef} active={active} />
      <Nodes progressRef={progressRef} />
      <Connections />
      <DataFlow />
      <GeoLayer progressRef={progressRef} />
      <ClusterReveal progressRef={progressRef} onHover={onHover} />
    </Canvas>
  );
}
