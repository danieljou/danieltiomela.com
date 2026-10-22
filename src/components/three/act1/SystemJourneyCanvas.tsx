"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { RefObject } from "react";
import { CAMERA_OFFSET, JOURNEY_CURVE, POINTS } from "./constants";
import { Nodes } from "./Nodes";
import { Connections } from "./Connections";
import { DataFlow } from "./DataFlow";
import { GeoLayer } from "./GeoLayer";
import { ClusterReveal } from "./ClusterReveal";
import { Dust } from "../shared/Dust";
import { Floor } from "../shared/Floor";

const DUST_SIZE: [number, number, number] = [10, 5, 14];

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
  const displayed = useRef(0);
  const { invalidate } = useThree();
  const lookTarget = useRef(new Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  const sway = useRef({ x: 0, y: 0 });

  // Window-level, not canvas events: the nodes' own hover handlers need the
  // canvas, the camera sway only needs to know where the cursor is.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const camera = state.camera;
    if (!active) return;
    displayed.current += (progressRef.current - displayed.current) * 0.06;
    const t = Math.min(0.999, Math.max(0, displayed.current));
    const point = JOURNEY_CURVE.getPointAt(t);
    const ahead = JOURNEY_CURVE.getPointAt(Math.min(0.999, t + 0.08));
    sway.current.x += (pointer.current.x * 0.35 - sway.current.x) * 0.05;
    sway.current.y += (pointer.current.y * -0.2 - sway.current.y) * 0.05;
    camera.position.copy(point).add(CAMERA_OFFSET);
    camera.position.x += sway.current.x;
    camera.position.y += sway.current.y;
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
  stageLabels,
  onSelectStage,
}: {
  progressRef: RefObject<number>;
  active: boolean;
  onHover: (label: string | null) => void;
  stageLabels: string[];
  onSelectStage: (index: number) => void;
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
      <fogExp2 attach="fog" args={["#0a1122", 0.085]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} color="#cfe3ff" />
      <pointLight position={[0, 1, 0]} intensity={2} distance={9} color="#22D3EE" />
      <Floor />
      <Dust count={520} size={DUST_SIZE} px={0.06} />
      <Dust
        count={160}
        size={DUST_SIZE}
        px={0.12}
        opacity={0.35}
        color="#4C86FF"
        seed={19}
        drift={-0.006}
      />
      <Journey progressRef={progressRef} active={active} />
      <Nodes
        progressRef={progressRef}
        labels={stageLabels}
        onHover={onHover}
        onSelect={onSelectStage}
      />
      <Connections />
      <DataFlow />
      <GeoLayer progressRef={progressRef} />
      <ClusterReveal progressRef={progressRef} onHover={onHover} />
    </Canvas>
  );
}
